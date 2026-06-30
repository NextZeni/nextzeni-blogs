"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, ShieldAlert, CheckCircle2, User as UserIcon, BookOpen, PenTool } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"reader" | "writer">("reader");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signup({
        firstName,
        lastName,
        email,
        password,
        role,
        bio: role === "writer" ? "Aspiring tech writer" : "Avid reader",
      });
      setLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setError(res.error ?? "Failed to create account. Please try again.");
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Join our community of writers and readers.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="card px-6 py-8 sm:px-10 shadow-sm border border-border">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 size={48} className="text-accent mb-4 animate-bounce" />
              <h3 className="text-lg font-semibold text-foreground">Account created successfully</h3>
              <p className="text-sm text-secondary mt-1">Taking you to the home page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2.5 animate-fadeIn">
                  <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    First name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-secondary/40 pointer-events-none">
                      <UserIcon size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-shadow duration-200 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Last name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-secondary/40 pointer-events-none">
                      <UserIcon size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-shadow duration-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="jane.doe@example.com"
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-shadow duration-200 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Password
                </label>
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

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  What is your primary goal?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("reader")}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      role === "reader"
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-border bg-white hover:bg-surface"
                    }`}
                  >
                    <BookOpen
                      size={18}
                      className={`mt-0.5 flex-shrink-0 ${role === "reader" ? "text-accent" : "text-secondary"}`}
                    />
                    <div>
                      <span className="block text-sm font-semibold text-foreground">Reader</span>
                      <span className="block text-xs text-secondary mt-0.5">
                        Read, bookmark, and clap for stories you love.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("writer")}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      role === "writer"
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-border bg-white hover:bg-surface"
                    }`}
                  >
                    <PenTool
                      size={18}
                      className={`mt-0.5 flex-shrink-0 ${role === "writer" ? "text-accent" : "text-secondary"}`}
                    />
                    <div>
                      <span className="block text-sm font-semibold text-foreground">Writer</span>
                      <span className="block text-xs text-secondary mt-0.5">
                        Publish articles, build audience, see analytics.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full text-sm font-semibold text-white bg-button hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors cursor-pointer disabled:opacity-55"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-6 border-t border-border pt-6 text-center">
              <p className="text-sm text-secondary">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-accent hover:opacity-85 transition-opacity"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
