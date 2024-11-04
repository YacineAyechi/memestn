"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

function SearchT() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="input input-bordered form-control flex flex-row bg-[#2D3748] focus-within:outline-none focus:outline-none text-white">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="w-24 sm:w-72 md:w-96 bg-[#2D3748]"
      />
      <button onClick={handleSearch}>
        <Image
          src="/icons/search.svg"
          alt="Search Icon"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}

export default SearchT;
