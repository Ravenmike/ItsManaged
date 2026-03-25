"use client";

import { useState } from "react";
import { submitArticleFeedback } from "@/actions/kb";

interface ArticleFeedbackProps {
  articleId: string;
  helpfulCount: number;
  notHelpfulCount: number;
}

export function ArticleFeedback({
  articleId,
  helpfulCount,
  notHelpfulCount,
}: ArticleFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);

  async function handleFeedback(helpful: boolean) {
    await submitArticleFeedback(articleId, helpful);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-white/65">Thanks for your feedback!</p>
    );
  }

  const total = helpfulCount + notHelpfulCount;

  return (
    <div>
      <p className="text-sm font-medium text-white/80">
        Was this article helpful?
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => handleFeedback(true)}
          className="rounded-lg border border-white/12 px-4 py-2 text-sm text-white/65 transition-colors hover:border-violet/50 hover:text-white"
        >
          Yes
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="rounded-lg border border-white/12 px-4 py-2 text-sm text-white/65 transition-colors hover:border-violet/50 hover:text-white"
        >
          No
        </button>
      </div>
      {total > 0 && (
        <div className="mt-3">
          <p className="text-sm text-white/65">
            {Math.round((helpfulCount / total) * 100)}% found this helpful
            <span className="ml-1 text-xs text-white/40">
              ({total} {total === 1 ? "vote" : "votes"})
            </span>
          </p>
          <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-violet"
              style={{
                width: `${Math.round((helpfulCount / total) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
