import { Navigate } from "react-router-dom";

import { useAuth } from "@/admin/context/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
