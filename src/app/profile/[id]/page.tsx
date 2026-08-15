"use client";

import { useMemo, useState, useEffect, startTransition, ViewTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useBlogs } from "@/context/BlogContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfileSkeleton, StoryListSkeleton } from "@/components/PageSkeletons";
import SmartImage from "@/components/SmartImage";
import { getInitials, formatNum } from "@/data/dummy";
import {
  Calendar, Users, FileText, ArrowRight, Eye, Heart, Edit3, MapPin, Globe,
  CheckCircle, Hourglass, XCircle, Clock, BarChart2, Pencil, Trash2, PenLine
} from "lucide-react";

// Custom Social Icon SVGs to bypass legacy Lucide-React version constraints & lock dimensions safely
const TwitterIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const GithubIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

const WebsiteIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const PinterestIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.102-.947-.19-2.399.04-3.43.207-.887 1.334-5.642 1.334-5.642s-.34-.68-.34-1.686c0-1.58.917-2.76 2.06-2.76 1.016 0 1.507.76 1.507 1.67 0 1.02-.65 2.54-.985 3.96-.28 1.18.599 2.146 1.762 2.146 2.115 0 3.743-2.23 3.743-5.449 0-2.848-2.048-4.84-4.966-4.84-3.38 0-5.36 2.53-5.36 5.148 0 1.02.393 2.117.88 2.709.097.118.11.22.08.344l-.34 1.385c-.055.22-.18.268-.415.158-1.55-.72-2.518-2.985-2.518-4.793 0-3.899 2.833-7.482 8.18-7.482 4.293 0 7.63 3.06 7.63 7.15 0 4.268-2.69 7.707-6.42 7.707-1.254 0-2.433-.651-2.837-1.42l-.773 2.94c-.28 1.066-1.037 2.404-1.543 3.228 1.127.35 2.32.54 3.555.54 6.622 0 11.988-5.366 11.988-11.987C24.004 5.367 18.638 0 12.017 0z" />
  </svg>
);

const ThreadsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13.56 12.38c-.1-.76-.66-1.28-1.46-1.28-.76 0-1.34.52-1.48 1.28h2.94zm2.14 0c-.1 1.74-1.38 3.12-3.34 3.12-1.42 0-2.64-.78-3.14-2h6.58c.04-.38.08-.74.08-1.12 0-3.04-2.18-5.18-5.24-5.18-3.14 0-5.24 2.2-5.24 5.18 0 3.06 2.18 5.24 5.24 5.24 1.34 0 2.58-.46 3.58-1.3l.08.08c1.38 1.38 3.32 1.66 4.96.8a8.3 8.3 0 0 0 4.46-7.38c0-5.18-4.22-9.4-9.4-9.4S2.6 6.82 2.6 12s4.22 9.4 9.4 9.4c1.92 0 3.76-.58 5.3-1.68l-1.3-1.64A9.5 9.5 0 0 1 12 19.34c-4.08 0-7.4-3.32-7.4-7.4s3.32-7.4 7.4-7.4 7.4 3.32 7.4 7.4c0 2.42-1.34 4.36-3.4 4.36-1 0-1.78-.54-2.16-1.32-.4.8-.96 1.32-1.92 1.32-1.8 0-2.92-1.42-2.92-3.34 0-1.94 1.12-3.36 2.92-3.36.96 0 1.52.52 1.92 1.3.16-.76.78-1.3 1.78-1.3.94 0 1.84.48 2.22 1.26a5.55 5.55 0 0 1 .1 1.26h.02z" />
  </svg>
);

const STATUS_CONFIG = {
  published: {
    label: "Published",
    icon: CheckCircle,
    classes: "bg-green-50 text-green-700 border border-green-200",
  },
  pending: {
    label: "Pending Review",
    icon: Hourglass,
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    classes: "bg-red-50 text-red-700 border border-red-200",
  },
  draft: {
    label: "Draft",
    icon: Clock,
    classes: "bg-secondary/8 text-secondary border border-border",
  },
};

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { users, usersLoading, user: currentUser, toggleFollowUser, updateUser } = useAuth();
  const { blogs, loading: blogsLoading, deleteBlog } = useBlogs();

  const [followLoading, setFollowLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"stories" | "dashboard">("stories");
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const profileUser = useMemo(() => {
    return users.find((u) => u.id === id);
  }, [users, id]);

  // Form states
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editProfilePic, setEditProfilePic] = useState("");
  const [editTwitter, setEditTwitter] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editFacebook, setEditFacebook] = useState("");
  const [editPinterest, setEditPinterest] = useState("");
  const [editThreads, setEditThreads] = useState("");

  // Sync editor fields on entering edit mode
  useEffect(() => {
    if (profileUser && isEditing) {
      setEditFirstName(profileUser.firstName);
      setEditLastName(profileUser.lastName || "");
      setEditBio(profileUser.bio || "");
      setEditAbout(profileUser.about || "");
      setEditCountry(profileUser.country || "");
      setEditProfilePic(profileUser.profilePic || "");
      setEditTwitter(profileUser.socials?.twitter || "");
      setEditLinkedin(profileUser.socials?.linkedin || "");
      setEditGithub(profileUser.socials?.github || "");
      setEditWebsite(profileUser.socials?.website || "");
      setEditInstagram(profileUser.socials?.instagram || "");
      setEditFacebook(profileUser.socials?.facebook || "");
      setEditPinterest(profileUser.socials?.pinterest || "");
      setEditThreads(profileUser.socials?.threads || "");
    }
  }, [profileUser, isEditing]);

  // Synchronize tab parameter from URL query string if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get("tab");
      if (tab === "dashboard" || tab === "stories") {
        setActiveTab(tab as "stories" | "dashboard");
      }
    }
  }, [id]);

  const isFollowing = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.followingUsers?.includes(id as string) ?? false;
  }, [currentUser, id]);

  // Public published blogs
  const authorBlogs = useMemo(() => {
    return blogs.filter((b) => b.authorId === id && b.status === "published");
  }, [blogs, id]);

  // All blogs owned by the profile user (for dashboard computations)
  const myAllBlogs = useMemo(() => {
    return blogs.filter((b) => b.authorId === id);
  }, [blogs, id]);

  const totalViews = useMemo(() => {
    return myAllBlogs.reduce((sum, b) => sum + (b.views ?? 0), 0);
  }, [myAllBlogs]);

  const publishedCount = useMemo(() => {
    return myAllBlogs.filter((b) => b.status === "published").length;
  }, [myAllBlogs]);

  const pendingCount = useMemo(() => {
    return myAllBlogs.filter((b) => b.status === "pending").length;
  }, [myAllBlogs]);

  const fullName = profileUser
    ? `${profileUser.firstName} ${profileUser.lastName}`
    : "Author Profile";

  const initials = getInitials(fullName);

  async function handleFollowToggle() {
    if (!currentUser) return;
    setFollowLoading(true);
    try {
      await toggleFollowUser(id as string);
    } catch (err) {
      console.error("Failed to follow:", err);
    } finally {
      setFollowLoading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateUser({
        firstName: editFirstName,
        lastName: editLastName,
        bio: editBio,
        about: editAbout,
        country: editCountry,
        profilePic: editProfilePic,
        socials: {
          twitter: editTwitter,
          linkedin: editLinkedin,
          github: editGithub,
          website: editWebsite,
          instagram: editInstagram,
          facebook: editFacebook,
          pinterest: editPinterest,
          threads: editThreads,
        }
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(blogId: string) {
    setDeletingId(blogId);
    try {
      await deleteBlog(blogId);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  const handleTabChange = (tab: "stories" | "dashboard") => {
    startTransition(() => setActiveTab(tab));
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.pushState({}, "", url.toString());
    }
  };

  // Users stream in from Firestore — shimmer the profile rather than
  // flashing "user not found" before the snapshot lands.
  if (!profileUser && usersLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header />
        <ProfileSkeleton />
        <Footer />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-[1100px] mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/8 flex items-center justify-center mb-4">
            <Users size={24} className="text-secondary/40" />
          </div>
          <h2 className="text-xl font-bold text-foreground">User not found</h2>
          <p className="text-sm text-secondary mt-1 max-w-xs">
            We couldn&apos;t locate this user profile in our database.
          </p>
          <Link href="/" className="mt-6 text-sm text-accent hover:underline font-semibold">
            ← Back to home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-[950px] mx-auto w-full px-6 pt-10 pb-24">
        
        {/* Header Hero Area */}
        <div className="relative border-b border-border pb-10 mb-10">
          
          {isEditing ? (
            /* SLEEK INLINE EDITING PANEL */
            <form onSubmit={handleSaveProfile} className="space-y-6 bg-secondary/3 p-6 md:p-8 rounded-3xl border border-border/80 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Edit3 size={16} className="text-accent" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Edit Profile Settings</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold border border-border text-secondary hover:text-foreground transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-1.5 rounded-full text-xs font-semibold bg-button text-white hover:bg-button/90 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full bg-white border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full bg-white border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1">
                    <MapPin size={11} /> Country / Location
                  </label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full bg-white border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent"
                    placeholder="e.g. India, Germany"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1">
                    <Globe size={11} /> Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={editProfilePic}
                    onChange={(e) => setEditProfilePic(e.target.value)}
                    className="w-full bg-white border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Short Bio (One-line bio/tagline)</label>
                <input
                  type="text"
                  maxLength={160}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  placeholder="Tell your readers what you write about..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">About (Detailed writer history)</label>
                <textarea
                  rows={4}
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none font-sans"
                  placeholder="Share a longer story about your work, journey, topics of interest, or contact info..."
                />
              </div>

              {/* SOCIAL MEDIA INPUTS */}
              <div className="border-t border-border/40 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <TwitterIcon className="text-[#1DA1F2]" /> Twitter / X URL
                    </label>
                    <input
                      type="url"
                      value={editTwitter}
                      onChange={(e) => setEditTwitter(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <LinkedinIcon className="text-[#0077B5]" /> LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={editLinkedin}
                      onChange={(e) => setEditLinkedin(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <GithubIcon className="text-[#24292e]" /> GitHub URL
                    </label>
                    <input
                      type="url"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <WebsiteIcon className="text-secondary" /> Website / Blog URL
                    </label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <InstagramIcon className="text-[#E1306C]" /> Instagram URL
                    </label>
                    <input
                      type="url"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <FacebookIcon className="text-[#1877F2]" /> Facebook URL
                    </label>
                    <input
                      type="url"
                      value={editFacebook}
                      onChange={(e) => setEditFacebook(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <PinterestIcon className="text-[#BD081C]" /> Pinterest URL
                    </label>
                    <input
                      type="url"
                      value={editPinterest}
                      onChange={(e) => setEditPinterest(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://pinterest.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                      <ThreadsIcon className="text-foreground" /> Threads URL
                    </label>
                    <input
                      type="url"
                      value={editThreads}
                      onChange={(e) => setEditThreads(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                      placeholder="https://threads.net/@username"
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* PREVIEW / VISITOR PROFILE VIEW */
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent/15 flex items-center justify-center text-2xl md:text-3xl font-extrabold text-accent flex-shrink-0 shadow-inner">
                    <SmartImage
                      src={profileUser.profilePic}
                      alt={fullName}
                      loading="eager"
                      wrapperClassName="w-full h-full rounded-full"
                      className="w-full h-full object-cover rounded-full"
                      fallback={<>{initials}</>}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        {fullName}
                      </h1>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          profileUser.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : profileUser.role === "writer"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {profileUser.role}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mt-1.5 leading-relaxed max-w-xl">
                      {profileUser.bio || "No biography provided."}
                    </p>
                    
                    {/* Meta details row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        Joined {profileUser.joinDate || "2026"}
                      </span>
                      {profileUser.country && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-secondary/60" />
                          {profileUser.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Follow / Edit Profile Toggle Button */}
                <div className="flex-shrink-0">
                  {currentUser && currentUser.id === profileUser.id ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 rounded-full text-sm font-semibold border border-border text-foreground hover:border-foreground hover:bg-secondary/5 transition-all duration-200 cursor-pointer flex items-center gap-2"
                    >
                      <Edit3 size={14} />
                      Edit Profile
                    </button>
                  ) : (
                    currentUser && currentUser.id !== profileUser.id && (
                      <button
                        onClick={handleFollowToggle}
                        disabled={followLoading}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                          isFollowing
                            ? "border border-accent text-accent bg-accent/5 hover:bg-accent/10"
                            : "bg-button text-white hover:bg-button/90"
                        }`}
                      >
                        {followLoading ? "Processing..." : isFollowing ? "Following" : "Follow"}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* About section card */}
              {profileUser.about && (
                <div className="mt-8 bg-secondary/3 p-5 md:p-6 rounded-2xl border border-border/60">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">About</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed font-light whitespace-pre-line">
                    {profileUser.about}
                  </p>
                  
                  {/* Connect Row */}
                  {profileUser.socials && Object.values(profileUser.socials).some(Boolean) && (
                    <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs text-secondary/60 mr-2 font-medium">Connect:</span>
                      {profileUser.socials.twitter && (
                        <a href={profileUser.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="Twitter / X">
                          <TwitterIcon />
                        </a>
                      )}
                      {profileUser.socials.linkedin && (
                        <a href={profileUser.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="LinkedIn">
                          <LinkedinIcon />
                        </a>
                      )}
                      {profileUser.socials.github && (
                        <a href={profileUser.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="GitHub">
                          <GithubIcon />
                        </a>
                      )}
                      {profileUser.socials.website && (
                        <a href={profileUser.socials.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="Website">
                          <WebsiteIcon />
                        </a>
                      )}
                      {profileUser.socials.instagram && (
                        <a href={profileUser.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="Instagram">
                          <InstagramIcon />
                        </a>
                      )}
                      {profileUser.socials.facebook && (
                        <a href={profileUser.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="Facebook">
                          <FacebookIcon />
                        </a>
                      )}
                      {profileUser.socials.pinterest && (
                        <a href={profileUser.socials.pinterest} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="Pinterest">
                          <PinterestIcon />
                        </a>
                      )}
                      {profileUser.socials.threads && (
                        <a href={profileUser.socials.threads} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-secondary/10 text-secondary hover:text-accent transition-colors" title="Threads">
                          <ThreadsIcon />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Stats Bar */}
              <div className="flex items-center gap-8 mt-8 text-sm">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-foreground">
                    {formatNum(profileUser.followers)}
                  </span>
                  <span className="text-secondary text-xs">followers</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-foreground">
                    {formatNum(profileUser.following)}
                  </span>
                  <span className="text-secondary text-xs">following</span>
                </div>
                <div className="flex items-baseline gap-1.5 ml-auto">
                  <span className="font-bold text-foreground">{authorBlogs.length}</span>
                  <span className="text-secondary text-xs">stories published</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Tab Navigation (Only shown for profile owner) */}
        {currentUser && currentUser.id === profileUser.id && (
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => handleTabChange("stories")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "stories"
                  ? "border-accent text-accent"
                  : "border-transparent text-secondary hover:text-foreground"
              }`}
            >
              Public Stories ({authorBlogs.length})
            </button>
            <button
              onClick={() => handleTabChange("dashboard")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "dashboard"
                  ? "border-accent text-accent"
                  : "border-transparent text-secondary hover:text-foreground"
              }`}
            >
              <BarChart2 size={15} />
              Writer Dashboard ({myAllBlogs.length})
            </button>
          </div>
        )}

        {/* Tab Content Display */}
        <ViewTransition
          key={activeTab}
          name="profile-tab"
          share="auto"
          enter="auto"
          default="none"
        >
        <div>
        {activeTab === "dashboard" && currentUser && currentUser.id === profileUser.id ? (
          /* WRITER DASHBOARD TAB */
          <div className="space-y-10 animate-fade-in">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Views", value: formatNum(totalViews), icon: Eye, color: "text-blue-600 bg-blue-50 border border-blue-100" },
                { label: "Published", value: publishedCount, icon: CheckCircle, color: "text-green-600 bg-green-50 border border-green-100" },
                { label: "Pending Review", value: pendingCount, icon: Hourglass, color: "text-amber-600 bg-amber-50 border border-amber-100" },
                { label: "Total Stories", value: myAllBlogs.length, icon: FileText, color: "text-violet-600 bg-violet-50 border border-violet-100" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="border border-border rounded-2xl p-5 bg-white shadow-xs">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-sm text-secondary mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Manage Stories */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-foreground">Manage Stories</h3>
                <Link href="/write" className="flex items-center gap-2 bg-button text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-button/90 transition-colors">
                  <PenLine size={12} /> Write a new story
                </Link>
              </div>

              {blogsLoading ? (
                <StoryListSkeleton rows={3} />
              ) : myAllBlogs.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-white">
                  <PenLine size={32} className="text-secondary/30 mx-auto mb-3" />
                  <p className="text-secondary text-sm mb-4">You haven&apos;t written any stories yet.</p>
                  <Link href="/write" className="inline-block bg-button text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-button/90 transition-colors">
                    Write your first story
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-white shadow-xs">
                  {myAllBlogs.map((blog) => {
                    const cfg = STATUS_CONFIG[blog.status] ?? STATUS_CONFIG.draft;
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={blog.id} className="p-5 flex items-start gap-4 hover:bg-secondary/2 transition-colors">
                        <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/8 flex items-center justify-center border border-border/40">
                          <SmartImage
                            src={blog.coverImage}
                            className="w-full h-full object-cover"
                            fallback={
                              <span className="serif text-xl font-bold text-secondary/25">{blog.title[0]}</span>
                            }
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              {blog.status === "published" ? (
                                <Link href={`/article/${blog.id}`} className="font-bold text-sm hover:underline line-clamp-1 text-foreground">
                                  {blog.title}
                                </Link>
                              ) : (
                                <p className="font-bold text-sm line-clamp-1 text-foreground">{blog.title}</p>
                              )}
                              <p className="text-xs text-secondary mt-0.5 line-clamp-1">{blog.description || "No description."}</p>
                            </div>

                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${cfg.classes}`}>
                              <StatusIcon size={10} />
                              {cfg.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-3 border-t border-border/40 pt-2.5">
                            <span className="text-[11px] text-secondary">{blog.date}</span>
                            <span className="text-[11px] text-secondary">{blog.readingTime}</span>
                            <span className="flex items-center gap-1 text-[11px] text-secondary">
                              <Eye size={11} /> {formatNum(blog.views ?? 0)} views
                            </span>

                            {confirmDeleteId === blog.id ? (
                              <span className="ml-auto flex items-center gap-2 text-xs">
                                <span className="text-secondary text-[11px]">Delete?</span>
                                <button
                                  onClick={() => handleDelete(blog.id)}
                                  disabled={deletingId === blog.id}
                                  className="font-semibold text-red-600 hover:text-red-700 disabled:opacity-60 cursor-pointer"
                                >
                                  {deletingId === blog.id ? "Deleting…" : "Yes"}
                                </button>
                                <button onClick={() => setConfirmDeleteId(null)} className="text-secondary hover:text-foreground cursor-pointer">
                                  No
                                </button>
                              </span>
                            ) : (
                              <span className="ml-auto flex items-center gap-1.5">
                                <Link
                                  href={`/write?id=${blog.id}`}
                                  className="flex items-center gap-1 text-[11px] font-semibold text-secondary hover:text-accent px-2.5 py-1 rounded-lg hover:bg-secondary/8 transition-colors"
                                >
                                  <Pencil size={11} /> Edit
                                </Link>
                                <button
                                  onClick={() => setConfirmDeleteId(blog.id)}
                                  className="flex items-center gap-1 text-[11px] font-semibold text-secondary hover:text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={11} /> Delete
                                </button>
                              </span>
                            )}
                          </div>

                          {blog.status === "rejected" && blog.rejectionReason && (
                            <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                              Reason: {blog.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PUBLIC STORIES VIEW (OR PUBLIC TAB FOR WRITER) */
          <div>
            <h2 className="serif text-xl font-bold mb-6 text-foreground">
              Stories by {profileUser.firstName}
            </h2>

            {blogsLoading ? (
              <StoryListSkeleton rows={3} />
            ) : authorBlogs.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-white">
                <FileText size={32} className="text-secondary/30 mx-auto mb-3" />
                <p className="text-secondary text-sm">This author hasn&apos;t published any stories yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border border-t border-border">
                {authorBlogs.map((article) => (
                  <article key={article.id} className="group py-6">
                    <div className="flex gap-5 items-start">
                      <div className="flex-1 min-w-0">
                        {/* Category & Date */}
                        <div className="flex items-center gap-2 mb-2 text-xs text-secondary">
                          <span className="bg-secondary/8 px-2.5 py-0.5 rounded-full font-medium text-secondary">
                            {article.category}
                          </span>
                          <span>·</span>
                          <span>{article.date}</span>
                          <span>·</span>
                          <span>{article.readingTime}</span>
                        </div>

                        {/* Title + description */}
                        <Link href={`/article/${article.id}`} className="block">
                          <h3 className="serif text-lg md:text-xl font-bold mb-1.5 leading-snug group-hover:underline underline-offset-4 decoration-1 text-foreground">
                            {article.title}
                          </h3>
                          <p className="text-secondary text-sm leading-relaxed mb-4 line-clamp-2 font-light">
                            {article.description}
                          </p>
                        </Link>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-secondary">
                          <span className="flex items-center gap-1">
                            <Heart size={12} /> {formatNum(article.claps)} claps
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {formatNum(article.views ?? 0)} views
                          </span>
                          <Link
                            href={`/article/${article.id}`}
                            className="ml-auto text-accent font-semibold flex items-center gap-1 text-xs group-hover:gap-2 transition-all"
                          >
                            Read story <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>

                      {article.coverImage && (
                        <Link
                          href={`/article/${article.id}`}
                          className="block w-24 h-24 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-secondary/5 border border-border/40 flex-shrink-0"
                        >
                          <ViewTransition name={`story-cover-${article.id}`}>
                            <span className="block w-full h-full">
                              <SmartImage
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                              />
                            </span>
                          </ViewTransition>
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
        </ViewTransition>
      </main>

      <Footer />
    </div>
  );
}
