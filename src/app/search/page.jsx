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
        const memesQuery = query(
          collection(db, "memes"),
          where("caption", "==", searchQuery) // Query remains the same, assuming captions are stored in lowercase
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
      <h1 className="text-3xl font-bold mb-4">
        Search Results for &quot;{searchQuery}&quot;
      </h1>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((meme) => (
            <Link key={meme.id} href={`/meme/${meme.id}`}>
              <div className="bg-[#2D3748] rounded-xl p-4">
                <Image
                  src={meme.imageUrl}
                  alt={meme.caption}
                  width={500}
                  height={500}
                  className="rounded-xl"
                />
                <p className="mt-2 font-semibold">{meme.caption}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No results found for &quot;{searchQuery}&quot;.</p>
      )}
    </div>
  );
}
