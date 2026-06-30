"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@nextzeni.com", password: "admin123" },
  { role: "Writer (Shreyas)", email: "shreyas@example.com", password: "password123" },
  { role: "Writer (Priya)", email: "priya@example.com", password: "password123" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          // If admin, redirect to admin blogs, otherwise home/dashboard
          if (email === "admin@nextzeni.com") {
            router.push("/admin/blogs");
          } else {
            router.push("/");
          }
        }, 800);
      } else {
        setError(res.error ?? "Failed to sign in. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  }

  function handleAutoFill(demoEmail: string, demoPass: string) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block text-3xl font-extrabold tracking-tighter mb-2">
            <span className="font-light text-secondary">Next</span>
            <span className="text-foreground">Zeni</span>
          </Link>
          <h2 className="serif text-2xl font-bold tracking-tight text-foreground mt-4">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Share your ideas, read curated content, and grow.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card px-6 py-8 sm:px-10 shadow-sm border border-border">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 size={48} className="text-accent mb-4 animate-bounce" />
              <h3 className="text-lg font-semibold text-foreground">Signed in successfully</h3>
              <p className="text-sm text-secondary mt-1">Redirecting you now...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2.5 animate-fadeIn">
                  <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-secondary/40 pointer-events-none">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-shadow duration-200 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-foreground">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-secondary/40 pointer-events-none">
                    <KeyRound size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-shadow duration-200 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full text-sm font-semibold text-white bg-button hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors cursor-pointer disabled:opacity-55"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-6 border-t border-border pt-6 text-center">
              <p className="text-sm text-secondary">
                No account yet?{" "}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-accent hover:opacity-85 transition-opacity"
                >
                  Create one now
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Demo Accounts Panel */}
        {/* {!success && (
          <div className="mt-6 bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
              Demo Accounts (Click to Auto-fill)
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleAutoFill(acc.email, acc.password)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:bg-surface text-left text-xs transition-colors group cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {acc.role}
                    </span>
                    <span className="block text-secondary mt-0.5">{acc.email}</span>
                  </div>
                  <span className="font-mono bg-secondary/8 text-secondary px-2 py-0.5 rounded border border-border/30">
                    {acc.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
