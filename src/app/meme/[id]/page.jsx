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

export default function MemeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meme, setMeme] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [newComment, setNewComment] = useState(false);
  const [newLike, setNewLike] = useState(false);

  useEffect(() => {
    const memeRef = doc(db, "memes", id);

    // Set up a real-time listener for the meme document
    const unsubscribe = onSnapshot(memeRef, (docSnap) => {
      if (docSnap.exists()) {
        const memeData = docSnap.data();
        setMeme(memeData);
        setLikes(memeData.likes || []);
        setComments(memeData.comments || []);
        setNewComment(false);
        setNewLike(false);
      } else {
        router.push("/404"); // Redirect to a 404 page if meme is not found
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [id, router]);

  useEffect(() => {
    if (auth.currentUser) {
      const userHasLiked = likes.includes(auth.currentUser.uid);
      setUserHasLiked(userHasLiked);
    }
  }, [likes]);

  const handleLike = async () => {
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const memeRef = doc(db, "memes", id);
      await updateDoc(memeRef, {
        comments: arrayUnion({
          userId: auth.currentUser.uid,
          username: auth.currentUser.displayName, // Make sure the user has a display name
          text: comment,
        }),
      });
      setComment("");
      setNewComment(true);
      setTimeout(() => setNewComment(false), 500); // Reset animation after 500ms
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  return (
    <div className="text-white ">
      {meme ? (
        <div className="">
          <div className="max-w-5xl mx-auto  mt-16 pt-10 pb-12 px-16 rounded-lg bg-gray-800">
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

                <div className="flex items-center p-3 rounded-xl w-14 justify-center cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out">
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
                      <div className="flex items-center space-x-2">
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
          </div>
        </div>
      ) : (
        <p>Loading...</p>
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
      <Image
        src={userInfo.profilePictureUrl}
        alt={userInfo.username}
        width={30}
        height={30}
        className="rounded-full"
      />

      <div className="flex">
        <Link href={`/${userId}`} passHref>
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
