"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

function Search() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);

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

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
    if (!isInputVisible) {
      // Focus the input field when it becomes visible
      document.getElementById("search-input").focus();
    }
  };

  return (
    <div className="relative sm:w-full md:w-2/5 sm:mb-4 md:mb-0 flex items-center justify-center">
      {/* Search input and button for desktop and visible mobile */}
      <div
        className={`flex items-center bg-[#2D3748] rounded-xl w-full ${
          isInputVisible ? "block" : "hidden md:flex"
        }`}
      >
        <input
          id="search-input"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 md:p-3 rounded-xl text-white bg-[#2D3748] placeholder-gray-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="p-2 md:p-3 rounded-xl bg-[#8FA6CB] text-white focus:outline-none"
        >
          {isInputVisible ? (
            <Image
              src="/icons/close.svg" // Path to your close (X) icon
              alt="Close Icon"
              width={24}
              height={24}
            />
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Search icon button for mobile */}
      <button
        type="button"
        onClick={toggleInputVisibility}
        className={`p-2 rounded-xl bg-[#2D3748] hover:bg-[#8FA6CB] transition-all duration-300 ease-in-out ${
          isInputVisible ? "hidden" : "flex md:hidden"
        }`}
      >
        <Image
          src="/icons/search.svg" // Path to your search icon
          alt="Search Icon"
          width={24}
          height={24}
        />
      </button>

      {/* Close icon button for mobile */}
      {isInputVisible && (
        <button
          type="button"
          onClick={toggleInputVisibility}
          className="absolute right-0 p-2 rounded-xl bg-[#8FA6CB] text-white focus:outline-none flex md:hidden"
        >
          <Image
            src="/icons/close.svg" // Path to your close (X) icon
            alt="Close Icon"
            width={24}
            height={24}
          />
        </button>
      )}
    </div>
  );
}

export default Search;
