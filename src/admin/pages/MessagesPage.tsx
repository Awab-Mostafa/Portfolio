import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";

type Message = { id: string; name: string; email: string; text: string; category: string };

const messagesCollection = collection(db, "messages");
const messagesQuery = query(messagesCollection, orderBy("createdAt", "desc"));

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMessage, setSheetMessage] = useState<Message | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const items: Message[] = snapshot.docs.map((document) => {
          const data = document.data() as Partial<Message>;
          return {
            id: document.id,
            name: data.name ?? "Unknown sender",
            email: data.email ?? "unknown@example.com",
            text: data.text ?? "",
            category: data.category ?? "General",
          };
        });
        setMessages(items);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load messages:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(messages.map((message) => message.category)));
    return ["all", ...uniqueCategories];
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const queryText = searchTerm.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesCategory = categoryFilter === "all" || message.category === categoryFilter;
      const matchesQuery =
        queryText.length === 0 ||
        message.name.toLowerCase().includes(queryText) ||
        message.email.toLowerCase().includes(queryText) ||
        message.text.toLowerCase().includes(queryText);
      return matchesCategory && matchesQuery;
    });
  }, [messages, searchTerm, categoryFilter]);

  const hasActiveFilters = categoryFilter !== "all" || searchTerm.trim().length > 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const snapshot = await getDocs(messagesQuery);
      const items: Message[] = snapshot.docs.map((document) => {
        const data = document.data() as Partial<Message>;
        return {
          id: document.id,
          name: data.name ?? "Unknown sender",
          email: data.email ?? "unknown@example.com",
          text: data.text ?? "",
          category: data.category ?? "General",
        };
      });
      setMessages(items);
    } catch (error) {
      console.error("Failed to refresh messages:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenSheet = (message: Message) => {
    setSheetMessage(message);
    setSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setSheetMessage(null);
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard?.writeText(email);
    } catch {
      // ignore
    }
  };

  return (
  <Card className="border border-border/70 bg-background/85 shadow-lg shadow-[#3b82f6]/10">
    <CardHeader>
      <CardTitle>Messages</CardTitle>
      <CardDescription>Inquiries from your contact form.</CardDescription>
    </CardHeader>

    <CardContent className="grid gap-4 sm:gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, or message"
            className="w-full rounded-2xl border-border/60 bg-background/90 sm:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const isActive = categoryFilter === category;
              return (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                  className={cn(
                    "rounded-full border-border/60 bg-background/80 text-xs font-semibold uppercase tracking-[0.18em]",
                    isActive && "border-[#3b82f6]/60 bg-[#3b82f6]/15 text-[#3b82f6]",
                  )}
                >
                  {category === "all" ? "All" : category}
                </Button>
              );
            })}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
                className="rounded-full text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-full border border-border/60 bg-background/80 text-muted-foreground transition hover:text-[#3b82f6]"
        >
          <RefreshCcw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          <span className="sr-only">Refresh messages</span>
        </Button>
      </div>

      {hasActiveFilters && (
        <p className="text-xs text-muted-foreground">
          {categoryFilter !== "all" ? `Category: ${categoryFilter}` : null}
          {categoryFilter !== "all" && searchTerm ? " · " : null}
          {searchTerm ? `Search: “${searchTerm}”` : null}
        </p>
      )}

      {loading ? (
        <p className="rounded-xl border border-border/60 bg-background/70 p-6 text-center text-sm text-muted-foreground">
          Loading messages...
        </p>
      ) : filteredMessages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-background/70 p-6 text-center text-sm text-muted-foreground">
          No messages match your search.
        </p>
      ) : (
        <div className="grid gap-3">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="rounded-xl border border-border/60 bg-background/80 p-4"
            >
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>{message.email}</span>
                <span className="rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3b82f6]">
                  {message.category}
                </span>
              </div>

              <div className="font-medium text-foreground">{message.name}</div>
              <p className="text-sm text-foreground/90">{message.text}</p>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenSheet(message)}
                >
                  Actions
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>

    <Sheet open={sheetOpen && !!sheetMessage} onOpenChange={handleSheetChange}>
      {sheetMessage && (
        <SheetContent className="w-full max-w-md border-border/70 bg-background/95">
          <SheetHeader>
            <SheetTitle>{sheetMessage.name}</SheetTitle>
            <SheetDescription>{sheetMessage.email}</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 text-sm text-foreground/90">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Message
              </p>
              <p className="mt-2 whitespace-pre-line">{sheetMessage.text}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Category
              </p>
              <p className="mt-2 inline-flex rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#3b82f6]">
                {sheetMessage.category}
              </p>
            </div>
          </div>

          <SheetFooter>
            <Button className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90" asChild>
              <a href={`mailto:${sheetMessage.email}`} className="text-white">
                Reply via Email
              </a>
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleCopyEmail(sheetMessage.email)}
            >
              Copy Email
            </Button>
          </SheetFooter>
        </SheetContent>
      )}
    </Sheet>
  </Card>
);

}
