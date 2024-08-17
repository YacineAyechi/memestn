"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProfileEditForm from "@/components/custom/ProfileEditForm";
import Image from "next/image";
import Memes from "@/components/custom/Memes";
import Link from "next/link";
import NoProfileFound from "@/components/custom/NoProfileFound";

export default function UserProfilePage({ params }) {
  const { uid } = params;
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for managing edit form visibility

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserProfile(userData);
          setLoading(false);

          const currentUser = auth.currentUser;
          if (currentUser && currentUser.uid === uid) {
            setIsCurrentUser(true);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [uid]);

  if (loading) {
    return <></>;
  }

  if (!userProfile) {
    return <NoProfileFound />;
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-center mx-auto text-center my-20">
        <div>
          <Image
            src={userProfile.profilePictureUrl || "/avatar.jpg"}
            alt={`${userProfile.username}'s profile picture`}
            className="rounded-full"
            priority
            width={200}
            height={200}
          />
          {/* <p className="font-bold text-2xl mt-5">{userProfile.username}</p> */}
          <div className="flex items-center justify-center mx-auto">
            <p className="font-bold text-2xl mt-5">{userProfile.username}</p>
            {userProfile.role === "verified" && (
              <Image
                src="/icons/verified.svg"
                alt="Verified Icon"
                className="ml-2 mt-5"
                priority
                width={24}
                height={24}
              />
            )}
          </div>
          {isCurrentUser && (
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="mt-6 p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center mx-auto">
                {isEditing ? (
                  <>
                    <Image
                      src="/icons/close.svg"
                      alt="Close Icon"
                      priority
                      width={24}
                      height={24}
                    />
                    <p className="ml-2">Cancel Edit</p>
                  </>
                ) : (
                  <>
                    <Image
                      src="/icons/pencil.svg"
                      alt="Edit Icon"
                      priority
                      width={24}
                      height={24}
                    />
                    <p className="ml-2">Edit Profile</p>
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
      {isCurrentUser && isEditing && (
        <ProfileEditForm userProfile={userProfile} />
      )}{" "}
      <Memes userId={uid} />
    </div>
  );
}
