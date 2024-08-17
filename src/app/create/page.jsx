"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function CreateMeme() {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      router.push("/login");
      return;
    }

    if (!imageFile) {
      alert("Please upload an image!");
      return;
    }

    setUploading(true);

    try {
      // Upload the image to Firebase Storage
      const storageRef = ref(
        storage,
        `memes/${auth.currentUser.uid}/${imageFile.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Upload failed:", error);
          setUploading(false);
        },
        async () => {
          // Get the download URL after upload is complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save meme data to Firestore
          await addDoc(collection(db, "memes"), {
            uid: auth.currentUser.uid,
            caption: caption,
            imageUrl: downloadURL,
            createdAt: serverTimestamp(),
          });

          setUploading(false);
          setCaption("");
          setImageFile(null);
          router.push(`/${auth.currentUser.uid}`); // Redirect to the user's profile page after submission
        }
      );
    } catch (error) {
      console.error("Error creating meme:", error);
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg w-full p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Post a Meme</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              placeholder="Enter your caption"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="imageFile"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Upload Meme Image
            </label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 ease-in-out ${
              uploading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={uploading}
          >
            {uploading ? (
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
                Uploading...
              </span>
            ) : (
              "Create Meme"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
