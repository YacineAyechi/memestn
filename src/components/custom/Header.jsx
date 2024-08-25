"use client";

import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Modal from "./Modal";
import SearchBar from "./SearchBar";

export default function Header() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);

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

  return (
    <div className="relative flex items-center justify-between mx-4 md:mx-8 lg:mx-16 xl:mx-24 py-4 text-white">
      {/* Logo */}
      <div
        className={`${
          isInputVisible ? "hidden" : "flex"
        } items-center mb-4 md:mb-0 space-x-4`}
      >
        <Link href="/">
          <Image
            src="/D.png" // Mobile logo
            alt="Logo"
            width={80} // Adjust size for mobile
            height={20}
            className="block md:hidden flex items-center mx-auto justify-center mt-4"
          />
          <Image
            src="/final.png" // Desktop logo
            alt="Logo"
            width={210}
            height={35}
            className="hidden md:block"
          />
        </Link>
      </div>

      {/* Search Bar */}
      <SearchBar
        isInputVisible={isInputVisible}
        setIsInputVisible={setIsInputVisible}
      />

      {/* User actions (Profile, Create, Logout) */}
      <div
        className={`flex items-center space-x-4 md:space-x-6 ${
          isInputVisible ? "hidden" : "flex"
        }`}
      >
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
                  className="rounded-full object-cover w-8 h-8 md:w-10 md:h-10" // Smaller size for mobile, larger size for larger screens
                  priority
                  width={32} // Adjust width for mobile
                  height={32} // Adjust height for mobile
                />
              )}

              <p className="font-bold ml-2 hidden md:inline">{username}</p>
            </Link>

            <Link
              href="/"
              onClick={handleSignOut}
              className="flex items-center p-2 md:p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
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
          <div className="flex md:flex-row items-center">
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
