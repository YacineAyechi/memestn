"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import MemeCard from "./MemeCard";
import NoMemesFound from "./NoMemesFound";
import NoReMemesFound from "./NoReMemesFound";

export default function Reposts({ userId }) {
  const [reposts, setReposts] = useState([]);

  useEffect(() => {
    const fetchReposts = async () => {
      if (!userId) return; // Ensure userId is available

      const repostsQuery = query(
        collection(db, "reposts"),
        where("userId", "==", userId)
      );

      const unsubscribe = onSnapshot(repostsQuery, async (snapshot) => {
        const repostsWithMemes = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const repostsData = docSnap.data();
            if (repostsData.memeId) {
              const memeRef = doc(db, "memes", repostsData.memeId);
              const memeSnap = await getDoc(memeRef);
              return memeSnap.exists()
                ? { id: memeSnap.id, ...memeSnap.data() }
                : null;
            }
            return null;
          })
        );
        setReposts(repostsWithMemes.filter((meme) => meme));
      });

      return () => unsubscribe();
    };

    fetchReposts();
  }, [userId]);

  return (
    // <div className="flex flex-col items-center justify-center mt-16">
    //   <div className="w-full max-w-3xl">
    //     {reposts.length > 0 ? (
    //       reposts.map((meme) => <MemeCard key={meme.id} meme={meme} />)
    //     ) : (
    //       <p className="text-white">No reposts found.</p>
    //     )}
    //   </div>
    // </div>
    <div>
      {reposts.length > 0 ? (
        <div className="md:mx-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reposts.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <NoReMemesFound />
        </div>
      )}
    </div>
  );
}
