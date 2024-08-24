"use client";

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

export default function MemeCard({ meme }) {
  const [currentMeme, setCurrentMeme] = useState(meme);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "memes", meme.id), (docSnapshot) => {
      setCurrentMeme({ id: meme.id, ...docSnapshot.data() });
    });

    return () => unsubscribe();
  }, [meme.id]);

  const handleLike = async () => {
    const memeRef = doc(db, "memes", meme.id);
    const userHasLiked = currentMeme.likes?.includes(auth.currentUser?.uid);

    try {
      if (userHasLiked) {
        await updateDoc(memeRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
      } else {
        await updateDoc(memeRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
      }
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  const userHasLiked = currentMeme.likes?.includes(auth.currentUser?.uid);

  return (
    <Link href={`/meme/${currentMeme.id}`} passHref>
      <div className="relative group cursor-pointer">
        <div className="w-full h-64">
          <Image
            src={currentMeme.imageUrl}
            alt={currentMeme.title || "Meme"}
            className="rounded-md object-cover w-full h-full"
            width={256}
            height={256}
            priority
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-md">
          <div className="flex">
            <div
              className="flex items-center p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                handleLike();
              }}
            >
              <Image
                src={
                  userHasLiked ? "/icons/heart-filled.svg" : "/icons/heart.svg"
                }
                alt="Like Icon"
                priority
                width={24}
                height={24}
              />
              <p className="font-bold ml-2 text-white">
                {currentMeme.likes?.length || 0}
              </p>
            </div>
            <div className="flex items-center p-3 rounded-xl ml-5 cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out">
              <Image
                src="/icons/comment.svg"
                alt="Comment Icon"
                priority
                width={24}
                height={24}
              />
              <p className="font-bold ml-2 text-white">
                {currentMeme.comments?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
