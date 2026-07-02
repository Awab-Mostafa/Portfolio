import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { useProjectsCtx } from "@/admin/context/ProjectsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";

type StatProps = {
  title: string;
  value: string;
  loading?: boolean;
};

function StatCard({ title, value, loading }: StatProps) {
  return (
    <div className="rounded-2xl border border-[#3b82f6
]/30 bg-[#3b82f6
]/10 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3b82f6
]">{title}</div>
      <div className="mt-2 text-2xl font-bold text-foreground">
        {loading ? <span className="text-sm font-medium text-muted-foreground">Loading...</span> : value}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { projects, loading: projectsLoading } = useProjectsCtx();
  const [messageCount, setMessageCount] = useState<number | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState<number | null>(null);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeMessages = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        setMessageCount(snapshot.size);
        setMessagesLoading(false);
      },
      (error) => {
        console.error("Failed to load messages:", error);
        setMessageCount(0);
        setMessagesLoading(false);
      },
    );

    const unreadQuery = query(collection(db, "notifications"), where("read", "==", false));
    const unsubscribeNotifications = onSnapshot(
      unreadQuery,
      (snapshot) => {
        setUnreadNotifications(snapshot.size);
        setNotificationsLoading(false);
      },
      (error) => {
        console.error("Failed to load notifications:", error);
        setUnreadNotifications(0);
        setNotificationsLoading(false);
      },
    );

    return () => {
      unsubscribeMessages();
      unsubscribeNotifications();
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Total Projects",
        value: projects.length.toString(),
        loading: projectsLoading,
      },
      {
        title: "Messages Received",
        value: (messageCount ?? 0).toString(),
        loading: messagesLoading,
      },
      {
        title: "Unread Notifications",
        value: (unreadNotifications ?? 0).toString(),
        loading: notificationsLoading,
      },
    ],
    [projects.length, projectsLoading, messageCount, messagesLoading, unreadNotifications, notificationsLoading],
  );

  return (
    <Card className="border border-border/70 bg-background/85 shadow-lg shadow-[#3b82f6
]/10">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Quick overview of your admin area.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} loading={stat.loading} />
        ))}
      </CardContent>
    </Card>
  );
}
