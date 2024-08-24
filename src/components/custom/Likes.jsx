import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Loader from "./Loader";
import NoMemesFound from "./NoMemesFound";
import Memes from "./Memes";
import MemeCard from "./MemeCard";

export default function Likes({ userId }) {
  const [likedMemes, setLikedMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.error("userId is undefined, cannot fetch liked memes.");
      setLoading(false);
      return;
    }

    const fetchLikedMemes = async () => {
      try {
        const memesRef = collection(db, "memes");
        const q = query(memesRef, where("likes", "array-contains", userId));
        const querySnapshot = await getDocs(q);
        const likedMemesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikedMemes(likedMemesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked memes:", error.message);
        setLoading(false);
      }
    };

    fetchLikedMemes();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center m-auto h-[40vh]">
        <Loader />
      </div>
    );
  }

  if (likedMemes.length === 0) {
    return <NoMemesFound />;
  }

  return (
    <div className="md:mx-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {likedMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
