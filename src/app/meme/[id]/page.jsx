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
  deleteDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/custom/Loader";
import toast, { Toaster } from "react-hot-toast";
import MemeEditModal from "@/components/custom/MemeEditModal";
import { formatDistanceToNow } from "date-fns";

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
  const [isOwner, setIsOwner] = useState(false); // New state to check if the user is the owner
  const [isMemeEditModalOpen, setIsMemeEditModalOpen] = useState(false);
  const [username, setUsername] = useState(""); // New state to store the username

  const openMemeEditModal = () => {
    setIsMemeEditModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeMemeEditModal = () => {
    setIsMemeEditModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  useEffect(() => {
    const memeRef = doc(db, "memes", id);

    const unsubscribe = onSnapshot(memeRef, async (docSnap) => {
      if (docSnap.exists()) {
        const memeData = docSnap.data();
        setMeme(memeData);
        setLikes(memeData.likes || []);
        setComments(memeData.comments || []);
        setUserHasReposted(
          memeData.reposts?.includes(auth.currentUser?.uid) || false
        );
        setIsOwner(memeData.uid === auth.currentUser?.uid);

        // Fetch the username
        const userRef = doc(db, "users", memeData.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().name);
        } else {
          console.log("User document does not exist.");
        }
      } else {
        router.push("/404");
      }
    });

    return () => unsubscribe();
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

  const handleDelete = async () => {
    if (!auth.currentUser || !isOwner) {
      toast.error("You are not authorized to delete this meme.");
      return;
    }

    try {
      const memeRef = doc(db, "memes", id);
      await deleteDoc(memeRef);
      toast.success("Meme deleted successfully!");
      router.push("/"); // Redirect to homepage after deletion
    } catch (error) {
      console.error("Error deleting meme:", error.message);
      toast.error("An error occurred while deleting the meme.");
    }
  };

  const handleReport = async () => {
    if (!auth.currentUser) {
      toast.error("You Must Be Logged In to Report!");
      return;
    }

    try {
      const memeRef = doc(db, "memes", id);
      await updateDoc(memeRef, {
        reports: arrayUnion(auth.currentUser.uid),
      });
      toast.success("Meme reported successfully.");
    } catch (error) {
      console.error("Error reporting meme:", error.message);
      toast.error("An error occurred while reporting the meme.");
    }
  };

  return (
    <div className="text-white bg-[--primary-bg] min-h-screen">
      <title>DHA7AKNA</title>
      <Toaster />
      {meme ? (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex">
              <div className="flex items-center justify-center">
                <UserProfileLink sizeClass="w-10 h-10" userId={meme.uid} />

                <div>
                  <p className="bg-[#E2E8F0] w-2 h-2 rounded-full ml-2 mr-2"></p>
                </div>

                <div className="flex items-center">
                  <p className="text-sm text-[#A0AEC0]">
                    {meme.createdAt
                      ? formatDistanceToNow(meme.createdAt.toDate(), {
                          addSuffix: true,
                        })
                      : "Unknown time"}
                  </p>
                  {meme.type === "Original" ? (
                    <span className="whitespace-nowrap rounded-full border border-white px-2.5 py-0 text-sm text-white ml-2">
                      Original
                    </span>
                  ) : null}

                  {meme.type === "Original" && meme.isApproved ? (
                    <span className="whitespace-nowrap rounded-full border border-green-500 bg-green-500 px-2.5 py-0 text-sm text-white ml-2">
                      Approved
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="dropdown dropdown-left dropdown-bottom mb-6 ml-auto cursor-pointer">
                <Image
                  src={"/icons/dots.svg"}
                  alt="Like Icon"
                  className="mt-2"
                  width={24}
                  height={24}
                  tabIndex={0}
                  role="button"
                />
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 p-2 shadow"
                >
                  {isOwner && (
                    <>
                      <li onClick={openMemeEditModal}>
                        <a>
                          <Image
                            src="/icons/pencil.svg"
                            alt="Edit Icon"
                            width={18}
                            height={18}
                          />
                          Edit
                        </a>
                      </li>
                      <li onClick={handleDelete}>
                        <a>
                          <Image
                            src="/icons/delete.svg"
                            alt="Edit Icon"
                            width={18}
                            height={18}
                          />
                          Delete
                        </a>
                      </li>
                    </>
                  )}
                  <li onClick={handleReport}>
                    <a className="text-[#FF0000]">
                      <Image
                        src="/icons/report.svg"
                        alt="Edit Icon"
                        width={18}
                        height={18}
                      />
                      Report
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-2 text-xl md:text-2xl font-bold mb-6">
              {meme.caption}
            </p>

            <Image
              src={meme.imageUrl}
              alt={meme.caption || "Meme"}
              className="rounded-lg w-full mb-4"
              width={800}
              height={800}
              priority
            />

            <div className="flex flex-wrap justify-start space-x-4 mb-4">
              <div
                onClick={handleLike}
                className={`flex items-center p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out ${
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
                className={`flex items-center p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out ${
                  newComment ? "fade-in" : ""
                }`}
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
                className={`flex items-center p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out ${
                  newReMeme ? "bounce" : ""
                }`}
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

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              {comments.length > 0 ? (
                <ul className="space-y-2">
                  {comments.map((c, index) => (
                    // <li key={index} className="flex items-center">
                    //   <UserProfileLink sizeClass="w-8 h-8" userId={c.userId} />
                    //   <span className="font-bold mr-1">:</span>
                    //   <div className="w-10">
                    //     <p className="flex w-full break-words">{c.text}</p>
                    //   </div>
                    // </li>
                    <li
                      key={index}
                      className="bg-[#2D3748] p-4 rounded-lg max-w-full"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <UserProfileLink
                          sizeClass="w-8 h-8"
                          userId={c.userId}
                        />
                      </div>
                      <p className="text-white max-w-full break-words">
                        {c.text}
                      </p>
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
                  className="mt-2 px-4 py-2 bg-[#FEC601] rounded-lg font-semibold text-white hover:bg-[#FFC107] transition-all duration-300 ease-in-out"
                >
                  Comment
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

          <Link href="/" className="block mt-3 text-[#4A90E2] hover:underline">
            &larr; Back to homepage
          </Link>
          {isMemeEditModalOpen && (
            <MemeEditModal
              memeId={id}
              currentCaption={meme.caption}
              onClose={closeMemeEditModal}
            />
          )}
        </div>
      ) : (
        <div className="text-white flex items-center justify-center  h-[72.5vh]">
          <Loader />
        </div>
      )}
    </div>
  );
}

// Helper Component to Display User's Profile Link
const UserProfileLink = ({ userId, sizeClass }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <div>
      <Link
        className="flex items-center space-x-2 bg-gray-800 rounded-md p-1"
        href={`/profile/${userId}`}
        passHref
      >
        {user.username && (
          <Image
            src={user.profilePictureUrl}
            alt={user.username}
            width={30}
            height={30}
            className={`rounded-full object-cover ${sizeClass}`}
          />
        )}

        <div className="flex">
          <span className="font-bold hover:underline cursor-pointer">
            {user.username}
          </span>

          {user.role === "verified" ? (
            <Image
              src="/icons/verified.svg"
              alt="Verified Icon"
              className="ml-1"
              priority
              width={18}
              height={18}
            />
          ) : user.role === "frezaa" ? (
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
        </div>
      </Link>
    </div>
  );
};
