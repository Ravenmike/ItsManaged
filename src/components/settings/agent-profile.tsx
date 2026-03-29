"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAgentProfile } from "@/actions/settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AgentProfileProps {
  name: string;
  email: string;
}

export function AgentProfile({ name, email }: AgentProfileProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateAgentProfile(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="name" name="name" label="Name" defaultValue={name} required />
        <Input id="email" name="email" type="email" label="Email" defaultValue={email} required />
      </div>
      <Input
        id="newPassword"
        name="newPassword"
        type="password"
        label="New Password"
        placeholder="Leave blank to keep current"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Profile updated.</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
}
