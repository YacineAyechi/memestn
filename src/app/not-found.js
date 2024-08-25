import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-[79.9vh] flex justify-center items-center mx-auto">
      <title>DHA7AKNA | Page Not Found</title>
      <div>
        <Image src="/404.svg" alt="" priority width={614} height={409} />
        <div className="flex mx-auto items-center justify-center">
          <Link
            href="/"
            className="text-white p-3 rounded-xl cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
