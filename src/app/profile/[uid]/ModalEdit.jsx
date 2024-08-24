"use client";

import Image from "next/image";

export default function ModalEdit({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ">
      <div className="p-2 rounded-lg relative bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-red-500"
        >
          <Image
            src="/icons/close.svg"
            alt="Close Icon"
            priority
            width={24}
            height={24}
          />
        </button>
        {children}
      </div>
    </div>
  );
}
