import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, sendPasswordResetEmail, updatePassword, type User as AuthUser } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { toast } from "sonner";

export function useAuth() {
  const [session, setSession] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setSession(firebaseUser);
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "user_roles", firebaseUser.uid));
        setIsAdmin(snap.exists() && (snap.data() as { role?: string }).role === "admin");
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => { await signInWithEmailAndPassword(auth, email, password); }, []);
  const signUp = useCallback(async (email: string, password: string) => { await createUserWithEmailAndPassword(auth, email, password); }, []);
  const logout = useCallback(async () => { await fbSignOut(auth); }, []);
  const resetPassword = useCallback(async (email: string) => { await sendPasswordResetEmail(auth, email); }, []);
  const updateUserPassword = useCallback(async (newPassword: string) => {
    if (!auth.currentUser) throw new Error("No user in session");
    await updatePassword(auth.currentUser, newPassword);
  }, []);

  return { user, session, isAdmin, loading, signIn, signUp, logout, resetPassword, updateUserPassword };
}
