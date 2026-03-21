"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCustomerReply } from "@/actions/messages";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CustomerReplyForm({ lookupToken }: { lookupToken: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const body = formData.get("body") as string;

    const result = await addCustomerReply(lookupToken, body);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    e.currentTarget.reset();
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        id="body"
        name="body"
        label="Add a reply"
        placeholder="Type your message..."
        rows={3}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send Reply"}
      </Button>
    </form>
  );
}
