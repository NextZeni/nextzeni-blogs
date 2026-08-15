"use client";

import { usePathname } from "next/navigation";
import {
  AdminPageSkeleton,
  ArticleSkeleton,
  AuthFormSkeleton,
  EditorSkeleton,
  HomeSkeleton,
  ProfilePageSkeleton,
  ToolsPageSkeleton,
} from "./PageSkeletons";

/**
 * Shown while Firebase Auth resolves, before any page can mount.
 * Picks the shell that matches the current route so the shimmer lines up with
 * the layout that's about to replace it, instead of flashing a generic screen.
 */
export default function AppBootSkeleton() {
  const pathname = usePathname() ?? "/";

  if (pathname.startsWith("/article/")) return <ArticleSkeleton withHeader />;
  if (pathname.startsWith("/profile/") || pathname.startsWith("/dashboard")) return <ProfilePageSkeleton />;
  if (pathname.startsWith("/admin")) return <AdminPageSkeleton />;
  if (pathname.startsWith("/write")) return <EditorSkeleton withHeader />;
  if (pathname.startsWith("/auth")) return <AuthFormSkeleton />;
  if (pathname.startsWith("/tools")) return <ToolsPageSkeleton />;
  return <HomeSkeleton />;
}
