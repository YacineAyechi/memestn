"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import ProfileEditForm from "@/components/custom/ProfileEditForm";
import Image from "next/image";
import Memes from "@/components/custom/Memes";
import NoProfileFound from "@/components/custom/NoProfileFound";
import ModalEdit from "./ModalEdit";
import Loader from "@/components/custom/Loader";
import Likes from "@/components/custom/Likes";
import Reposts from "@/components/custom/Reposts";

export default function UserProfilePage({ params }) {
  const { uid } = params;
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [memesCount, setMemesCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState("memes"); // State for selected tab
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const followersArray = Array.isArray(userData.followers)
            ? userData.followers
            : [];
          setUserProfile({ ...userData, followers: followersArray });
          setFollowersCount(followersArray.length);
          setLoading(false);

          const currentUser = auth.currentUser;
          if (currentUser) {
            setIsCurrentUser(currentUser.uid === uid);
            setIsFollowing(followersArray.includes(currentUser.uid));
          }

          // Fetch memes count after user profile is set
          fetchMemesCount();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        setLoading(false);
      }
    };

    const fetchMemesCount = async () => {
      try {
        const memesRef = collection(db, "memes");
        const q = query(memesRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        setMemesCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching memes count:", error.message);
      }
    };

    fetchUserProfile();
  }, [uid]);

  const toggleFollow = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User not authenticated.");
        return;
      }

      const userDocRef = doc(db, "users", uid);
      const currentUserDocRef = doc(db, "users", currentUser.uid);

      if (isFollowing) {
        await updateDoc(userDocRef, {
          followers: arrayRemove(currentUser.uid),
        });
        await updateDoc(currentUserDocRef, {
          following: arrayRemove(uid),
        });
        setFollowersCount(followersCount - 1);
        setIsFollowing(false);
      } else {
        await updateDoc(userDocRef, {
          followers: arrayUnion(currentUser.uid),
        });
        await updateDoc(currentUserDocRef, {
          following: arrayUnion(uid),
        });
        setFollowersCount(followersCount + 1);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error.message);
    }
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center m-auto h-[79.5vh]">
        <Loader />
      </div>
    );
  }

  if (!userProfile) {
    return <NoProfileFound />;
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "memes":
        return <Memes userId={uid} />;
      case "likes":
        return <Likes userId={uid} />;
      case "reposts":
        return <Reposts userId={uid} />;
      default:
        return null;
    }
  };

  return (
    <div className="text-white mb-16">
      <div className="flex items-center justify-center mx-auto text-center mt-20 mb-12">
        <div>
          <Image
            src={userProfile.profilePictureUrl || "/avatar.jpg"}
            alt={`${userProfile.username}'s profile picture`}
            className="border-2 rounded-full object-cover w-[200px] h-[200px]"
            priority
            width={200}
            height={200}
          />
          <div className="flex items-center justify-center mx-auto">
            <p className="font-bold text-2xl mt-5">{userProfile.username}</p>

            {userProfile.role === "verified" ? (
              <Image
                src="/icons/verified.svg"
                alt="Verified Icon"
                className="ml-2 mt-5"
                priority
                width={24}
                height={24}
              />
            ) : userProfile.role === "frezaa" ? (
              <Image
                src="/icons/moderator.svg"
                alt="Freza Icon"
                className="ml-2 mt-5"
                priority
                width={24}
                height={24}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex justify-center mx-auto items-center mb-6">
        <div>
          <p className="flex items-center justify-center mx-auto font-bold">
            {followersCount}
          </p>
          <p className="font-bold">Followers</p>
        </div>
        <div className="mx-10">
          <p className="flex items-center justify-center mx-auto font-bold">
            {userProfile.following?.length || 0}
          </p>
          <p className="font-bold">Followings</p>
        </div>
        <div>
          <p className="flex items-center justify-center mx-auto font-bold">
            {memesCount}
          </p>
          <p className="font-bold">Meme(s)</p>
        </div>
      </div>
      <div className="mb-12 flex items-center justify-center ">
        {!isCurrentUser && (
          <button
            onClick={toggleFollow}
            className="flex items-center justify-center mr-2 mt-6 p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
          >
            <Image
              src={isFollowing ? "/icons/followed.svg" : "/icons/follow.svg"}
              alt={isFollowing ? "Unfollow Icon" : "Follow Icon"}
              priority
              width={24}
              height={24}
            />
          </button>
        )}

        {isCurrentUser && (
          <button
            onClick={openEditModal}
            className="flex items-center justify-center ml-2 mt-6 p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
          >
            <Image
              src="/icons/pencil.svg"
              alt="Edit Icon"
              priority
              width={24}
              height={24}
            />
            <p className="ml-2">Edit Profile</p>
          </button>
        )}
      </div>

      <div className="flex justify-center mb-4">
        <button
          className={`font-bold p-2 mx-2 ${
            selectedTab === "memes"
              ? "border-b-2 border-[#8FA6CB]"
              : "border-b-2 border-transparent"
          }`}
          onClick={() => setSelectedTab("memes")}
        >
          Memes
        </button>

        {/* <button
          className={`font-bold p-2 mx-2 ${
            selectedTab === "likes"
              ? "border-b-2 border-[#8FA6CB]"
              : "border-b-2 border-transparent"
          }`}
          onClick={() => setSelectedTab("likes")}
        >
          Likes
        </button> */}

        <button
          className={`font-bold p-2 mx-2 ${
            selectedTab === "reposts"
              ? "border-b-2 border-[#8FA6CB]"
              : "border-b-2 border-transparent"
          }`}
          onClick={() => setSelectedTab("reposts")}
        >
          Rememes
        </button>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>

      {isCurrentUser && isEditing && (
        <ProfileEditForm userProfile={userProfile} />
      )}
      {isEditModalOpen && (
        <ModalEdit onClose={closeEditModal}>
          <ProfileEditForm userProfile={userProfile} onClose={closeEditModal} />
        </ModalEdit>
      )}
    </div>
  );
}
