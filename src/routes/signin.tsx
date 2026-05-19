import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Admin Login — SS Packers & Movers" }] }),
  component: LoginPage,
});

type AuthAction = "signin" | "signup" | "reset" | "update";

const AUTH_REDIRECT_URL =
  import.meta.env.VITE_AUTH_REDIRECT_URL || "https://ss-move-pro-eight.vercel.app/signin";

function getAuthErrorMessage(error: { message?: string } | null | undefined, action: AuthAction) {
  const message = error?.message ?? "";
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return "That email and password do not match. Try again or reset your password.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (normalized.includes("password should be at least") || normalized.includes("password too short")) {
    return "Password must be at least 6 characters.";
  }
  if (normalized.includes("invalid email")) {
    return "Enter a valid email address.";
  }
  if (normalized.includes("signup is disabled")) {
    return "Account creation is disabled. Contact an administrator.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (normalized.includes("auth session missing") || normalized.includes("session not found")) {
    return "Your reset link has expired. Request a new one.";
  }
  if (normalized.includes("token") && normalized.includes("expired")) {
    return "Your reset link has expired. Request a new one.";
  }
  if (normalized.includes("network")) {
    return "Network error. Check your connection and try again.";
  }
  if (action === "reset") {
    return "We could not send a reset link. Please try again.";
  }
  if (action === "update") {
    return "We could not update your password. Please try again.";
  }
  if (action === "signup") {
    return "We could not create the account. Please try again.";
  }
  if (action === "signin") {
    return "We could not sign you in. Please try again.";
  }
  return message || "Something went wrong. Please try again.";
}

function getAuthLinkErrorMessage(errorCode?: string | null, errorDescription?: string | null) {
  const code = (errorCode ?? "").toLowerCase();
  if (code === "otp_expired") {
    return "This link has expired. Request a new one.";
  }
  if (code === "access_denied") {
    return "We could not verify this link. Request a new one.";
  }
  if (errorDescription) {
    return errorDescription;
  }
  return "We could not verify this link. Request a new one.";
}

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const searchParams = new URLSearchParams(window.location.search);
    const type = hashParams.get("type") ?? searchParams.get("type");
    const error = hashParams.get("error") ?? searchParams.get("error");
    const errorCode = hashParams.get("error_code") ?? searchParams.get("error_code");
    const errorDescription = hashParams.get("error_description") ?? searchParams.get("error_description");
    setRecoveryMode(type === "recovery");
    if (error || errorCode) {
      toast.error(getAuthLinkErrorMessage(errorCode ?? error, errorDescription));
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  }, []);

  useEffect(() => {
    if (recoveryMode) return;
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session) navigate({ to: "/admin" });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: "/admin" });
    });
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, recoveryMode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email to continue.");
      return;
    }
    if (!password.trim()) {
      toast.error("Enter your password to continue.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.session) {
          toast.error(getAuthErrorMessage(error, "signin"));
          return;
        }
        toast.success("Welcome back. Redirecting to the admin panel.");
        navigate({ to: "/admin" });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: AUTH_REDIRECT_URL },
      });
      if (error) {
        toast.error(getAuthErrorMessage(error, "signup"));
        return;
      }
      if (data?.user && !data.session) {
        toast.success("Account created. Check your email to confirm before signing in.");
        setMode("signin");
        return;
      }
      toast.success("Account created. Redirecting to the admin panel.");
      navigate({ to: "/admin" });
    } finally {
      setLoading(false);
    }
  }

  async function sendResetLink() {
    if (!email.trim()) {
      toast.error("Enter your email to receive a reset link.");
      return;
    }
    setResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: AUTH_REDIRECT_URL,
      });
      if (error) {
        toast.error(getAuthErrorMessage(error, "reset"));
        return;
      }
      toast.success("Reset link sent. Check your email for next steps.");
    } finally {
      setResetting(false);
    }
  }

  async function sendMagicLink() {
    if (!email.trim()) {
      toast.error("Enter your email to receive a magic link.");
      return;
    }
    setSendingMagicLink(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: AUTH_REDIRECT_URL },
      });
      if (error) {
        toast.error(getAuthErrorMessage(error, "signin"));
        return;
      }
      toast.success("Magic link sent. Check your email to sign in.");
    } finally {
      setSendingMagicLink(false);
    }
  }

  async function onUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword.trim()) {
      toast.error("Enter a new password to continue.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(getAuthErrorMessage(error, "update"));
        return;
      }
      toast.success("Password updated. Please sign in.");
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        toast.error("Password updated, but we could not sign you out. Please sign in again.");
      }
      setRecoveryMode(false);
      setNewPassword("");
      setConfirmPassword("");
      setPassword("");
      navigate({ to: "/signin" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl border border-border">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="SS Packers" className="h-14 w-auto" />
        </Link>
        <h1 className="text-2xl font-bold text-center mb-1">
          {recoveryMode ? "Reset Password" : mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {recoveryMode ? "Set a new password for your admin account." : "Manage your site content"}
        </p>
        <form onSubmit={recoveryMode ? onUpdatePassword : onSubmit} className="space-y-4">
          {recoveryMode ? (
            <>
              <div className="relative">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-6 flex items-center px-4 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" variant="brand" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-6 flex items-center px-4 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {mode === "signin" && (
                <div className="flex flex-col items-start gap-2 text-sm">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={sendResetLink}
                    disabled={resetting}
                  >
                    {resetting ? "Sending reset link..." : "Forgot password? Send reset link"}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                    onClick={sendMagicLink}
                    disabled={sendingMagicLink}
                  >
                    {sendingMagicLink ? "Sending magic link..." : "Send a magic link instead"}
                  </Button>
                </div>
              )}
              <Button type="submit" variant="brand" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
              </Button>
            </>
          )}
        </form>
        {!recoveryMode && (
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 text-sm text-primary hover:underline w-full text-center"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        )}
        <div className="mt-6 text-xs text-muted-foreground text-center">
          <Link to="/" className="hover:text-foreground">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
