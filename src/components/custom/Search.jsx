// components/Search.js

"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

function Search() {
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

  return (
    <div className="w-full md:w-2/5 flex items-center justify-center mb-4 md:mb-0 rounded-xl bg-[#2D3748]">
      <input
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
        Search
      </button>
    </div>
  );
}

export default Search;
