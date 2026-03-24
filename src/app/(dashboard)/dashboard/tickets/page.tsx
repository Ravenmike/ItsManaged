import Link from "next/link";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/tickets/status-badge";
import { PriorityBadge } from "@/components/tickets/priority-badge";
import { TicketFilters } from "@/components/tickets/ticket-filters";
import { TicketStatus, TicketPriority } from "@/generated/prisma/client";

interface SearchParams {
  status?: string;
  priority?: string;
  category?: string;
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireAuth();
  const params = await searchParams;

  const where: Record<string, unknown> = {
    workspaceId: session.user.workspaceId,
  };

  if (params.status) {
    where.status = params.status as TicketStatus;
  }
  if (params.priority) {
    where.priority = params.priority as TicketPriority;
  }
  if (params.category) {
    where.category = params.category;
  }

  const tickets = await db.ticket.findMany({
    where,
    include: {
      assignedAgent: { select: { name: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
        <span className="text-sm text-gray-500">{tickets.length} tickets</span>
      </div>

      <TicketFilters
        currentStatus={params.status}
        currentPriority={params.priority}
        currentCategory={params.category}
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tickets found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Priority
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 md:table-cell">
                  Category
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 lg:table-cell">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="font-medium text-gray-900 hover:text-brand-600"
                    >
                      {ticket.subject}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {ticket.submitterName} &middot; {ticket._count.messages}{" "}
                      {ticket._count.messages === 1 ? "message" : "messages"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-gray-500 md:table-cell">
                    {ticket.category || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-gray-500 lg:table-cell">
                    {ticket.assignedAgent?.name || "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {ticket.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
