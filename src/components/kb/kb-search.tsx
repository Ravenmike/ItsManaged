"use client";

import { useState } from "react";
import Link from "next/link";
import { searchArticles } from "@/actions/kb";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  category: { slug: string; name: string } | null;
}

export function KbSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(value: string) {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    const articles = await searchArticles(value);
    setResults(articles);
    setSearching(false);
  }

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for help articles..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {query.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {searching ? (
            <div className="p-4 text-sm text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No articles found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((article) => (
                <li key={article.id}>
                  <Link
                    href={
                      article.category
                        ? `/portal/kb/${article.category.slug}/${article.slug}`
                        : `/portal/kb`
                    }
                    className="block px-4 py-3 hover:bg-gray-50"
                  >
                    <p className="font-medium text-gray-900">
                      {article.title}
                    </p>
                    {article.category && (
                      <p className="text-sm text-gray-500">
                        {article.category.name}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
