"use client";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const checkUsernameExists = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // Password strength check (basic example)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Check if the username already exists
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setError("Username is already taken.");
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Generate a profile picture URL using RoboHash
      const profilePictureUrl = `https://robohash.org/${username}.png?set=set5`;

      // Save user data in Firestore including UID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Save the UID
        username,
        email: user.email,
        profilePictureUrl,
        role: "member",
      });

      console.log("User registered and data saved:", user.uid);

      // Redirect to home or another page
      router.push("/");
    } catch (error) {
      console.error("Error during sign-up:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[76.9vh] px-4">
      <form
        onSubmit={handleSignUp}
        className="p-6 md:p-8 bg-[#1A202C] rounded-lg shadow-lg w-full max-w-md"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <label className="text-white">Username</label>
          <br />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
          />
        </div>
        <br />
        <div>
          <label className="text-white">Email</label>
          <br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
          />
        </div>
        <br />
        <div>
          <label className="text-white">Password</label>
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
          />
        </div>

        <button
          type="submit"
          className="mt-6 bg-[#FEC601] text-white p-3 rounded-md w-full hover:bg-[#fec701e5] transition-colors duration-150"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
