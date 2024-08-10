"use client";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful sign-in (e.g., redirect to a dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Handle successful sign-in (e.g., redirect to a dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center h-[76.9vh]">
        <form onSubmit={handleSignIn}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="mt-5">
            <label>Email</label>
            <br />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 border-2 border-[#dadada] px-2 py-3 rounded-md w-[300px]"
            />
          </div>
          <br />
          <div>
            <label>Password</label>
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 border-2 border-[#dadada] px-2 py-3 rounded-md w-[300px]"
            />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="mt-4 mb-4 w-full rounded-md px-2 py-3 border-2 flex items-center justify-center mx-auto gap-2 border-slate-200  text-slate-700  hover:border-slate-400  hover:text-slate-900 hover:shadow transition duration-150"
          >
            <Image
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
              width={24}
              height={24}
            />
            <span>Sign In with Google</span>
          </button>

          <button
            type="submit"
            className="border-2 border-[#dadada] bg-[#dadada] p-3 rounded-md w-full"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
