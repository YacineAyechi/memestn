import Image from "next/image";
import Link from "next/link";

export default function Card() {
  return (
    <div className="flex items-center justify-center h-screen bg-[--primary-bg]">
      <div>
        <div className="flex items-center">
          <Link href={"/"} className="flex items-center">
            <div>
              <Image
                src="/avatar.jpg"
                alt=""
                className="rounded-full"
                priority
                width={48}
                height={48}
              />
            </div>
            <div>
              <p className="font-bold ml-2 text-white hover:text-[#8FA6CB] transition-all duration-200 ease-in-out">
                Yacine Ayachi
              </p>
            </div>
          </Link>
          <div>
            <p className="bg-[#E2E8F0] w-2 h-2 rounded-full ml-2 mr-2"></p>
          </div>
          <div>
            <p className="text-sm text-[#A0AEC0]">15 m. ago</p>
          </div>
        </div>

        <div className="my-6 w-full h-full">
          <Image
            src="/meme.jpg"
            alt=""
            className="rounded-3xl object-cover"
            priority
            width={627}
            height={425}
          />
        </div>

        <div className="flex">
          <div className="flex items-center p-3 rounded-xl w-20 cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out">
            <Image
              src="/icons/heart.svg"
              alt="Like Icon"
              priority
              width={24}
              height={24}
              className=""
            />
            <p className="font-bold ml-2 text-white">12</p>
          </div>
          <div className="flex items-center p-3 rounded-xl w-20 ml-5 mr-5 cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out">
            <Image
              src="/icons/comment.svg"
              alt="Comment Icon"
              priority
              width={24}
              height={24}
            />
            <p className="font-bold ml-2 text-white">12</p>
          </div>
          <div className="flex items-center p-3 rounded-xl w-14 justify-center cursor-pointer bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out">
            <Image
              src="/icons/share.svg"
              alt="Share Icon"
              priority
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
