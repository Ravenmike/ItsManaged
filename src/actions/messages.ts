"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { sendAgentReplyNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function addAgentReply(ticketId: string, body: string, isInternalNote: boolean = false) {
  const session = await requireAuth();

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.workspaceId !== session.user.workspaceId) {
    return { error: "Ticket not found" };
  }

  if (!body.trim()) {
    return { error: "Reply cannot be empty" };
  }

  await db.message.create({
    data: {
      ticketId,
      body: body.trim(),
      senderType: "AGENT",
      agentId: session.user.id,
      isInternalNote,
    },
  });

  // Update ticket status to IN_PROGRESS if it was OPEN
  if (ticket.status === "OPEN" && !isInternalNote) {
    await db.ticket.update({
      where: { id: ticketId },
      data: { status: "WAITING_ON_CUSTOMER" },
    });
  }

  // Send email notification for public replies only
  if (!isInternalNote) {
    const workspace = await db.workspace.findUnique({
      where: { id: ticket.workspaceId },
    });

    try {
      await sendAgentReplyNotification(
        {
          submitterName: ticket.submitterName,
          submitterEmail: ticket.submitterEmail,
          subject: ticket.subject,
          lookupToken: ticket.lookupToken,
          workspaceName: workspace?.name ?? "Support",
          supportEmail: workspace?.supportEmail ?? "support@earnyourears.app",
        },
        body.trim(),
      );
    } catch {
      console.error("Failed to send reply notification email");
    }
  }

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  return { success: true };
}

export async function addCustomerReply(lookupToken: string, body: string) {
  const ticket = await db.ticket.findUnique({
    where: { lookupToken },
  });

  if (!ticket) {
    return { error: "Ticket not found" };
  }

  if (!body.trim()) {
    return { error: "Reply cannot be empty" };
  }

  await db.message.create({
    data: {
      ticketId: ticket.id,
      body: body.trim(),
      senderType: "USER",
    },
  });

  // Reopen ticket if it was waiting on customer or resolved
  if (ticket.status === "WAITING_ON_CUSTOMER" || ticket.status === "RESOLVED") {
    await db.ticket.update({
      where: { id: ticket.id },
      data: { status: "OPEN" },
    });
  }

  revalidatePath(`/portal/tickets/${lookupToken}`);
  return { success: true };
}
