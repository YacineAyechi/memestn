"use client";

import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Modal from "./Modal";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="navbar p-4 xl:px-24">
      <div className="flex-1">
        <Link href="/" className="">
          <Image
            src="/D.png"
            alt="Logo"
            width={80}
            height={20}
            className="block md:hidden"
          />
          <Image
            src="/final.png"
            alt="Logo"
            width={210}
            height={35}
            className="hidden md:block"
          />
        </Link>
      </div>
      <div className="flex-none gap-2">
        <SearchBar />
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {profilePictureUrl && (
                  <Image
                    src={profilePictureUrl}
                    alt="Profile Picture"
                    className="rounded-full object-cover w-8 h-8 md:w-10 md:h-10"
                    priority
                    width={32}
                    height={32}
                  />
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <p>
                  Signed in as <strong>{username}</strong>
                </p>
              </li>
              <li>
                <Link
                  href={`/profile/${auth.currentUser.uid}`}
                  className="justify-between"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={openModal}>Post a Meme</button>
              </li>

              <li>
                <Link href="/" onClick={handleSignOut}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex flex-row md:flex-row items-center md:ml-2">
            <Link
              href="/login"
              className="w-full md:w-24 mr-1 flex justify-center border-2 border-[#FEC601] p-2 md:p-3 rounded-xl cursor-pointer hover:bg-[#FEC601] hover:border-[#FEC601]  md:mb-0 md:mr-3 transition-all duration-300 ease-in-out"
            >
              <span className="hidden md:block text-white">Sign In</span>
              <Image
                src="/icons/login.svg"
                alt="Sign In Icon"
                className="block md:hidden"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="/register"
              className="w-full md:w-24 flex justify-center border-2 border-[#FEC601] p-2 md:p-3 rounded-xl cursor-pointer hover:bg-[#FEC601] hover:border-[#FEC601] transition-all duration-300 ease-in-out"
            >
              <span className="hidden md:block text-white">Sign Up</span>
              <Image
                src="/icons/signup.svg"
                alt="Sign Up Icon"
                className="block md:hidden"
                width={24}
                height={24}
              />
            </Link>
          </div>
        )}
      </div>

      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
}
