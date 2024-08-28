// components/SearchResultsWrapper.js

import { Suspense } from "react";
import SearchResults from "./SearchResults";
import Loader from "./Loader";

export default function SearchResultsWrapper() {
  return (
    <Suspense
      fallback={
        <div className="text-white flex items-center justify-center  h-[72.5vh]">
          <Loader />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
