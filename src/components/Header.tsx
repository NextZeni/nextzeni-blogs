"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, PenLine, ChevronDown, LayoutDashboard, Settings,
  LogOut, Shield, Menu, X, Bell, BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/data/dummy";

const NAV_LINKS = [
  { label: "Technology", href: "/?cat=Technology" },
  { label: "Finance", href: "/?cat=Finance" },
  { label: "Science", href: "/?cat=Science" },
  { label: "AI", href: "/?cat=Artificial+Intelligence" },
  { label: "Culture", href: "/?cat=Culture" },
  { label: "Tools", href: "/tools" },
  { label: "Resources", href: "/resources" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
      setSearch("");
    }
  }

  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 text-xl font-extrabold tracking-tighter flex items-baseline"
        >
          <span className="font-light text-secondary">Next</span>
          <span className="text-foreground">Zeni</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-secondary hover:text-foreground rounded-lg hover:bg-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                autoFocus
                className="w-44 sm:w-64 text-sm px-3 py-1.5 border border-border rounded-full outline-none focus:ring-1 focus:ring-accent/50 bg-surface"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-secondary hover:text-foreground"
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-secondary hover:text-foreground transition-colors"
            >
              <Search size={18} />
            </button>
          )}

          {user ? (
            <>
              {/* Write button */}
              <Link
                href="/write"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-foreground transition-colors px-3 py-1.5"
              >
                <PenLine size={15} />
                Write
              </Link>

              {/* Notifications placeholder */}
              <button className="hidden sm:flex p-2 text-secondary hover:text-foreground relative">
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
              </button>

              {/* Profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-1.5"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
                    {getInitials(fullName)}
                  </div>
                  <ChevronDown size={13} className="text-secondary hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-border">
                      <p className="font-semibold text-sm">{fullName}</p>
                      <p className="text-xs text-secondary truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : user.role === "writer"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    {user.role === "writer" && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LayoutDashboard size={15} className="text-secondary" />
                        Dashboard
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Shield size={15} className="text-secondary" />
                        Admin Panel
                      </Link>
                    )}

                    <Link
                      href={`/profile/${user.id}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <BookOpen size={15} className="text-secondary" />
                      My Profile
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={15} className="text-secondary" />
                      Settings
                    </Link>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); router.push("/"); }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:block text-sm font-medium text-secondary hover:text-foreground transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="btn-primary hidden sm:block"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-secondary hover:text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block px-3 py-2 text-sm font-medium text-secondary hover:text-foreground rounded-lg hover:bg-surface"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border pt-3 mt-3">
            {user ? (
              <>
                <Link href="/write" className="block px-3 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                  Write a story
                </Link>
                {user.role === "writer" && (
                  <Link href="/dashboard" className="block px-3 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" className="block px-3 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMenuOpen(false); router.push("/"); }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-500"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-3 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block px-3 py-2 text-sm font-semibold text-accent" onClick={() => setMenuOpen(false)}>
                  Get Started — Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
