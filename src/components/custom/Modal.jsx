"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";

export default function Modal({ onClose }) {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("Meme");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState(""); // Error state

  const handleSelectChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      router.push("/login");
      return;
    }

    if (caption === "") {
      toast.error("Please add a caption!");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload an image!");
      return;
    }

    if (tags.length < 2) {
      toast.error("You must add at least 2 tags.");
      return;
    }

    setError("");
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
            captionLower: caption.toLowerCase(), // Store lowercase version for search
            type: selectedType,
            imageUrl: downloadURL,
            tags: tags,
            createdAt: serverTimestamp(),
          });

          setUploading(false);
          setCaption("");
          setImageFile(null);
          setTags([]);

          router.push(`/profile/${auth.currentUser.uid}`); // Redirect to the user's profile page after submission
        }
      );
    } catch (error) {
      console.error("Error creating meme:", error);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <Toaster />
      <div className="max-w-lg w-full p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Post a Meme</h1>
        <form onSubmit={handleSubmit}>
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

          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Type
            </label>

            <select
              required
              className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full"
              value={selectedType}
              onChange={handleSelectChange}
            >
              <option value="Meme">Meme</option>
              <option value="Original">Original</option>
            </select>

            {selectedType === "Original" && (
              <p className="text-sm text-gray-400 mt-2 ">
                Original content needs admin approval.
              </p>
            )}
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
              className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag and press Enter"
              className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
            />
            <div className="mt-3 flex flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-white rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagDelete(tag)}
                    className="ml-2 text-gray-300 hover:text-white"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex mt-4">
            <button
              type="submit"
              className={`w-full p-3 mr-1 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 ease-in-out ${
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
            <button
              onClick={onClose}
              type="submit"
              className="w-full ml-1 p-3 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
