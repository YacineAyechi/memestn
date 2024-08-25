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
    <div className="flex flex-col items-center justify-center h-[76.9vh] px-4">
      <h1 className="text-2xl mb-6 font-bold text-white text-center">
        Reset Your Password
      </h1>
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-[#1A202C] rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-4">
          <label className="text-white block">Enter your Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-2 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#FEC601] text-white p-3 rounded-md w-full hover:bg-[#fec701e5] transition-colors duration-150 mt-4"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
