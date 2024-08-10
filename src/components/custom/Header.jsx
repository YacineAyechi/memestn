"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <div className="flex items-center justify-between mx-20 mt-5">
      <div>
        <Link href={"/"}>
          <Image src="./logo.svg" alt="" width={170} height={41} priority />
        </Link>
      </div>

      <div className="w-2/5 flex items-center mx-auto justify-center">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-3 rounded-xl bg-[#F4F4F4] focus:outline-none"
        />
      </div>

      {loggedIn ? (
        <>
          <div className="flex items-center justify-center">
            <Link href={"/"} className="flex items-center justify-center">
              <Image
                src="/avatar.jpg"
                alt=""
                className="rounded-full"
                priority
                width={48}
                height={48}
              />
              <p className="font-bold ml-3 mr-3">Yacine Ayachi</p>
            </Link>

            <Link href={"/"}>
              <Image
                src="/icons/logout.svg"
                alt="Logout Icon"
                priority
                width={24}
                height={24}
              />
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <Link
              href={"/login"}
              className="bg-[#F4F4F4] border-2 border-[#F4F4F4] p-3 rounded-xl cursor-pointer hover:bg-[#dadada] hover:border-[#dadada] mr-3 transition-all duration-300 ease-in-out"
            >
              Sign In
            </Link>
            <Link
              href={"/login"}
              className="border-2 border-[#F4F4F4] p-3 rounded-xl cursor-pointer hover:bg-[#dadada] hover:border-[#dadada] transition-all duration-300 ease-in-out"
            >
              Sign Up
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
