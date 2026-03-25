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
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white shadow-sm placeholder:text-white/40 focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet backdrop-blur-sm"
      />

      {query.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 w-full rounded-xl border border-white/12 bg-navy-light shadow-2xl">
          {searching ? (
            <div className="p-4 text-sm text-white/50">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-white/50">
              No articles found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="divide-y divide-white/8">
              {results.map((article) => (
                <li key={article.id}>
                  <Link
                    href={
                      article.category
                        ? `/portal/kb/${article.category.slug}/${article.slug}`
                        : `/portal/kb`
                    }
                    className="block px-4 py-3 transition-colors hover:bg-white/6"
                  >
                    <p className="font-medium text-white">
                      {article.title}
                    </p>
                    {article.category && (
                      <p className="text-sm text-white/50">
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
