// components/SearchResultsWrapper.js

import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function SearchResultsWrapper() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
}
