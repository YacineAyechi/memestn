"use client";

import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import MemeCard from "./MemeCard";
import NoMemesFound from "./NoMemesFound";
import Loader from "./Loader";

export default function Memes({ userId }) {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const memesRef = collection(db, "memes");
        const q = query(
          memesRef,
          where("uid", "==", userId),
          where("type", "==", "Meme")
        );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center m-auto h-[79.5vh]">
        <Loader />
      </div>
    );
  }

  if (memes.length === 0) {
    return <NoMemesFound />;
  }

  return (
    <div className="mt-8 md:mx-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-3">
        {memes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
