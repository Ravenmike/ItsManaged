"use client";

import { useRouter } from "next/navigation";
import { updateTicketStatus, updateTicketPriority, assignTicket } from "@/actions/tickets";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import type { TicketStatus, TicketPriority } from "@/generated/prisma/client";

interface TicketControlsProps {
  ticketId: string;
  currentStatus: TicketStatus;
  currentPriority: TicketPriority;
  currentAgentId: string | null;
  currentCategory: string | null;
  submitterName: string;
  submitterEmail: string;
  createdAt: Date;
  resolvedAt: Date | null;
  agents: { id: string; name: string }[];
}

export function TicketControls({
  ticketId,
  currentStatus,
  currentPriority,
  currentAgentId,
  currentCategory,
  submitterName,
  submitterEmail,
  createdAt,
  resolvedAt,
  agents,
}: TicketControlsProps) {
  const router = useRouter();

  async function handleStatusChange(status: string) {
    await updateTicketStatus(ticketId, status as TicketStatus);
    router.refresh();
  }

  async function handlePriorityChange(priority: string) {
    await updateTicketPriority(ticketId, priority as TicketPriority);
    router.refresh();
  }

  async function handleAssignChange(agentId: string) {
    await assignTicket(ticketId, agentId || null);
    router.refresh();
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <label className="block text-xs font-medium uppercase text-gray-500">
          Status
        </label>
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase text-gray-500">
          Priority
        </label>
        <select
          value={currentPriority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          {Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase text-gray-500">
          Assigned To
        </label>
        <select
          value={currentAgentId || ""}
          onChange={(e) => handleAssignChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">Unassigned</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-3 text-sm">
        <div>
          <span className="block text-xs font-medium uppercase text-gray-500">
            Category
          </span>
          <span className="text-gray-900">{currentCategory || "None"}</span>
        </div>
        <div>
          <span className="block text-xs font-medium uppercase text-gray-500">
            Submitter
          </span>
          <span className="text-gray-900">{submitterName}</span>
          <br />
          <a
            href={`mailto:${submitterEmail}`}
            className="text-blue-600 hover:underline"
          >
            {submitterEmail}
          </a>
        </div>
        <div>
          <span className="block text-xs font-medium uppercase text-gray-500">
            Created
          </span>
          <span className="text-gray-900">
            {createdAt.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        {resolvedAt && (
          <div>
            <span className="block text-xs font-medium uppercase text-gray-500">
              Resolved
            </span>
            <span className="text-gray-900">
              {resolvedAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
