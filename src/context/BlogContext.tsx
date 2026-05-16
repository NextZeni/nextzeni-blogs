"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Article } from "@/data/dummy";
import { seedArticles, SEED_VERSION, SEED_VERSION_KEY } from "@/data/seeds";

interface BlogContextValue {
  blogs: Article[];
  addBlog: (blog: Article) => void;
  deleteBlog: (id: string) => void;
  getBlog: (id: string) => Article | undefined;
}

const BlogContext = createContext<BlogContextValue | null>(null);

const STORAGE_KEY = "zeni_blogs";

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const seeded = localStorage.getItem(SEED_VERSION_KEY);
      const stored = localStorage.getItem(STORAGE_KEY);

      if (seeded !== SEED_VERSION) {
        // First visit or new seed version: inject seeds, preserve any user articles
        const userArticles: Article[] = stored
          ? (JSON.parse(stored) as Article[]).filter((a) => !a.id.startsWith("seed-"))
          : [];
        const merged = [...userArticles, ...seedArticles];
        setBlogs(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      } else if (stored) {
        setBlogs(JSON.parse(stored));
      } else {
        setBlogs(seedArticles);
      }
    } catch {
      setBlogs(seedArticles);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    }
  }, [blogs, ready]);

  function addBlog(blog: Article) {
    setBlogs((prev) => [blog, ...prev]);
  }

  function deleteBlog(id: string) {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  }

  function getBlog(id: string) {
    return blogs.find((b) => b.id === id);
  }

  return (
    <BlogContext.Provider value={{ blogs, addBlog, deleteBlog, getBlog }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlogs() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlogs must be used inside BlogProvider");
  return ctx;
}
