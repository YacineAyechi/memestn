"use client";

import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function MemeEditModal({ memeId, currentCaption, onClose }) {
  const [caption, setCaption] = useState(currentCaption);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!caption.trim()) {
      toast.error("Caption cannot be empty.");
      setIsSubmitting(false);
      return;
    }

    try {
      const memeRef = doc(db, "memes", memeId);
      await updateDoc(memeRef, {
        caption,
      });

      toast.success("Meme updated successfully!");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error updating meme:", error.message);
      toast.error("An error occurred while updating the meme.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="max-w-lg w-full p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Edit your Meme</h1>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-6">
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Caption
            </label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter your caption"
              className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
            />
          </div>

          <div className="flex mt-6">
            <button
              type="submit"
              className={`w-full p-3 mr-1 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 ease-in-out ${
                isSubmitting ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
                "Update"
              )}
            </button>
            <button
              type="submit"
              onClick={onClose}
              className="w-full ml-1 p-3 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
