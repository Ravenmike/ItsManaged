import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/tickets/status-badge";
import { PriorityBadge } from "@/components/tickets/priority-badge";
import { TicketConversation } from "@/components/tickets/ticket-conversation";
import { TicketReplyForm } from "@/components/tickets/ticket-reply-form";
import { TicketControls } from "@/components/tickets/ticket-controls";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await params;

  const ticket = await db.ticket.findUnique({
    where: { id },
    include: {
      messages: {
        include: {
          attachments: true,
          agent: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      assignedAgent: { select: { id: true, name: true } },
    },
  });

  if (!ticket || ticket.workspaceId !== session.user.workspaceId) {
    notFound();
  }

  const agents = await db.agent.findMany({
    where: { workspaceId: session.user.workspaceId },
    select: { id: true, name: true },
  });

  const cannedReplies = await db.cannedReply.findMany({
    where: { workspaceId: session.user.workspaceId },
    select: { id: true, title: true, body: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3">
          <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        <p className="mt-1 text-sm text-gray-500">
          From {ticket.submitterName} ({ticket.submitterEmail}) &middot;{" "}
          {ticket.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="mt-6">
          <TicketConversation
            messages={ticket.messages}
            submitterName={ticket.submitterName}
          />
        </div>

        <div className="mt-6">
          <TicketReplyForm
            ticketId={ticket.id}
            cannedReplies={cannedReplies}
          />
        </div>
      </div>

      <div className="hidden w-72 shrink-0 lg:block">
        <TicketControls
          ticketId={ticket.id}
          currentStatus={ticket.status}
          currentPriority={ticket.priority}
          currentAgentId={ticket.assignedAgentId}
          currentCategory={ticket.category}
          submitterName={ticket.submitterName}
          submitterEmail={ticket.submitterEmail}
          createdAt={ticket.createdAt}
          resolvedAt={ticket.resolvedAt}
          agents={agents}
        />
      </div>
    </div>
  );
}
