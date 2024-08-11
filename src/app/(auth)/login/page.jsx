"use client";

import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[76.9vh] ">
      <form onSubmit={handleSignIn} className="p-8 rounded-lg shadow-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mt-5">
          <label className="text-white">Email</label>
          <br />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-2 py-3 rounded-md w-[450px] focus:outline-none focus:border-[#4A90E2]"
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
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-2 py-3 rounded-md w-[450px] focus:outline-none focus:border-[#4A90E2]"
          />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="mt-6 mb-4 w-full rounded-md px-2 py-3 flex items-center justify-center border-2 gap-2 bg-[#1A202C] text-white hover:bg-[#4A90E2] hover:border-[#4A90E2] transition-colors duration-150"
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
          className="bg-[#4A90E2] text-white p-3 rounded-md w-full hover:bg-[#3B82F6] transition-colors duration-150"
        >
          Sign In
        </button>

        <div className="mt-3 flex items-center justify-center">
          <p className="text-white">Forgot Your Password?</p>
          <Link
            href={"/"}
            className="ml-[3px] text-[#4A90E2] hover:text-[#63B3ED] transition-colors duration-150"
          >
            Reset
          </Link>
        </div>
      </form>
    </div>
  );
}
