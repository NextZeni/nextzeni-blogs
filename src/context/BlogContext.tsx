"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc,
  setDoc, getDoc, increment, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Article, Comment } from "@/data/dummy";
import { seedArticles } from "@/data/seeds";

interface BlogContextValue {
  blogs: Article[];
  comments: Comment[];
  loading: boolean;
  addBlog: (blog: Omit<Article, "id">) => Promise<string>;
  deleteBlog: (id: string) => Promise<void>;
  getBlog: (id: string) => Article | undefined;
  incrementViews: (id: string) => Promise<void>;
  updateBlog: (id: string, updates: Partial<Article>) => Promise<void>;
  approveBlog: (id: string) => Promise<void>;
  rejectBlog: (id: string, reason: string) => Promise<void>;
  addComment: (comment: Omit<Comment, "id">) => Promise<void>;
  deleteComment: (commentId: string, articleId: string) => Promise<void>;
  getComments: (articleId: string) => Comment[];
  likeComment: (commentId: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextValue | null>(null);

const ARTICLES_COL = "articles";
const COMMENTS_COL = "comments";
const META_DOC = "meta/seed";

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Seed articles into Firestore once
  useEffect(() => {
    async function seedIfNeeded() {
      try {
        const metaRef = doc(db, META_DOC);
        const metaSnap = await getDoc(metaRef);
        if (!metaSnap.exists()) {
          const writes = seedArticles.map((a) =>
            setDoc(doc(db, ARTICLES_COL, a.id), a)
          );
          await Promise.all(writes);
          await setDoc(metaRef, { seeded: true, version: "v2" });
        }
      } catch (err) {
        console.error("Seed error:", err);
      }
    }
    seedIfNeeded();
  }, []);

  // Real-time listener for articles
  useEffect(() => {
    const q = query(collection(db, ARTICLES_COL), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const items: Article[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Article));
      setBlogs(items);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  // Real-time listener for comments
  useEffect(() => {
    const unsub = onSnapshot(collection(db, COMMENTS_COL), (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment)));
    });
    return unsub;
  }, []);

  async function addBlog(blog: Omit<Article, "id">): Promise<string> {
    const ref = await addDoc(collection(db, ARTICLES_COL), blog);
    return ref.id;
  }

  async function deleteBlog(id: string) {
    await deleteDoc(doc(db, ARTICLES_COL, id));
  }

  function getBlog(id: string) {
    return blogs.find((b) => b.id === id);
  }

  async function incrementViews(id: string) {
    await updateDoc(doc(db, ARTICLES_COL, id), { views: increment(1) });
  }

  async function updateBlog(id: string, updates: Partial<Article>) {
    await updateDoc(doc(db, ARTICLES_COL, id), updates);
  }

  async function approveBlog(id: string) {
    await updateDoc(doc(db, ARTICLES_COL, id), { status: "published", rejectionReason: "" });
  }

  async function rejectBlog(id: string, reason: string) {
    await updateDoc(doc(db, ARTICLES_COL, id), { status: "rejected", rejectionReason: reason });
  }

  async function addComment(comment: Omit<Comment, "id">) {
    await addDoc(collection(db, COMMENTS_COL), comment);
    await updateDoc(doc(db, ARTICLES_COL, comment.articleId), { responses: increment(1) });
  }

  async function deleteComment(commentId: string, articleId: string) {
    await deleteDoc(doc(db, COMMENTS_COL, commentId));
    await updateDoc(doc(db, ARTICLES_COL, articleId), { responses: increment(-1) });
  }

  function getComments(articleId: string) {
    return comments.filter((c) => c.articleId === articleId);
  }

  async function likeComment(commentId: string) {
    await updateDoc(doc(db, COMMENTS_COL, commentId), { likes: increment(1) });
  }

  return (
    <BlogContext.Provider
      value={{
        blogs,
        comments,
        loading,
        addBlog,
        deleteBlog,
        getBlog,
        incrementViews,
        updateBlog,
        approveBlog,
        rejectBlog,
        addComment,
        deleteComment,
        getComments,
        likeComment,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlogs() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlogs must be used inside BlogProvider");
  return ctx;
}
