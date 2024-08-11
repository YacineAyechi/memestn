"use client";

import { auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login"); // Redirect to sign-in page after logging out
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-between mx-20 mt-5 text-white">
      <div>
        <Link href={"/"}>
          <Image src="./logo.svg" alt="" width={170} height={41} priority />
        </Link>
      </div>

      <div className="w-2/5 flex items-center mx-auto justify-center">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-3 rounded-xl bg-[#2D3748] text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {user ? (
        <div className="flex items-center justify-center">
          <Link href={"/account"} className="flex items-center justify-center">
            <Image
              src="/avatar.jpg"
              alt=""
              className="rounded-full"
              priority
              width={48}
              height={48}
            />
            <p className="font-bold ml-3 mr-3">{user.email}</p>
          </Link>

          <Link href={"/"} onClick={handleSignOut}>
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
        <div className="flex items-center justify-center">
          <Link
            href={"/login"}
            className="bg-[#4A90E2] border-2 border-[#4A90E2] p-3 rounded-xl cursor-pointer hover:bg-[#3B7AD6] hover:border-[#3B7AD6] mr-3 transition-all duration-300 ease-in-out"
          >
            Sign In
          </Link>
          <Link
            href={"/register"}
            className="border-2 border-[#4A90E2] p-3 rounded-xl cursor-pointer hover:bg-[#3B7AD6] hover:border-[#3B7AD6] transition-all duration-300 ease-in-out"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
