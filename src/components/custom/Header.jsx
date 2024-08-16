"use client";

import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsername(userData.username);
            setProfilePictureUrl(userData.profilePictureUrl || "/avatar.jpg"); // Use the default avatar if no URL is found
          } else {
            console.log("No user data found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUsername(null);
        setProfilePictureUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mx-5 md:mx-20 mt-5 text-white">
      <div className="mb-4 md:mb-0">
        <Link href={"/"}>
          <Image src="/logo.png" alt="Logo" width={210} height={35} priority />
        </Link>
      </div>

      <div className="w-full md:w-2/5 flex items-center justify-center mb-4 md:mb-0">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 md:p-3 rounded-xl bg-[#2D3748] text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {user ? (
        <div className="flex items-center">
          <div>
            <Link
              href="/create"
              className="flex items-center p-3 rounded-xl mr-6 cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
            >
              <Image
                src="/icons/plus.svg"
                alt="Create Meme Icon"
                priority
                width={24}
                height={24}
              />
              <p className="ml-1">Post a Meme</p>
            </Link>
          </div>

          <Link href={`${auth.currentUser.uid}`} className="flex items-center">
            {profilePictureUrl && (
              <Image
                src={profilePictureUrl}
                alt="Profile Picture"
                className="rounded-full"
                priority
                width={40}
                height={40}
              />
            )}
            <p className="font-bold ml-2 md:ml-3">{username || user.email}</p>
          </Link>

          {/* <Link href={"/create"} className="ml-3 flex items-center">
            <Image
              src="/icons/plus.svg"
              alt="Create Meme Icon"
              priority
              width={24}
              height={24}
            />
          </Link> */}

          <Link
            href={"/"}
            onClick={handleSignOut}
            className="ml-3 flex items-center"
          >
            <Image
              src="/icons/logout.svg"
              alt="Logout Icon"
              priority
              width={24}
              height={24}
            />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center">
          <Link
            href={"/login"}
            className="w-full md:w-24 sm:w-full flex justify-center border-2 border-[#FEC601] p-2 md:p-3 rounded-xl cursor-pointer hover:bg-[#FEC601] hover:border-[#FEC601] mb-2 md:mb-0 md:mr-3 transition-all duration-300 ease-in-out"
          >
            Sign In
          </Link>
          <Link
            href={"/register"}
            className="w-full md:w-24 sm:w-full flex justify-center border-2 border-[#FEC601] p-2 md:p-3 rounded-xl cursor-pointer hover:bg-[#FEC601] hover:border-[#FEC601] transition-all duration-300 ease-in-out"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
