"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/data/dummy";
import { db } from "@/lib/firebase";
import {
  collection, doc, getDoc, setDoc, onSnapshot, updateDoc
} from "firebase/firestore";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile?: string;
  country?: string;
  role: "reader" | "writer";
  bio?: string;
  about?: string;
}

interface AuthContextValue {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleUserActive: (userId: string) => void;
  toggleSaveArticle: (articleId: string) => void;
  toggleLikeArticle: (articleId: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "zeni_session";
const USERS_COL = "users";

const ADMIN_USER: User = {
  id: "admin-1",
  firstName: "Admin",
  lastName: "NextZeni",
  email: "admin@nextzeni.com",
  role: "admin",
  followers: 0,
  following: 0,
  joinDate: "Jan 1, 2026",
  isActive: true,
  bio: "Platform administrator",
  about: "Managing the NextZeni platform.",
};

const SEED_USERS: User[] = [
  {
    id: "writer-1",
    firstName: "Shreyas",
    lastName: "Naphad",
    email: "shreyas@example.com",
    country: "India",
    role: "writer",
    followers: 12400,
    following: 89,
    joinDate: "Jan 15, 2026",
    isActive: true,
    bio: "Tech writer & AI enthusiast. Writing about the future of technology.",
    about: "I write about AI, technology, and the intersection of both with everyday life. Based in Pune.",
  },
  {
    id: "writer-2",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@example.com",
    country: "India",
    role: "writer",
    followers: 8200,
    following: 54,
    joinDate: "Feb 3, 2026",
    isActive: true,
    bio: "Finance expert & startup advisor",
    about: "Breaking down complex financial concepts for everyone. Former investment banker turned writer.",
  },
  {
    id: "writer-3",
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun@example.com",
    country: "India",
    role: "writer",
    followers: 5600,
    following: 120,
    joinDate: "Feb 20, 2026",
    isActive: true,
    bio: "Product designer & UX researcher",
    about: "Helping teams build better products through design thinking. 10+ years in product design.",
  },
  {
    id: "writer-4",
    firstName: "Kavya",
    lastName: "Reddy",
    email: "kavya@example.com",
    country: "India",
    role: "writer",
    followers: 3800,
    following: 67,
    joinDate: "Mar 5, 2026",
    isActive: true,
    bio: "Health & wellness writer",
    about: "Sharing evidence-based health tips and wellness strategies. Certified nutritionist.",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Initialize sessionId from localStorage on mount
  useEffect(() => {
    setSessionId(localStorage.getItem(SESSION_KEY));
  }, []);

  // Seed default users in Firestore if needed
  useEffect(() => {
    async function seedUsersIfNeeded() {
      try {
        const metaRef = doc(db, "meta/users_seed_v2");
        const metaSnap = await getDoc(metaRef);
        if (!metaSnap.exists()) {
          // seed admin
          const adminDocId = "admin-1";
          await setDoc(doc(db, USERS_COL, adminDocId), {
            ...ADMIN_USER,
            password: "admin123",
          });

          // seed writers
          const seedWrites = SEED_USERS.map((u) => {
            return setDoc(doc(db, USERS_COL, u.id), {
              ...u,
              password: "password123",
            });
          });
          await Promise.all(seedWrites);
          await setDoc(metaRef, { seeded: true });
        }
      } catch (err) {
        console.error("Users seeding error:", err);
      }
    }
    seedUsersIfNeeded();
  }, []);

  // Real-time listener for current session user
  useEffect(() => {
    if (!sessionId) {
      setUser(null);
      setReady(true);
      return;
    }

    const unsub = onSnapshot(
      doc(db, USERS_COL, sessionId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser({ id: docSnap.id, ...data } as User);
        } else {
          setUser(null);
          localStorage.removeItem(SESSION_KEY);
          setSessionId(null);
        }
        setReady(true);
      },
      (err) => {
        console.error("Session user fetch error:", err);
        setReady(true);
      }
    );
    return unsub;
  }, [sessionId]);

  // Real-time listener for all users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, USERS_COL), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as User)));
    });
    return unsub;
  }, []);

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Find user by email in current users state
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        return { success: false, error: "No account found with this email." };
      }
      
      // Retrieve the doc from db to verify password
      const userSnap = await getDoc(doc(db, USERS_COL, found.id));
      if (!userSnap.exists()) {
        return { success: false, error: "Account not found." };
      }
      
      const userData = userSnap.data();
      if (!userData.isActive) {
        return { success: false, error: "Your account has been deactivated by admin." };
      }
      
      if (userData.password !== password) {
        return { success: false, error: "Incorrect password." };
      }

      localStorage.setItem(SESSION_KEY, found.id);
      setSessionId(found.id);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "An error occurred during sign in." };
    }
  }

  async function signup(data: SignupData): Promise<{ success: boolean; error?: string }> {
    try {
      const emailExists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
      if (emailExists) {
        return { success: false, error: "An account with this email already exists." };
      }

      const newId = `user-${Date.now()}`;
      const newUserDoc = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile || "",
        country: data.country || "",
        role: data.role,
        bio: data.bio || "",
        about: data.about || "",
        followers: 0,
        following: 0,
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        isActive: true,
        password: data.password,
        savedArticles: [],
        likedArticles: [],
      };

      await setDoc(doc(db, USERS_COL, newId), newUserDoc);
      localStorage.setItem(SESSION_KEY, newId);
      setSessionId(newId);
      return { success: true };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, error: "An error occurred during account creation." };
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setUser(null);
  }

  async function updateUser(updates: Partial<User>) {
    if (!sessionId) return;
    try {
      await updateDoc(doc(db, USERS_COL, sessionId), updates);
    } catch (err) {
      console.error("Update user error:", err);
    }
  }

  async function toggleUserActive(userId: string) {
    try {
      const userRef = doc(db, USERS_COL, userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, { isActive: !userSnap.data().isActive });
      }
    } catch (err) {
      console.error("Toggle active user error:", err);
    }
  }

  function toggleSaveArticle(articleId: string) {
    if (!user || !sessionId) return;
    const saved = user.savedArticles || [];
    const updatedSaved = saved.includes(articleId)
      ? saved.filter((id) => id !== articleId)
      : [...saved, articleId];
    updateUser({ savedArticles: updatedSaved });
  }

  function toggleLikeArticle(articleId: string): boolean {
    if (!user || !sessionId) return false;
    const liked = user.likedArticles || [];
    const isLiked = liked.includes(articleId);
    const updatedLiked = isLiked
      ? liked.filter((id) => id !== articleId)
      : [...liked, articleId];
    updateUser({ likedArticles: updatedLiked });
    return !isLiked;
  }

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout, updateUser, toggleUserActive, toggleSaveArticle, toggleLikeArticle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
