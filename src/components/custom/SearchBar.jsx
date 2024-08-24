// components/Searchbar.js

"use client";

import { Suspense } from "react";
import Search from "./Search";

export default function SearchBar() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  );
}
