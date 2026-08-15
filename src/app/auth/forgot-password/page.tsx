"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldAlert, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await resetPassword(email);
      setLoading(false);

      if (res.success) {
        setSent(true);
      } else {
        setError(res.error ?? "Could not send the reset link. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block text-3xl font-extrabold tracking-tighter mb-2">
            <span className="font-light text-secondary">Next</span>
            <span className="text-foreground">Zeni</span>
          </Link>
          <h2 className="serif text-2xl font-bold tracking-tight text-foreground mt-4">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-secondary">
            We&apos;ll email you a link to choose a new one.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card px-6 py-8 sm:px-10 shadow-sm border border-border">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <MailCheck size={48} className="text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Check your inbox</h3>
              <p className="text-sm text-secondary mt-2">
                If an account exists for <span className="font-semibold text-foreground">{email}</span>,
                we&apos;ve sent a password reset link. It may take a minute to arrive — remember to
                check your spam folder.
              </p>
              <Link
                href="/auth/login"
                className="mt-6 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full text-sm font-semibold text-white bg-button hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
              >
                Back to sign in
              </Link>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-3 text-sm text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                Use a different email
              </button>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full text-sm font-semibold text-white bg-button hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors cursor-pointer disabled:opacity-55"
                >
                  {loading ? "Sending link..." : "Send reset link"}
                </button>
              </div>
            </form>
          )}

          {!sent && (
            <div className="mt-6 border-t border-border pt-6 text-center">
              <p className="text-sm text-secondary">
                Remembered it?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-accent hover:opacity-85 transition-opacity"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
