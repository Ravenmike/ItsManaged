import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/tickets/status-badge";
import { CustomerReplyForm } from "@/components/tickets/customer-reply-form";

export default async function PublicTicketPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const ticket = await db.ticket.findUnique({
    where: { lookupToken: token },
    include: {
      messages: {
        where: { isInternalNote: false },
        include: { attachments: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) notFound();

  const isClosed = ticket.status === "CLOSED";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
          <p className="mt-1 text-sm text-white/50">
            Submitted on{" "}
            {ticket.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <StatusBadge status={ticket.status} variant="dark" />
      </div>

      <div className="mt-8 space-y-4">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl border p-4 ${
              message.senderType === "USER"
                ? "border-white/12 bg-white/6"
                : message.senderType === "AGENT"
                  ? "border-violet/30 bg-violet/10"
                  : "border-white/8 bg-white/4"
            }`}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white">
                {message.senderType === "USER"
                  ? ticket.submitterName
                  : message.senderType === "AGENT"
                    ? "Support Team"
                    : "System"}
              </span>
              <span className="text-white/50">
                {message.createdAt.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-white/75">
              {message.body}
            </p>
            {message.attachments.length > 0 && (
              <div className="mt-3 space-y-1">
                {message.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-violet-light hover:underline"
                  >
                    {att.fileName}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isClosed && (
        <div className="mt-8">
          <CustomerReplyForm lookupToken={token} variant="dark" />
        </div>
      )}
    </div>
  );
}
