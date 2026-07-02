import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Dot,
  FolderOpen,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
  Sun,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarOverlay,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/admin/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { db } from "@/lib/firebase";

type AdminNavChild = {
  to: string;
  label: string;
  end?: boolean;
};

type AdminNavItem = {
  to?: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
  children?: AdminNavChild[];
};

const navLinks: AdminNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  {
    label: "Projects",
    icon: <FolderOpen className="h-4 w-4" />,
    children: [
      { to: "/admin/projects", label: "All Projects", end: true },
      { to: "/admin/projects/new", label: "Add Project", end: true },
    ],
  },
  { to: "/admin/messages", label: "Messages", icon: <Mail className="h-4 w-4" />, end: true },
  { to: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" />, end: true },
];

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutInner />
    </SidebarProvider>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function UserAvatar({ name, className }: { name: string; className?: string }) {
  const initials = getInitials(name || "Admin");

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6]/15 text-sm font-semibold uppercase text-[#3b82f6] shadow-inner shadow-[#3b82f6]/10",className,
      )}
    >
      {initials || "A"}
    </div>
  );
}

function AdminLayoutInner() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { collapsed } = useSidebar();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const defaultName = "Admin";
  const fullName = (user?.name || defaultName).trim() || defaultName;
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const greetingName = nameParts.slice(0, 2).join(" ") || defaultName;
  const email = user?.email ?? "admin@example.com";
  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
  const isDashboard = normalizedPath === "/admin";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    const notificationsQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const docs = snapshot.docs.map(mapNotification);
        setNotifications(docs);
        setNotificationsLoading(false);
      },
      (error) => {
        console.error("Failed to subscribe to notifications:", error);
        setNotifications([]);
        setNotificationsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read),
    [notifications],
  );

  const notificationCount = unreadNotifications.length;

  const handleNotificationsOpenChange = async (open: boolean) => {
    setNotificationsOpen(open);
    if (open && unreadNotifications.length > 0) {
      try {
        await Promise.all(
          unreadNotifications.map((notification) =>
            updateDoc(doc(db, "notifications", notification.id), {
              read: true,
              readAt: serverTimestamp(),
            }),
          ),
        );
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <>
      <SidebarOverlay />
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar className="backdrop-blur-xl">
          <SidebarHeader className="px-2">
            <div className="flex w-full items-center justify-between gap-2 group-data-[collapsed=true]/sidebar:flex-col group-data-[collapsed=true]/sidebar:items-center group-data-[collapsed=true]/sidebar:gap-3">
              {collapsed ? (
                <SidebarBrandToggle standalone />
              ) : (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 text-sm font-semibold tracking-tight text-sidebar-foreground transition hover:border-[#3b82f6
]/40 hover:bg-[#3b82f6
]/10 hover:text-[#3b82f6
]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b82f6
] text-white shadow shadow-[#3b82f6
]/25">
                      <Shield className="h-4 w-4" />
                    </span>
                    <span>Admin</span>
                  </Link>
                  <SidebarBrandToggle />
                </>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminSidebarNav items={navLinks} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/85 px-3 py-3 text-left shadow-inner shadow-[#3b82f6
]/5 transition hover:border-[#3b82f6
]/40 hover:bg-[#3b82f6
]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6
]/40 group-data-[collapsed=true]/sidebar:flex-col group-data-[collapsed=true]/sidebar:gap-2 group-data-[collapsed=true]/sidebar:px-2"
                >
                  <UserAvatar name={user?.name ?? "Admin"} className="group-data-[collapsed=true]/sidebar:mx-auto" />
                  <div className="mr-auto flex-1 text-left group-data-[collapsed=true]/sidebar:hidden">
                    <p className="text-sm font-semibold text-foreground">{user?.name ?? "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsed=true]/sidebar:hidden" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    navigate("/");
                  }}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go to website
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    logout();
                    navigate("/admin/login");
                  }}
                  className="gap-2 text-red-500 focus:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="h-full overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Shield className="h-4 w-4 text-[#3b82f6
]" />
                  <span>{collapsed ? "Admin" : "Dashboard"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-xl border border-border/60 bg-background/80 text-muted-foreground transition hover:text-[#3b82f6
]"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <Dialog open={notificationsOpen} onOpenChange={handleNotificationsOpenChange}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hidden rounded-xl border border-border/60 bg-background/80 text-muted-foreground transition hover:text-[#3b82f6
] sm:inline-flex"
                    >
                      <Bell className="h-5 w-5" />
                      {notificationCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#3b82f6
] px-1 text-[10px] font-semibold text-white">
                          {notificationCount}
                        </span>
                      )}
                      <span className="sr-only">Open notifications</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm gap-4 rounded-3xl border border-border/70 bg-background/95 p-6 shadow-2xl shadow-[#3b82f6
]/20">
                    <DialogHeader className="text-left">
                      <DialogTitle>Notifications</DialogTitle>
                      <DialogDescription>
                        {notificationCount > 0 ? "You have new updates." : "Latest updates across your dashboard."}
                      </DialogDescription>
                    </DialogHeader>
                    {notificationsLoading ? (
                      <p className="text-sm text-muted-foreground">Loading notifications...</p>
                    ) : notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
                    ) : (
                      <div className="space-y-3 text-sm">
                        {notifications.map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              "rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm shadow-[#3b82f6]/5 transition",
                              !item.read && "border-[#3b82f6]/60 bg-[#3b82f6]/12",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-foreground">{item.title}</p>
                                {item.createdAt && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.createdAt.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-muted-foreground transition hover:text-red-500"
                                onClick={() => handleDeleteNotification(item.id)}
                                aria-label="Delete notification"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {item.body && <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
              {isDashboard && (
                <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-border/80 bg-background/70 p-6 shadow-sm shadow-[#3b82f6
]/5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <UserAvatar
                      name={fullName}
                      className="h-20 w-20 rounded-full border-2 border-[#3b82f6
]/30 bg-[#3b82f6
]/10 text-2xl"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Hallo {greetingName}</p>
                      <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{fullName}</p>
                      <p className="text-xs font-medium text-muted-foreground">{email}</p>
                    </div>
                  </div>
                </div>
              )}
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </>
  );
}

function SidebarBrandToggle({ standalone = false }: { standalone?: boolean }) {
  const { collapsed, toggleCollapsed, setOpen } = useSidebar();
  const [hovered, setHovered] = useState(false);

  const label = collapsed ? "Open sidebar" : "Collapse sidebar";
  const iconElement = standalone
    ? hovered
      ? <PanelLeftOpen className="h-5 w-5 transition-transform" />
      : <Shield className="h-5 w-5 transition-transform" />
    : collapsed
      ? <PanelLeftOpen className="h-5 w-5 transition-transform" />
      : <PanelLeftClose className="h-5 w-5 transition-transform" />;

  const handleClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setOpen((prev) => !prev);
      return;
    }
    toggleCollapsed();
  };

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={cn(
          "flex items-center justify-center shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/60 focus-visible:ring-offset-2",
          standalone
            ? "h-12 w-12 rounded-2xl border border-[#3b82f6]/50 bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90"
            : "h-10 w-10 rounded-xl border border-border/60 bg-background/90 text-[#3b82f6] hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/10",
        )}
      >
        {iconElement}
      </button>
      {hovered && !standalone && (
        <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-xl bg-[#0f0f0f] px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-black/20">
          {label}
        </span>
      )}
    </div>
  );
}

function AdminSidebarNav({ items }: { items: AdminNavItem[] }) {
  const location = useLocation();
  const { setOpen, collapsed } = useSidebar();

  const closeOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <>
      {items.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <SidebarCollapsibleItem
              key={item.label}
              item={item}
              pathname={location.pathname}
              onNavigate={closeOnMobile}
              collapsed={collapsed}
            />
          );
        }

        if (!item.to) return null;

        return (
          <SidebarMenuItem key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              title={item.label}
              onClick={closeOnMobile}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
                  "border border-transparent text-sidebar-foreground/80 hover:border-[#3b82f6]/30 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6]",
                  "group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-2",
                  isActive && "border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#3b82f6] shadow-sm shadow-[#3b82f6]/10",
                )
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3b82f6
]/30 bg-[#3b82f6
]/10 text-[#3b82f6
]">
                {item.icon}
              </span>
              <span className="truncate group-data-[collapsed=true]/sidebar:hidden">{item.label}</span>
            </NavLink>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

type SidebarCollapsibleItemProps = {
  item: AdminNavItem;
  pathname: string;
  onNavigate: () => void;
  collapsed: boolean;
};

function SidebarCollapsibleItem({ item, pathname, onNavigate, collapsed }: SidebarCollapsibleItemProps) {
  const childActive = useMemo(
    () => item.children?.some((child) => pathname.startsWith(child.to)) ?? false,
    [item.children, pathname],
  );
  const [open, setOpen] = useState(childActive);

  useEffect(() => {
    setOpen(childActive);
  }, [childActive]);

  const handleToggle = () => {
    if (collapsed) {
      setOpen(true);
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <SidebarMenuItem>
      <div className="space-y-1">
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={open}
          title={item.label}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
            "border border-transparent text-sidebar-foreground/80 hover:border-[#3b82f6]/30 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6]",
            "group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-2",
            childActive && "border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#3b82f6] shadow-sm shadow-[#3b82f6]/10",
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3b82f6
]/30 bg-[#3b82f6
]/10 text-[#3b82f6
]">
            {item.icon}
          </span>
          <span className="truncate group-data-[collapsed=true]/sidebar:hidden">{item.label}</span>
          <ChevronDown
            className={cn(
              "ml-auto h-4 w-4 text-muted-foreground transition-transform group-data-[collapsed=true]/sidebar:hidden",
              open && "rotate-180 text-[#3b82f6]",
            )}
          />
        </button>
        <div
          data-state={open ? "open" : "closed"}
          className={cn(
            "grid gap-1 pl-12 transition-all group-data-[collapsed=true]/sidebar:hidden",
            !open && "hidden",
          )}
        >
          {item.children?.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.end}
              onClick={() => {
                onNavigate();
              }}
              title={child.label}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all",
                  "border border-transparent hover:border-[#3b82f6]/20 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6]",
                  isActive && "border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#3b82f6]",
                )
              }
            >
              <Dot className="h-4 w-4 text-[#3b82f6
]" />
              <span className="truncate">{child.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </SidebarMenuItem>
  );
}

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date | null;
};

function mapNotification(document: QueryDocumentSnapshot<DocumentData>): Notification {
  const data = document.data() as Partial<Notification> & { createdAt?: { toDate?: () => Date } };
  return {
    id: document.id,
    title: data.title ?? "Notification",
    body: data.body ?? "",
    read: Boolean(data.read),
    createdAt: data.createdAt?.toDate?.() ?? null,
  };
}

