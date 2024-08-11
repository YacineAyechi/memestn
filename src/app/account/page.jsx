"use client";

import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // No user is signed in, redirect to login page
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Redirect to login page after sign out
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
