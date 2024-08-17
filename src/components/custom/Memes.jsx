"use client";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import NoMemesFound from "./NoMemesFound";

export default function Memes({ userId }) {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const memesRef = collection(db, "memes");
        const q = query(memesRef, where("uid", "==", userId));
        const querySnapshot = await getDocs(q);
        const memesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMemes(memesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memes:", error.message);
        setLoading(false);
      }
    };

    fetchMemes();
  }, [userId]);

  const handleLike = async (memeId) => {
    const memeRef = doc(db, "memes", memeId);
    const memeDoc = memes.find((meme) => meme.id === memeId);
    const userHasLiked = memeDoc.likes?.includes(auth.currentUser.uid);

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

  useEffect(() => {
    const unsubscribe = memes.map((meme) =>
      onSnapshot(doc(db, "memes", meme.id), (docSnapshot) => {
        setMemes((prevMemes) =>
          prevMemes.map((m) =>
            m.id === meme.id ? { ...m, ...docSnapshot.data() } : m
          )
        );
      })
    );

    return () => unsubscribe.forEach((unsub) => unsub());
  }, [memes]);

  if (loading) {
    return <p>Loading memes...</p>;
  }

  if (memes.length === 0) {
    return <NoMemesFound />;
  }

  return (
    <div className="md:mx-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.map((meme) => {
          const userHasLiked = meme.likes?.includes(auth.currentUser.uid);

          return (
            <Link key={meme.id} href={`/meme/${meme.id}`} passHref>
              <div className="relative group cursor-pointer">
                <div className="w-full h-64">
                  <Image
                    src={meme.imageUrl}
                    alt={meme.title || "Meme"}
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
                        handleLike(meme.id);
                      }}
                    >
                      <Image
                        src={
                          userHasLiked
                            ? "/icons/heart-filled.svg"
                            : "/icons/heart.svg"
                        }
                        alt="Like Icon"
                        priority
                        width={24}
                        height={24}
                      />
                      <p className="font-bold ml-2 text-white">
                        {meme.likes?.length || 0}
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
                        {meme.comments?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
