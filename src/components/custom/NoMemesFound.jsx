"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";

export default function NoMemesFound() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("no-scroll");
  };
  return (
    <div className="flex flex-col items-center justify-center h-full pb-10">
      <Image
        src="/icons/sad.svg" // Replace with an actual image URL or path to an SVG/icon indicating "no content"
        alt="No memes found"
        className="w-36 h-36 mb-4"
        width={144}
        height={144}
        priority
      />

      <h2 className="text-xl font-semibold text-gray-200">
        No memes here... yet!
      </h2>
      <p className="text-gray-400 mt-2">
        It looks like you haven&apos;t posted any memes.
      </p>
      <div>
        <button
          className="mt-6 flex items-center p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
          onClick={openModal}
        >
          <Image
            src="/icons/plus.svg"
            alt="Create Meme Icon"
            priority
            width={24}
            height={24}
          />
          <p className="ml-1">Post a Meme</p>
        </button>
      </div>

      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
}
