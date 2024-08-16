"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfileEditForm({ userProfile }) {
  const [username, setUsername] = useState(userProfile?.username || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    userProfile?.profilePictureUrl || ""
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !profilePictureUrl) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!userProfile?.uid) {
      setError("Failed to update profile: User ID is undefined.");
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", userProfile.uid); // Using UID as document ID
      await updateDoc(userRef, {
        username,
        email,
        profilePictureUrl,
      });
      setLoading(false);
      setError(null);

      // Force refresh the page
      window.location.reload();
    } catch (error) {
      setError("Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-800 rounded-lg">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label className="text-white">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white"
        />
      </div>
      <div className="mt-4">
        <label className="text-white">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white"
        />
      </div>
      <div className="mt-4">
        <label className="text-white">Profile Picture URL</label>
        <input
          type="url"
          value={profilePictureUrl}
          onChange={(e) => setProfilePictureUrl(e.target.value)}
          className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors duration-150"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
