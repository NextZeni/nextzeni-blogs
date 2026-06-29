"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/data/dummy";

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
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: SignupData) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleUserActive: (userId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "zeni_users";
const SESSION_KEY = "zeni_session";
const PASSWORDS_KEY = "zeni_passwords";

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      let loadedUsers: User[] = stored ? JSON.parse(stored) : [];

      for (const seed of SEED_USERS) {
        if (!loadedUsers.find((u) => u.id === seed.id)) {
          loadedUsers = [...loadedUsers, seed];
        }
      }
      setUsers(loadedUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(loadedUsers));

      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId === "admin-1") {
        setUser(ADMIN_USER);
      } else if (sessionId) {
        const sessionUser = loadedUsers.find((u) => u.id === sessionId);
        if (sessionUser?.isActive) setUser(sessionUser);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  function saveUsers(updated: User[]) {
    setUsers(updated);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  }

  function login(email: string, password: string): { success: boolean; error?: string } {
    if (email === "admin@nextzeni.com" && password === "admin123") {
      setUser(ADMIN_USER);
      localStorage.setItem(SESSION_KEY, "admin-1");
      return { success: true };
    }
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) ?? "{}") as Record<string, string>;
    const found = users.find((u) => u.email === email);
    if (!found) return { success: false, error: "No account found with this email." };
    if (!found.isActive) return { success: false, error: "Your account has been deactivated by admin." };
    if (passwords[found.id] !== password) return { success: false, error: "Incorrect password." };
    setUser(found);
    localStorage.setItem(SESSION_KEY, found.id);
    return { success: true };
  }

  function signup(data: SignupData): { success: boolean; error?: string } {
    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
      country: data.country,
      role: data.role,
      bio: data.bio,
      about: data.about,
      followers: 0,
      following: 0,
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isActive: true,
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) ?? "{}") as Record<string, string>;
    passwords[newUser.id] = data.password;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return { success: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    if (user.id === "admin-1") return;
    const updatedUsers = users.map((u) => (u.id === user.id ? updated : u));
    saveUsers(updatedUsers);
  }

  function toggleUserActive(userId: string) {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u));
    saveUsers(updatedUsers);
  }

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout, updateUser, toggleUserActive }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
