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
      <p className="text-sm text-gray-600">Thanks for your feedback!</p>
    );
  }

  const total = helpfulCount + notHelpfulCount;

  return (
    <div>
      <p className="text-sm font-medium text-gray-700">
        Was this article helpful?
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => handleFeedback(true)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Yes
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          No
        </button>
      </div>
      {total > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          {helpfulCount} of {total} found this helpful
        </p>
      )}
    </div>
  );
}
