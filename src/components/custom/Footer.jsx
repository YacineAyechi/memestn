import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <div>
      <div className="p-4 bg-[#f4f4f4]">
        <div className="flex items-center justify-center mb-3 ">
          <Link href="" target="_blank">
            <FaFacebook className="text-[23px] mr-1" />
          </Link>

          <Link href="" target="_blank">
            <FaInstagram className="text-[23px] ml-1" />
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <p className="text-[#868686]">
            © 2024 <Link href="/">DHA7AKNI</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
