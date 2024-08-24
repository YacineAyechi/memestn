"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase"; // Import Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
import { useRouter } from "next/navigation";

export default function ProfileEditForm({ userProfile }) {
  const [username, setUsername] = useState(userProfile?.username || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const [profilePicture, setProfilePicture] = useState(null); // Handle file upload
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email) {
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
      let profilePictureUrl = userProfile.profilePictureUrl || "";

      if (profilePicture) {
        const storageRef = ref(storage, `profile_pictures/${userProfile.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      const userRef = doc(db, "users", userProfile.uid);
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
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
        />
      </div>

      <div className="mt-4">
        <label className="text-white">Profile Picture</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 w-full border-2 border-[#4A5568] p-3 rounded-md bg-[#2D3748] text-white focus:outline-none focus:border-[#FEC601]"
        />
      </div>

      <button
        type="submit"
        className={`w-full p-3 mt-4 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 ease-in-out ${
          loading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 1116 0A8 8 0 014 12zm2 0a6 6 0 1012 0A6 6 0 006 12z"
              />
            </svg>
            Updating...
          </span>
        ) : (
          "Update Profile"
        )}
      </button>
    </form>
  );
}
