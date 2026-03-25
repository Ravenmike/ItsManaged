"use client";

import { useState } from "react";
import Link from "next/link";
import { searchArticles } from "@/actions/kb";

interface Suggestion {
  id: string;
  title: string;
  slug: string;
  category: { slug: string; name: string } | null;
}

export function KbSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  function handleQueryChange(query: string) {
    if (debounceTimer) clearTimeout(debounceTimer);

    if (query.trim().length < 5) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchArticles(query);
      setSuggestions(results.slice(0, 3));
    }, 500);
    setDebounceTimer(timer);
  }

  return { suggestions, handleQueryChange };
}

// Presentational component
export function KbSuggestionsDisplay({ suggestions }: { suggestions: Suggestion[] }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-violet/30 bg-violet/10 p-4">
      <p className="text-sm font-medium text-violet-light">
        These articles might help:
      </p>
      <ul className="mt-2 space-y-1">
        {suggestions.map((article) => (
          <li key={article.id}>
            <Link
              href={
                article.category
                  ? `/portal/kb/${article.category.slug}/${article.slug}`
                  : "/portal/kb"
              }
              target="_blank"
              className="text-sm text-gold-light hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
