"use client";

import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  where,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Loader from "@/components/custom/Loader";
import NoMemesFound from "@/components/custom/NoMemesFound";
import NoMemesFoundLogIn from "@/components/custom/NoMemesFoundLogIn";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AdComponent from "@/components/custom/AdComponent";

export default function Home() {
  const router = useRouter();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [userLikes, setUserLikes] = useState(new Set()); // Track user likes
  const [userReposts, setUserReposts] = useState(new Set()); // Track user reposts
  const [user, setUser] = useState(null); // Track the current user
  const loaderRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribeAuth(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchInitialMemes = async () => {
      const memesQuery = query(
        collection(db, "memes"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const unsubscribe = onSnapshot(memesQuery, async (snapshot) => {
        const memesWithUserInfo = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const memeData = docSnap.data();
            const userRef = doc(db, "users", memeData.uid);
            const userSnap = await getDoc(userRef);

            return {
              id: docSnap.id,
              ...memeData,
              user: userSnap.exists() ? userSnap.data() : {},
            };
          })
        );

        setMemes(memesWithUserInfo);

        // Update userLikes and userReposts based on current user's actions
        if (auth.currentUser) {
          const userLikes = new Set(
            memesWithUserInfo.flatMap((meme) =>
              meme.likes?.includes(auth.currentUser.uid) ? [meme.id] : []
            )
          );
          setUserLikes(userLikes);

          const repostsQuery = query(
            collection(db, "reposts"),
            where("userId", "==", auth.currentUser.uid)
          );
          const repostsSnap = await getDocs(repostsQuery);
          const reposts = new Set(
            repostsSnap.docs.map((doc) => doc.data().memeId)
          );
          setUserReposts(reposts);
        }

        if (snapshot.docs.length > 0) {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        }
      });

      return () => unsubscribe(); // Cleanup on unmount
    };

    fetchInitialMemes();
  }, []);

  useEffect(() => {
    if (loaderRef.current) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMemes();
        }
      });
      observer.observe(loaderRef.current);

      return () => observer.disconnect();
    }
  }, [loaderRef.current, lastVisible]);

  const loadMoreMemes = async () => {
    if (!lastVisible) return;

    setLoading(true);

    const memesQuery = query(
      collection(db, "memes"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(2)
    );

    const unsubscribe = onSnapshot(memesQuery, async (snapshot) => {
      const newMemes = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const memeData = docSnap.data();
          const userRef = doc(db, "users", memeData.uid);
          const userSnap = await getDoc(userRef);

          return {
            id: docSnap.id,
            ...memeData,
            user: userSnap.exists() ? userSnap.data() : {},
          };
        })
      );

      setMemes((prevMemes) => [...prevMemes, ...newMemes]);

      // Update userLikes and userReposts based on current user's actions
      if (auth.currentUser) {
        const userLikes = new Set(
          newMemes.flatMap((meme) =>
            meme.likes?.includes(auth.currentUser.uid) ? [meme.id] : []
          )
        );
        setUserLikes((prevLikes) => new Set([...prevLikes, ...userLikes]));

        const repostsQuery = query(
          collection(db, "reposts"),
          where("userId", "==", auth.currentUser.uid)
        );
        const repostsSnap = await getDocs(repostsQuery);
        const reposts = new Set(
          repostsSnap.docs.map((doc) => doc.data().memeId)
        );
        setUserReposts((prevReposts) => new Set([...prevReposts, ...reposts]));
      }

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setLastVisible(null); // No more memes
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  };

  const handleLike = async (memeId) => {
    if (!auth.currentUser) {
      toast.error("You Must Be Logged In to Like!");
      // router.push("/login");
      return;
    }

    const memeRef = doc(db, "memes", memeId);
    try {
      const userHasLiked = userLikes.has(memeId);
      if (userHasLiked) {
        await updateDoc(memeRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
        setUserLikes((prevLikes) => {
          const newLikes = new Set(prevLikes);
          newLikes.delete(memeId);
          return newLikes;
        });
      } else {
        await updateDoc(memeRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
        setUserLikes((prevLikes) => new Set(prevLikes).add(memeId));
      }
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  const handleReposts = async (memeId) => {
    if (!auth.currentUser) {
      toast.error("You Must Be Logged In to ReMeme!");

      return;
    }

    if (userReposts.has(memeId)) {
      toast.error("You Have Already ReMemed This!");
      return;
    }

    const repostsRef = doc(collection(db, "reposts"));
    try {
      await setDoc(repostsRef, {
        memeId: memeId,
        userId: auth.currentUser.uid,
        repostedAt: new Date(),
      });
      setUserReposts((prevReposts) => new Set(prevReposts).add(memeId));
      toast.success("ReMemed Successfully!");
    } catch (error) {
      toast.error("ReMemed Failed! Try Again Later!");
      console.error("Error reposting meme:", error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-[#1a202c] px-4 pb-4">
        <title>DHA7AKNA | Home </title>
        <Toaster />

        <div className="w-full max-w-3xl">
          {/* Left Ad Placeholder */}
          <div className="w-full bg-gray-200 rounded-md mb-6 p-4">
            <p>Ad</p>
          </div>
          {memes.length > 0 ? (
            memes.map((meme) => (
              <div key={meme.id} className="mb-6">
                <div className="flex items-center mt-8 mb-6">
                  <Link
                    href={`/profile/${meme.user.uid}`}
                    className="flex items-center"
                    passHref
                  >
                    <Image
                      src={meme.user.profilePictureUrl}
                      alt={meme.user.username}
                      className="rounded-full object-cover w-10 h-10"
                      width={48}
                      height={48}
                      priority
                    />
                    <p className="capitalize font-bold ml-2 text-white hover:text-[#8FA6CB] transition-all duration-200 ease-in-out">
                      {meme.user.username}
                    </p>
                    {meme.user.role === "verified" ? (
                      <Image
                        src="/icons/verified.svg"
                        alt="Verified Icon"
                        className="ml-1"
                        priority
                        width={18}
                        height={18}
                      />
                    ) : null}
                  </Link>

                  <div>
                    <p className="bg-[#E2E8F0] w-2 h-2 rounded-full ml-2 mr-2"></p>
                  </div>

                  <div>
                    <p className="text-sm text-[#A0AEC0]">
                      {meme.createdAt
                        ? formatDistanceToNow(meme.createdAt.toDate(), {
                            addSuffix: true,
                          })
                        : null}
                    </p>
                  </div>

                  {meme.type === "Original" ? (
                    <div className="badge badge-outline ml-2 mt-0.5">
                      Original
                    </div>
                  ) : null}
                </div>

                <Link href={`/meme/${meme.id}`} passHref>
                  <div className="my-6 w-full h-[450px]">
                    <Image
                      src={meme.imageUrl || "/meme-placeholder.jpg"}
                      alt={meme.caption || "Meme Image"}
                      className="rounded-3xl object-cover w-full h-full"
                      width={900}
                      height={900}
                      priority
                    />
                  </div>
                </Link>

                <div className="flex mt-2">
                  <div
                    onClick={() => handleLike(meme.id)}
                    className={`flex items-center p-3 rounded-xl ${
                      meme.likes?.length < 10 ? "w-16" : "w-20"
                    }  cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out`}
                  >
                    <Image
                      src={
                        userLikes.has(meme.id)
                          ? "/icons/heart-filled.svg"
                          : "/icons/heart.svg"
                      }
                      alt="Like Icon"
                      width={24}
                      height={24}
                    />
                    <p className="font-bold ml-2 text-white">
                      {meme.likes?.length || 0}
                    </p>
                  </div>

                  <Link href={`/meme/${meme.id}`}>
                    <div
                      className={`flex items-center p-3 rounded-xl ${
                        meme.comments?.length < 10 ? "w-16" : "w-20"
                      } ml-5 mr-5 cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out`}
                    >
                      <Image
                        src="/icons/comment.svg"
                        alt="Comment Icon"
                        priority
                        width={24}
                        height={24}
                      />
                      <p className={`font-bold ml-2 text-white `}>
                        {meme.comments?.length || 0}
                      </p>
                    </div>
                  </Link>

                  <div
                    onClick={() => handleReposts(meme.id)}
                    className="flex items-center p-3 rounded-xl w-14 justify-center cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
                  >
                    <Image
                      src="/icons/share.svg"
                      alt="Share Icon"
                      width={24}
                      height={24}
                      priority
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white flex items-center justify-center  h-[72.5vh]">
              <Loader />
            </div>
          )}
          <div ref={loaderRef} className="text-center p-4">
            {loading && <Loader />}
          </div>
        </div>
      </div>
    </div>
  );
}
