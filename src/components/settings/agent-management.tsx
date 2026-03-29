"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAgent, removeAgent } from "@/actions/settings";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function AgentManagement({
  agents,
  currentAgentId,
}: {
  agents: Agent[];
  currentAgentId: string;
}) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await addAgent(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setShowAddForm(false);
    setSubmitting(false);
    router.refresh();
  }

  async function handleRemove(agentId: string) {
    if (!confirm("Remove this agent? Their assigned tickets will become unassigned.")) return;

    setRemoving(agentId);
    const result = await removeAgent(agentId);

    if (result.error) {
      alert(result.error);
      setRemoving(null);
      return;
    }

    setRemoving(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Agents</h2>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Agent"}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="name" name="name" label="Name" placeholder="Jane Smith" required />
            <Input id="email" name="email" type="email" label="Email" placeholder="jane@example.com" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="password" name="password" type="password" label="Password" placeholder="Min 8 characters" required />
            <Select
              id="role"
              name="role"
              label="Role"
              options={[
                { value: "AGENT", label: "Agent" },
                { value: "ADMIN", label: "Admin" },
              ]}
              defaultValue="AGENT"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Agent"}
          </Button>
        </form>
      )}

      <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-gray-900">
                {agent.name}
                {agent.id === currentAgentId && (
                  <span className="ml-2 text-xs text-gray-400">(you)</span>
                )}
              </p>
              <p className="text-sm text-gray-500">{agent.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                agent.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {agent.role}
              </span>
              {agent.id !== currentAgentId && (
                <button
                  onClick={() => handleRemove(agent.id)}
                  disabled={removing === agent.id}
                  className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  {removing === agent.id ? "Removing..." : "Remove"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
