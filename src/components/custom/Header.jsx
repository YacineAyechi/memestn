"use client";

import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Modal from "./Modal";

export default function Header() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            setProfilePictureUrl(userData.profilePictureUrl || "/avatar.jpg");
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

  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mx-4 md:mx-8 lg:mx-16 xl:mx-24 py-4 text-white">
      <div className="mb-4 md:mb-0">
        <Link href="/">
          <Image src="/final.png" alt="Logo" width={210} height={35} priority />
        </Link>
      </div>

      <div className="w-full md:w-2/5 flex items-center justify-center mb-4 md:mb-0 rounded-xl bg-[#2D3748]">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 md:p-3 rounded-xl text-white bg-[#2D3748] placeholder-gray-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="p-2 md:p-3 rounded-xl bg-[#8FA6CB] text-white focus:outline-none"
        >
          Search
        </button>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        {user ? (
          <>
            <button
              onClick={openModal}
              className="flex items-center p-2 md:p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
            >
              <Image
                src="/icons/plus.svg"
                alt="Create Meme Icon"
                priority
                width={24}
                height={24}
              />
              <p className="ml-2 hidden md:inline">Post a Meme</p>
            </button>

            <Link
              href={`/profile/${auth.currentUser.uid}`}
              className="flex items-center"
            >
              {profilePictureUrl && (
                <Image
                  src={profilePictureUrl}
                  alt="Profile Picture"
                  className="rounded-full object-cover w-10 h-10"
                  priority
                  width={40}
                  height={40}
                />
              )}
              <p className="font-bold ml-2 hidden md:inline">{username}</p>
            </Link>

            <Link
              href="/"
              onClick={handleSignOut}
              className="flex items-center"
            >
              <Image
                src="/icons/logout.svg"
                alt="Logout Icon"
                priority
                width={24}
                height={24}
              />
            </Link>
          </>
        ) : (
          <div className="flex flex-col md:flex-row items-center">
            <Link
              href="/login"
              className="w-full md:w-24 flex justify-center border-2 border-[#FEC601] p-2 md:p-3 rounded-xl cursor-pointer hover:bg-[#FEC601] hover:border-[#FEC601] mb-2 md:mb-0 md:mr-3 transition-all duration-300 ease-in-out"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="w-full md:w-24 flex justify-center border-2 border-[#FEC601] p-2 md:p-3 rounded-xl cursor-pointer hover:bg-[#FEC601] hover:border-[#FEC601] transition-all duration-300 ease-in-out"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
}
