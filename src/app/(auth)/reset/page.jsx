"use client";

import { resetPassword } from "@/lib/resetPassword";
import { useState } from "react";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await resetPassword(email);
    setMessage(response.message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[76.9vh]">
      <h1 className="text-2xl mb-12 font-bold text-white">
        Reset Your Password
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-white">Enter your Email Address</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-4 border-2 border-[#4A5568] bg-[#2D3748] text-white px-2 py-3 rounded-md w-[450px] focus:outline-none focus:border-[#4A90E2]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#4A90E2] text-white p-3 rounded-md w-full hover:bg-[#3B82F6] transition-colors duration-150 mt-6"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
