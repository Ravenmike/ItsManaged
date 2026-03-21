"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCannedReply,
  updateCannedReply,
  deleteCannedReply,
} from "@/actions/canned-replies";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Reply {
  id: string;
  title: string;
  body: string;
  agent: { name: string };
}

export function CannedRepliesManager({ replies }: { replies: Reply[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createCannedReply(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    setShowForm(false);
    router.refresh();
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateCannedReply(id, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this canned reply?")) return;
    await deleteCannedReply(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>New Canned Reply</Button>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
        >
          <Input id="title" name="title" label="Title" placeholder="e.g., Greeting" required />
          <Textarea id="body" name="body" label="Body" placeholder="Type the reply template..." rows={3} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {replies.map((reply) =>
          editingId === reply.id ? (
            <form
              key={reply.id}
              onSubmit={(e) => handleUpdate(e, reply.id)}
              className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3"
            >
              <Input id="title" name="title" label="Title" defaultValue={reply.title} required />
              <Textarea id="body" name="body" label="Body" defaultValue={reply.body} rows={3} required />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit">Update</Button>
                <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div
              key={reply.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{reply.title}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                    {reply.body}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Created by {reply.agent.name}
                  </p>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(reply.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(reply.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ),
        )}

        {replies.length === 0 && !showForm && (
          <p className="text-sm text-gray-500">
            No canned replies yet. Create one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
