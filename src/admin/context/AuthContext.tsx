import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setInitialised(true);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email: string, password: string) => {
        if (!email || !password) throw new Error("Email and password required");
        const credential = await signInWithEmailAndPassword(auth, email, password);
        setUser(mapFirebaseUser(credential.user));
      },
      logout: async () => {
        await signOut(auth);
        setUser(null);
      },
      refreshUser: async () => {
        const current = auth.currentUser;
        if (!current) {
          setUser(null);
          return;
        }
        await current.reload();
        setUser(mapFirebaseUser(current));
      },
    }),
    [user],
  );

  if (!initialised) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  const email = firebaseUser.email ?? "admin@example.com";
  const displayName =
    firebaseUser.displayName ||
    email
      .split("@")[0]
      ?.split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") ||
    "Admin";

  return {
    id: firebaseUser.uid,
    name: displayName,
    email,
  };
}
