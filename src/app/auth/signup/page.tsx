"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, ShieldAlert, CheckCircle2, User as UserIcon, BookOpen, PenTool } from "lucide-react";

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"reader" | "writer">("reader");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
          router.push(`/auth/login?verify=sent&email=${encodeURIComponent(email)}`);
        }, 3000);
      } else {
        setError(res.error ?? "Failed to create account. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);

    try {
      const res = await loginWithGoogle();
      setGoogleLoading(false);

      if (res.success) {
        // Since Google auth automatically verifies the email, we can sign in directly and redirect to home
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else if (!res.cancelled) {
        setError(res.error ?? "Failed to sign up with Google.");
      }
    } catch (err) {
      setGoogleLoading(false);
      setError("An error occurred during Google sign up.");
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
          {success && !googleLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
              <CheckCircle2 size={48} className="text-accent mb-4 animate-bounce" />
              <h3 className="text-lg font-semibold text-foreground">Verification Link Sent!</h3>
              <p className="text-sm text-secondary mt-2 max-w-sm">
                We've sent a verification email to <span className="font-semibold text-foreground">{email}</span>. Please click the link inside it to verify your account, and then log in.
              </p>
              <p className="text-xs text-secondary/60 mt-6">Redirecting you to the sign in page...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Google Signup Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-border rounded-full text-sm font-semibold text-foreground bg-white hover:bg-surface focus:outline-none transition-colors cursor-pointer shadow-sm disabled:opacity-55"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                {googleLoading ? "Signing up..." : "Sign up with Google"}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-border/80"></div>
                <span className="flex-shrink mx-4 text-secondary/60 text-xs font-semibold uppercase tracking-wider">Or email</span>
                <div className="flex-grow border-t border-border/80"></div>
              </div>

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
                    disabled={loading || googleLoading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full text-sm font-semibold text-white bg-button hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors cursor-pointer disabled:opacity-55"
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </button>
                </div>
              </form>
            </div>
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
