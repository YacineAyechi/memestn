import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="p-6 bg-[#1A202C]">
      <div className="flex items-center justify-center mb-4">
        <Link
          href=""
          target="_blank"
          className="text-[#E2E8F0] hover:text-[#4A90E2] transition-colors duration-300"
        >
          <FaFacebook className="text-2xl mx-2" />
        </Link>

        <Link
          href=""
          target="_blank"
          className="text-[#E2E8F0] hover:text-[#4A90E2] transition-colors duration-300"
        >
          <FaInstagram className="text-2xl mx-2" />
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <p className="text-[#A0AEC0] text-center">
          © 2024{" "}
          <Link
            href="/"
            className="text-[#E2E8F0] hover:text-[#4A90E2] transition-colors duration-300"
          >
            DHA7AKNA
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
