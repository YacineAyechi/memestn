"use client";

import Image from "next/image";
import Link from "next/link";

export default function NoReMemesFound() {
  return (
    <div className="flex flex-col mt-12 items-center justify-center h-full pb-10">
      <Image
        src="/icons/none.svg" // Replace with an actual image URL or path to an SVG/icon indicating "no content"
        alt="No memes found"
        className="w-36 h-36 mb-4"
        width={144}
        height={144}
        priority
      />

      <h2 className="text-xl font-semibold text-gray-200">No ReMemes Found</h2>
      <p className="text-gray-400 mt-2">
        It looks like you still haven&apos;t ReMemed anything.
      </p>
      <Link
        href="/"
        className="mt-6 p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
