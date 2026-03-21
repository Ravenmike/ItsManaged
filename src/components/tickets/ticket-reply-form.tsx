"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAgentReply } from "@/actions/messages";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CannedReply {
  id: string;
  title: string;
  body: string;
}

interface TicketReplyFormProps {
  ticketId: string;
  cannedReplies: CannedReply[];
}

export function TicketReplyForm({ ticketId, cannedReplies }: TicketReplyFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await addAgentReply(ticketId, body, isInternal);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setBody("");
    setIsInternal(false);
    setSubmitting(false);
    router.refresh();
  }

  function insertCannedReply(replyBody: string) {
    setBody((prev) => (prev ? `${prev}\n\n${replyBody}` : replyBody));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {isInternal ? "Internal Note" : "Reply"}
        </label>
        <div className="flex items-center gap-3">
          {cannedReplies.length > 0 && (
            <select
              className="rounded-md border border-gray-300 px-2 py-1 text-sm"
              value=""
              onChange={(e) => {
                const reply = cannedReplies.find((r) => r.id === e.target.value);
                if (reply) insertCannedReply(reply.body);
              }}
            >
              <option value="">Insert canned reply...</option>
              {cannedReplies.map((reply) => (
                <option key={reply.id} value={reply.id}>
                  {reply.title}
                </option>
              ))}
            </select>
          )}
          <label className="flex items-center gap-1.5 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded border-gray-300"
            />
            Internal note
          </label>
        </div>
      </div>

      {isInternal && (
        <div className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          This note is only visible to agents. The customer will not see it.
        </div>
      )}

      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={isInternal ? "Add an internal note..." : "Type your reply..."}
        rows={4}
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} variant={isInternal ? "secondary" : "primary"}>
          {submitting
            ? "Sending..."
            : isInternal
              ? "Add Note"
              : "Send Reply"}
        </Button>
      </div>
    </form>
  );
}
