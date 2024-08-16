import Image from "next/image";
import Link from "next/link";

export default function NoProfileFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[79.9vh] text-center p-4 text-white">
      <Image
        src="/icons/sad.svg" // Replace with your own image path
        alt="No Profile Found"
        width={200}
        height={200}
        className="mb-4"
      />
      <h1 className="text-2xl font-bold mb-3">Oops! Profile not found</h1>
      <p className="mb-6">
        Sorry, the profile you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
