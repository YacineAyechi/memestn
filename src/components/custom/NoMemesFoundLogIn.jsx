import Image from "next/image";
import Link from "next/link";

export default function NoMemesFoundLogIn() {
  return (
    <div className="flex flex-col items-center justify-center h-full pb-10">
      <Image
        src="/icons/sad.svg"
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
        <Link
          href="/login"
          className="w-24 text-center mt-6 flex items-center p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
          passHref
        >
          <p className="flex mx-auto justify-center items-center text-center">
            Sign In
          </p>
        </Link>
      </div>
    </div>
  );
}
