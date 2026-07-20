"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/data/dummy";
import { db, auth } from "@/lib/firebase";
import {
  collection, doc, getDoc, setDoc, onSnapshot, updateDoc,
  deleteDoc, query, where, getDocs, writeBatch, increment
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  onAuthStateChanged
} from "firebase/auth";

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
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleUserActive: (userId: string) => void;
  toggleSaveArticle: (articleId: string) => void;
  toggleLikeArticle: (articleId: string) => boolean;
  toggleFollowUser: (targetUserId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_COL = "users";

const ADMIN_USER: User = {
  id: "admin-1",
  firstName: "Admin",
  lastName: "NextZeni",
  email: "admin@nextzeni.com",
  role: "admin",
  followers: 0,
  following: 0,
  followingUsers: [],
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
    followers: 0,
    following: 0,
    followingUsers: [],
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
    followers: 0,
    following: 0,
    followingUsers: [],
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
    followers: 0,
    following: 0,
    followingUsers: [],
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
    followers: 0,
    following: 0,
    followingUsers: [],
    joinDate: "Mar 5, 2026",
    isActive: true,
    bio: "Health & wellness writer",
    about: "Sharing evidence-based health tips and wellness strategies. Certified nutritionist.",
  },
  {
    id: "writer-nextzeni",
    firstName: "NextZeni",
    lastName: "Team",
    email: "yournextzeni@gmail.com",
    country: "India",
    role: "writer",
    followers: 0,
    following: 0,
    followingUsers: [],
    joinDate: "Jul 21, 2026",
    isActive: true,
    bio: "Sports analyst & editor at NextZeni",
    about: "Covering the global dynamics of football, business model economics, and sports cultures.",
  },
];

const DEMO_EMAILS = [
  "admin@nextzeni.com",
  "shreyas@example.com",
  "priya@example.com",
  "arjun@example.com",
  "kavya@example.com"
];

function isDemoUser(email?: string | null): boolean {
  if (!email) return false;
  return DEMO_EMAILS.includes(email.toLowerCase());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [ready, setReady] = useState(false);

  // Seed default users in Firestore if needed
  useEffect(() => {
    async function seedUsersIfNeeded() {
      try {
        const metaRef = doc(db, "meta/users_seed_v4");
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

  // Real-time listener for current Firebase Auth user
  useEffect(() => {
    let docUnsub: (() => void) | null = null;

    const authUnsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (docUnsub) {
        docUnsub();
        docUnsub = null;
      }

      if (firebaseUser) {
        // Block unverified email users (except demo users)
        if (!firebaseUser.emailVerified && !isDemoUser(firebaseUser.email)) {
          await signOut(auth);
          setUser(null);
          setReady(true);
          return;
        }

        // Setup real-time listener for current user's document
        const userDocId = firebaseUser.email === "yournextzeni@gmail.com" ? "writer-nextzeni" : firebaseUser.uid;
        docUnsub = onSnapshot(
          doc(db, USERS_COL, userDocId),
          (docSnap) => {
            if (docSnap.exists()) {
              setUser({ id: docSnap.id, ...docSnap.data() } as User);
            } else {
              setUser(null);
            }
            setReady(true);
          },
          (err) => {
            console.error("User doc fetch error:", err);
            setReady(true);
          }
        );
      } else {
        setUser(null);
        setReady(true);
      }
    });

    return () => {
      authUnsub();
      if (docUnsub) docUnsub();
    };
  }, []);

  // Real-time listener for all users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, USERS_COL), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as User)));
    });
    return unsub;
  }, []);

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (authErr: any) {
        // Fallback migration for demo users not in Firebase Auth
        if (
          authErr.code === "auth/user-not-found" ||
          authErr.code === "auth/invalid-credential" ||
          authErr.code === "auth/invalid-email"
        ) {
          const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          if (found) {
            const userSnap = await getDoc(doc(db, USERS_COL, found.id));
            if (userSnap.exists()) {
              const userData = userSnap.data();
              if (userData.password === password) {
                // Register the user in Firebase Auth
                try {
                  const newCred = await createUserWithEmailAndPassword(auth, email, password);
                  const uid = newCred.user.uid;

                  // Create user document under the new UID
                  await setDoc(doc(db, USERS_COL, uid), {
                    ...userData,
                    id: uid,
                  });

                  // Update articles reference
                  const articlesQuery = query(
                    collection(db, "articles"),
                    where("authorId", "==", found.id)
                  );
                  const articlesSnap = await getDocs(articlesQuery);
                  const batch = writeBatch(db);
                  articlesSnap.forEach((docSnap) => {
                    batch.update(docSnap.ref, { authorId: uid });
                  });
                  await batch.commit();

                  // Update comments reference
                  const commentsQuery = query(
                    collection(db, "comments"),
                    where("authorId", "==", found.id)
                  );
                  const commentsSnap = await getDocs(commentsQuery);
                  const commentsBatch = writeBatch(db);
                  commentsSnap.forEach((docSnap) => {
                    commentsBatch.update(docSnap.ref, { authorId: uid });
                  });
                  await commentsBatch.commit();

                  // Delete the old custom ID document
                  await deleteDoc(doc(db, USERS_COL, found.id));

                  // Sign in again with new credentials to ensure state is synchronized
                  userCredential = await signInWithEmailAndPassword(auth, email, password);
                } catch (migrateErr) {
                  console.error("Failed to migrate demo account to Firebase Auth:", migrateErr);
                  throw authErr;
                }
              } else {
                return { success: false, error: "Incorrect password." };
              }
            } else {
              return { success: false, error: "Account not found." };
            }
          } else {
            throw authErr;
          }
        } else {
          throw authErr;
        }
      }

      const firebaseUser = userCredential.user;

      // Verify email if not a demo account
      if (!firebaseUser.emailVerified && !isDemoUser(firebaseUser.email)) {
        await sendEmailVerification(firebaseUser);
        await signOut(auth);
        return {
          success: false,
          error: "Please verify your email address. A new verification link has been sent to your inbox."
        };
      }

      // Check Firestore user doc
      const userSnap = await getDoc(doc(db, USERS_COL, firebaseUser.uid));
      if (!userSnap.exists()) {
        const names = firebaseUser.displayName ? firebaseUser.displayName.split(" ") : ["User", ""];
        await setDoc(doc(db, USERS_COL, firebaseUser.uid), {
          firstName: names[0],
          lastName: names.slice(1).join(" ") || "",
          email: firebaseUser.email || "",
          role: "reader",
          followers: 0,
          following: 0,
          followingUsers: [],
          joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          isActive: true,
          savedArticles: [],
          likedArticles: [],
        });
      } else {
        const userData = userSnap.data();
        if (!userData.isActive) {
          await signOut(auth);
          return { success: false, error: "Your account has been deactivated by admin." };
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error("Login error:", err);
      let msg = "An error occurred during sign in.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        msg = "Incorrect email or password.";
      } else if (err.code === "auth/invalid-email") {
        msg = "The email address is invalid.";
      } else if (err.code === "auth/user-disabled") {
        msg = "This account has been disabled.";
      }
      return { success: false, error: msg };
    }
  }

  async function loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Check if Firestore document exists
      const userDocId = firebaseUser.email === "yournextzeni@gmail.com" ? "writer-nextzeni" : firebaseUser.uid;
      const userDocRef = doc(db, USERS_COL, userDocId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const names = firebaseUser.displayName ? firebaseUser.displayName.split(" ") : ["Google", "User"];
        const firstName = names[0];
        const lastName = names.slice(1).join(" ") || "";
        const isNextZeni = firebaseUser.email === "yournextzeni@gmail.com";
        const newUserDoc = {
          firstName: isNextZeni ? "NextZeni" : firstName,
          lastName: isNextZeni ? "Team" : lastName,
          email: firebaseUser.email || "",
          mobile: "",
          country: "India",
          role: isNextZeni ? "writer" : "reader",
          bio: isNextZeni ? "Sports analyst & editor at NextZeni" : "Reader logged in via Google",
          about: isNextZeni ? "Covering the global dynamics of football, business model economics, and sports cultures." : "",
          followers: 0,
          following: 0,
          followingUsers: [],
          joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          isActive: true,
          savedArticles: [],
          likedArticles: [],
        };
        await setDoc(userDocRef, newUserDoc);
      } else {
        const userData = userDocSnap.data();
        if (!userData.isActive) {
          await signOut(auth);
          return { success: false, error: "Your account has been deactivated by admin." };
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error("Google login error:", err);
      return { success: false, error: err.message || "Failed to sign in with Google." };
    }
  }

  async function signup(data: SignupData): Promise<{ success: boolean; error?: string }> {
    try {
      const emailExists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
      if (emailExists) {
        return { success: false, error: "An account with this email already exists." };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      await sendEmailVerification(firebaseUser);

      const newUserDoc = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile || "",
        country: data.country || "",
        role: data.role,
        bio: data.bio || (data.role === "writer" ? "Aspiring tech writer" : "Avid reader"),
        about: data.about || "",
        followers: 0,
        following: 0,
        followingUsers: [],
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        isActive: true,
        password: data.password,
        savedArticles: [],
        likedArticles: [],
      };

      const userDocId = data.email.toLowerCase() === "yournextzeni@gmail.com" ? "writer-nextzeni" : firebaseUser.uid;
      await setDoc(doc(db, USERS_COL, userDocId), newUserDoc);

      await signOut(auth);

      return { success: true };
    } catch (err: any) {
      console.error("Signup error:", err);
      let msg = "An error occurred during account creation.";
      if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        msg = "The password is too weak. Please use a stronger password.";
      } else if (err.code === "auth/invalid-email") {
        msg = "The email address is invalid.";
      }
      return { success: false, error: msg };
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  async function updateUser(updates: Partial<User>) {
    if (!user) return;
    try {
      await updateDoc(doc(db, USERS_COL, user.id), updates);
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
    if (!user) return;
    const saved = user.savedArticles || [];
    const updatedSaved = saved.includes(articleId)
      ? saved.filter((id) => id !== articleId)
      : [...saved, articleId];
    updateUser({ savedArticles: updatedSaved });
  }

  function toggleLikeArticle(articleId: string): boolean {
    if (!user) return false;
    const liked = user.likedArticles || [];
    const isLiked = liked.includes(articleId);
    const updatedLiked = isLiked
      ? liked.filter((id) => id !== articleId)
      : [...liked, articleId];
    updateUser({ likedArticles: updatedLiked });
    return !isLiked;
  }

  async function toggleFollowUser(targetUserId: string) {
    if (!user) return;
    try {
      const followingList = user.followingUsers || [];
      const isCurrentlyFollowing = followingList.includes(targetUserId);
      const newFollowingList = isCurrentlyFollowing
        ? followingList.filter((id) => id !== targetUserId)
        : [...followingList, targetUserId];

      // Update current user doc
      await updateDoc(doc(db, USERS_COL, user.id), {
        followingUsers: newFollowingList,
        following: increment(isCurrentlyFollowing ? -1 : 1),
      });

      // Update target user doc
      await updateDoc(doc(db, USERS_COL, targetUserId), {
        followers: increment(isCurrentlyFollowing ? -1 : 1),
      });
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  }

  if (!ready) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateUser,
        toggleUserActive,
        toggleSaveArticle,
        toggleLikeArticle,
        toggleFollowUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
