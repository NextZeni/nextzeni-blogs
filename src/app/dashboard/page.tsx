"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProfilePageSkeleton } from "@/components/PageSkeletons";

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

  // Shimmer the profile shell we're about to land on, so the hop reads as one
  // continuous load instead of a blank interstitial.
  return <ProfilePageSkeleton />;
}
