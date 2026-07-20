"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(`/profile/${user.id}`);
    } else {
      router.replace("/auth/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-sans">
      <p className="text-secondary text-sm font-medium animate-pulse">Redirecting to profile dashboard...</p>
    </div>
  );
}
