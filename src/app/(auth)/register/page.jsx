"use client";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Handle successful sign-up (e.g., redirect to a dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[76.9vh]">
      <form onSubmit={handleSignUp} className="p-8 rounded-lg shadow-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <label className="text-white">Username</label>
          <br />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-2 py-3 rounded-md w-[450px] focus:outline-none focus:border-[#4A90E2]"
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
        <button className="mt-6 mb-4 w-full rounded-md px-2 py-3 flex items-center justify-center border-2 gap-2 bg-[#1A202C] text-white hover:bg-[#4A90E2] hover:border-[#4A90E2] transition-colors duration-150">
          <Image
            className="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
            width={24}
            height={24}
          />
          <span>Sign Up with Google</span>
        </button>
        <button
          type="submit"
          className="bg-[#4A90E2] text-white p-3 rounded-md w-full hover:bg-[#3B82F6] transition-colors duration-150"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
