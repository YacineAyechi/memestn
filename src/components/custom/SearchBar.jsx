// components/Searchbar.js

"use client";

import { Suspense } from "react";
import Search from "./Search";
import SearchT from "./SearchT";

export default function SearchBar() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchT />
    </Suspense>
  );
}
