"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query").toLowerCase(); // Convert search query to lowercase
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;

      try {
        // Query for partial matches
        const memesQuery = query(
          collection(db, "memes"),
          where("captionLower", ">=", searchQuery),
          where("captionLower", "<=", searchQuery + "\uf8ff") // Adding \uf8ff for partial match
        );

        const querySnapshot = await getDocs(memesQuery);

        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        setSearchResults(results);
      } catch (error) {
        console.error("Error searching for memes:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 mt-8 text-white">
      <title>DHA7AKNA | Search</title>

      <h1 className="text-3xl font-bold mb-4 md:mx-5">
        Search Results for &quot;{searchQuery}&quot;
      </h1>
      {searchResults.length > 0 ? (
        <div className="mt-8 md:mx-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((meme) => (
              <Link key={meme.id} href={`/meme/${meme.id}`}>
                <div className="relative group cursor-pointer">
                  <div className="w-full h-80">
                    <Image
                      src={meme.imageUrl}
                      alt={meme.caption}
                      className="rounded-md object-cover object-top w-full h-full"
                      width={256}
                      height={256}
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-md">
                    <div className="flex">
                      <div className="flex items-center p-3 rounded-xl cursor-pointer bg-[#2D3748] transition-all duration-300 ease-in-out">
                        <Image
                          src={"/icons/label.svg"}
                          alt="Like Icon"
                          priority
                          width={24}
                          height={24}
                        />
                        <p className="font-bold ml-2 text-white">
                          {meme.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="md:mx-5">
          No results found for &quot;{searchQuery}&quot;.
        </p>
      )}
    </div>
  );
}
