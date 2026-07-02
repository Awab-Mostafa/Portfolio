import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/admin/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email);
    setFirstName(user.name);
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.currentUser) {
      setError("You need to be logged in to update your profile.");
      return;
    }
    if (!currentPassword.trim()) {
      setError("Current password is required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setSuccess(null);

    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email ?? email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      const displayName = firstName.trim();
      const updateMessages: string[] = [];

      if (displayName && displayName !== (currentUser.displayName ?? "").trim()) {
        await updateProfile(currentUser, { displayName });
        updateMessages.push("Display name updated.");
      }

      let emailVerificationSent = false;
      if (email && email !== (currentUser.email ?? "")) {
        try {
          await updateEmail(currentUser, email);
          updateMessages.push("Email updated.");
        } catch (err) {
          if (err instanceof FirebaseError && err.code === "auth/operation-not-allowed") {
            await verifyBeforeUpdateEmail(currentUser, email);
            emailVerificationSent = true;
            updateMessages.push("Verification email sent to confirm your new address.");
          } else {
            throw err;
          }
        }
      }
      if (password) {
        await updatePassword(currentUser, password);
        updateMessages.push("Password updated.");
      }

      if (updateMessages.length > 0) {
        await refreshUser();
      }

      if (emailVerificationSent) {
        setSuccess("A verification link has been sent to your new email. Please verify to finish updating.");
      } else if (updateMessages.length > 0) {
        setSuccess(updateMessages.join(" "));
      } else {
        setSuccess("Nothing to update.");
      }
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/wrong-password":
            setError("The current password is incorrect.");
            break;
          case "auth/weak-password":
            setError("The new password is too weak. Please choose a stronger password.");
            break;
          case "auth/email-already-in-use":
            setError("This email is already in use. Try a different one.");
            break;
          default:
            setError(err.message || "Failed to update account. Please try again.");
        }
      } else {
        setError("Failed to update account. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border border-border/70 bg-background/85 shadow-lg shadow-[#3b82f6
]/10">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your profile information and credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="firstName">Display Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Mohamed Mahmoud"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Current password"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password (optional)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-500">{success}</p>}
          <div className="flex items-center justify-end">
            <Button type="submit" className="bg-[#3b82f6
] hover:bg-[#3b82f6
]/90" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
