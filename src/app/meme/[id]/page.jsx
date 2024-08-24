"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/custom/Loader";
import toast, { Toaster } from "react-hot-toast";

export default function MemeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meme, setMeme] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasReposted, setUserHasReposted] = useState(false); // New state for ReMeme
  const [newComment, setNewComment] = useState(false);
  const [newLike, setNewLike] = useState(false);
  const [newReMeme, setNewReMeme] = useState(false); // New state for ReMeme animation
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const memeRef = doc(db, "memes", id);

    // Set up a real-time listener for the meme document
    const unsubscribe = onSnapshot(memeRef, (docSnap) => {
      if (docSnap.exists()) {
        const memeData = docSnap.data();
        setMeme(memeData);
        setLikes(memeData.likes || []);
        setComments(memeData.comments || []);
        setUserHasReposted(
          memeData.reposts?.includes(auth.currentUser?.uid) || false
        ); // Check repost status
        setNewComment(false);
        setNewLike(false);
        setNewReMeme(false); // Reset ReMeme animation
      } else {
        router.push("/404"); // Redirect to a 404 page if meme is not found
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [id, router]);

  useEffect(() => {
    if (auth.currentUser) {
      setUserLoggedIn(true);
      const userHasLiked = likes.includes(auth.currentUser.uid);
      setUserHasLiked(userHasLiked);
    } else {
      setUserLoggedIn(false);
    }
  }, [likes]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      toast.error("You Must Be Logged In to Like!");
      return;
    }

    const memeRef = doc(db, "memes", id);
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
      setUserHasLiked(!userHasLiked);
      setNewLike(true);
      setTimeout(() => setNewLike(false), 500); // Reset animation after 500ms
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  const handleReMeme = async () => {
    if (!auth.currentUser) {
      toast.error("You Must Be Logged In to ReMeme!");
      return;
    }

    const memeRef = doc(db, "memes", id);
    try {
      if (userHasReposted) {
        toast.error("You Have Already ReMemed This!");
        return;
      }

      await updateDoc(memeRef, {
        reposts: arrayUnion(auth.currentUser.uid),
      });
      setUserHasReposted(true);
      setNewReMeme(true);
      setTimeout(() => setNewReMeme(false), 500); // Reset animation after 500ms
    } catch (error) {
      console.error("Error updating reposts:", error.message);
    }
  };

  // const handleCommentSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!auth.currentUser) {
  //     router.push("/login"); // Redirect to login if not authenticated
  //     return;
  //   }

  //   if (!comment.trim()) {
  //     toast.error("Comment cannot be empty.");
  //     return;
  //   }

  //   try {
  //     const memeRef = doc(db, "memes", id);
  //     await updateDoc(memeRef, {
  //       comments: arrayUnion({
  //         userId: auth.currentUser.uid,
  //         username: auth.currentUser.displayName, // Make sure the user has a display name
  //         text: comment,
  //       }),
  //     });
  //     setComment("");
  //     setNewComment(true);
  //     setTimeout(() => setNewComment(false), 500); // Reset animation after 500ms
  //   } catch (error) {
  //     console.error("Error adding comment:", error.message);
  //   }
  // };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const memeRef = doc(db, "memes", id);
      const memeDoc = await getDoc(memeRef);

      if (memeDoc.exists()) {
        const memeData = memeDoc.data();
        const newComment = {
          userId: auth.currentUser.uid,
          // username: auth.currentUser.displayName,
          text: comment,
        };

        const updatedComments = [...(memeData.comments || []), newComment];

        await updateDoc(memeRef, {
          comments: updatedComments,
        });

        setComment(""); // Clear the comment input
        setNewComment(true); // Trigger new comment animation
        setTimeout(() => setNewComment(false), 500); // Reset animation after 500ms
      } else {
        toast.error("Failed to add comment: Meme not found.");
      }
    } catch (error) {
      console.error("Error adding comment:", error.message);
      toast.error("An error occurred while adding your comment.");
    }
  };

  return (
    <div className="text-white">
      <Toaster />
      {meme ? (
        <div>
          <div className="max-w-5xl mx-auto mt-16 pt-10 pb-12 px-16 rounded-lg bg-gray-800">
            <div className="mb-6">
              <p className="text-xl mb-4 capitalize">{meme.caption}</p>

              <Image
                src={meme.imageUrl}
                alt={meme.caption || "Meme"}
                className="rounded-lg w-full mb-4"
                width={800}
                height={800}
                priority
              />

              <div className="flex">
                <div
                  onClick={handleLike}
                  className={`flex items-center p-3 rounded-xl ${
                    comments.length < 10 ? "w-16" : "w-20"
                  }  cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out ${
                    newLike ? "bounce" : ""
                  }`}
                >
                  <Image
                    src={
                      userHasLiked
                        ? "/icons/heart-filled.svg"
                        : "/icons/heart.svg"
                    }
                    alt="Like Icon"
                    width={24}
                    height={24}
                  />
                  <p
                    className={`font-bold ml-2 text-white ${
                      newLike ? "fade-in" : ""
                    }`}
                  >
                    {likes.length}
                  </p>
                </div>

                <div
                  className={`flex items-center p-3 rounded-xl ${
                    comments.length < 10 ? "w-16" : "w-20"
                  } ${
                    newComment ? "fade-in" : "" ? "bounce" : ""
                  } ml-5 mr-5 cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out`}
                >
                  <Image
                    src="/icons/comment.svg"
                    alt="Comment Icon"
                    priority
                    width={24}
                    height={24}
                  />
                  <p
                    className={`font-bold ml-2 text-white ${
                      newComment ? "fade-in" : ""
                    }`}
                  >
                    {comments.length}
                  </p>
                </div>

                <div
                  onClick={handleReMeme}
                  className={`flex items-center p-3 rounded-xl ${
                    newReMeme ? "bounce" : ""
                  } w-14 justify-center cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out`}
                >
                  <Image
                    src="/icons/share.svg"
                    alt="Share Icon"
                    priority
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              {comments.length > 0 ? (
                <ul>
                  {comments.map((c, index) => (
                    <li key={index} className="mb-2">
                      <div className="flex items-center">
                        <UserProfileLink userId={c.userId} />
                        <p>{c.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            {userLoggedIn ? (
              <form onSubmit={handleCommentSubmit} className="flex flex-col">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#2D3748] text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Add a comment..."
                />
                <button
                  type="submit"
                  className="mt-4 p-3 rounded-lg bg-[#FEC601] text-white font-semibold hover:bg-[#FFC107] transition-all duration-300 ease-in-out"
                >
                  Post Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-400 mt-4">
                Please{" "}
                <Link
                  href="/login"
                  className="text-[#FEC601] font-bold hover:text-[#FFC107] transition-all duration-300 ease-in-out"
                >
                  log in
                </Link>{" "}
                to add a comment.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center m-auto h-[79.5vh]">
          <Loader />
        </div>
      )}
    </div>
  );
}

// Fetch and display username and profile picture for the given userId
function UserProfileLink({ userId }) {
  const [userInfo, setUserInfo] = useState({
    username: "",
    profilePictureUrl: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const { username, profilePictureUrl, role } = userSnap.data();
          setUserInfo({ username, profilePictureUrl, role });
        }
      } catch (error) {
        console.error("Error fetching user info:", error.message);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <div className="flex items-center space-x-2 bg-gray-800 rounded-md p-1">
      {/* <Image
        src={userInfo.profilePictureUrl}
        alt={userInfo.username}
        width={30}
        height={30}
        className="rounded-full"
      /> */}

      {userInfo.username && (
        <Image
          src={userInfo.profilePictureUrl}
          alt={userInfo.username}
          width={30}
          height={30}
          className="rounded-full"
        />
      )}

      <div className="flex">
        <Link href={`/profile/${userId}`} passHref>
          <span className="font-bold hover:underline cursor-pointer">
            {userInfo.username}
          </span>
        </Link>

        {userInfo.role === "verified" ? (
          <Image
            src="/icons/verified.svg"
            alt="Verified Icon"
            className="ml-1"
            priority
            width={18}
            height={18}
          />
        ) : userInfo.role === "frezaa" ? (
          <>
            <Image
              src="/icons/moderator.svg"
              alt="Freza Icon"
              className="ml-1"
              priority
              width={18}
              height={18}
            />
            <span className="font-bold">🍓</span>
          </>
        ) : null}

        <span className="font-bold ml-1 mr-1">:</span>
      </div>
    </div>
  );
}
