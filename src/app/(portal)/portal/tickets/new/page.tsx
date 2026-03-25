"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "@/actions/tickets";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload, type UploadedFile } from "@/components/ui/file-upload";
import { KbSuggestions, KbSuggestionsDisplay } from "@/components/tickets/kb-suggestions";
import { TICKET_CATEGORIES } from "@/lib/constants";

const categoryOptions = TICKET_CATEGORIES.map((c) => ({
  value: c,
  label: c,
}));

export default function NewTicketPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState("");
  const { suggestions, handleQueryChange } = KbSuggestions();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("attachments", JSON.stringify(attachments));

    const result = await createTicket(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    if (result.lookupToken) {
      router.push(`/portal/tickets/${result.lookupToken}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-white">Submit a Request</h1>
      <p className="mt-2 text-white/65">
        Fill out the form below and we&apos;ll get back to you as soon as
        possible.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-white/12 bg-white/6 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="name"
            name="name"
            label="Your Name"
            placeholder="Jane Doe"
            required
            variant="dark"
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="jane@example.com"
            required
            variant="dark"
          />
        </div>

        <Select
          id="category"
          name="category"
          label="Category"
          placeholder="Select a category..."
          options={categoryOptions}
          defaultValue=""
          variant="dark"
        />

        <Input
          id="subject"
          name="subject"
          label="Subject"
          placeholder="Brief description of your issue"
          required
          variant="dark"
        />

        <Textarea
          id="description"
          name="description"
          label="Description"
          placeholder="Please describe your issue in detail..."
          rows={6}
          required
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleQueryChange(e.target.value);
          }}
          variant="dark"
        />

        <KbSuggestionsDisplay suggestions={suggestions} />

        <FileUpload onFilesUploaded={setAttachments} variant="dark" />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} variant="portal">
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}
