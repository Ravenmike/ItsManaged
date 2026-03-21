"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { sendTicketConfirmation, sendTicketStatusUpdate } from "@/lib/email";
import { TICKET_STATUS_LABELS } from "@/lib/constants";
import { TicketStatus, TicketPriority } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

interface AttachmentInput {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export async function createTicket(formData: FormData) {
  const submitterName = formData.get("name") as string;
  const submitterEmail = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const attachmentsJson = formData.get("attachments") as string;

  if (!submitterName || !submitterEmail || !subject || !description) {
    return { error: "Please fill in all required fields." };
  }

  const attachments: AttachmentInput[] = attachmentsJson
    ? JSON.parse(attachmentsJson)
    : [];

  // Use the first workspace for now (single-tenant)
  const workspace = await db.workspace.findFirst();
  if (!workspace) {
    return { error: "System not configured. Please contact support." };
  }

  const ticket = await db.ticket.create({
    data: {
      workspaceId: workspace.id,
      subject,
      category: category || null,
      submitterName,
      submitterEmail,
      messages: {
        create: {
          body: description,
          senderType: "USER",
          attachments: {
            create: attachments.map((a) => ({
              fileName: a.fileName,
              fileUrl: a.fileUrl,
              fileSize: a.fileSize,
              mimeType: a.mimeType,
            })),
          },
        },
      },
    },
  });

  try {
    await sendTicketConfirmation({
      submitterName,
      submitterEmail,
      subject,
      lookupToken: ticket.lookupToken,
    });
  } catch {
    // Don't fail ticket creation if email fails
    console.error("Failed to send ticket confirmation email");
  }

  return { success: true, lookupToken: ticket.lookupToken };
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus) {
  const session = await requireAuth();

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.workspaceId !== session.user.workspaceId) {
    return { error: "Ticket not found" };
  }

  const updateData: Record<string, unknown> = { status };
  if (status === "RESOLVED") {
    updateData.resolvedAt = new Date();
  }
  if (status !== "RESOLVED" && status !== "CLOSED" && ticket.resolvedAt) {
    updateData.resolvedAt = null;
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: updateData,
  });

  await db.message.create({
    data: {
      ticketId,
      body: `Status changed to ${TICKET_STATUS_LABELS[status]}`,
      senderType: "SYSTEM",
    },
  });

  try {
    await sendTicketStatusUpdate(
      {
        submitterName: ticket.submitterName,
        submitterEmail: ticket.submitterEmail,
        subject: ticket.subject,
        lookupToken: ticket.lookupToken,
      },
      TICKET_STATUS_LABELS[status],
    );
  } catch {
    console.error("Failed to send status update email");
  }

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  return { success: true };
}

export async function updateTicketPriority(ticketId: string, priority: TicketPriority) {
  const session = await requireAuth();

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.workspaceId !== session.user.workspaceId) {
    return { error: "Ticket not found" };
  }

  await db.ticket.update({
    where: { id: ticketId },
    data: { priority },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  return { success: true };
}

export async function assignTicket(ticketId: string, agentId: string | null) {
  const session = await requireAuth();

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket || ticket.workspaceId !== session.user.workspaceId) {
    return { error: "Ticket not found" };
  }

  const agent = agentId
    ? await db.agent.findUnique({ where: { id: agentId } })
    : null;

  await db.ticket.update({
    where: { id: ticketId },
    data: { assignedAgentId: agentId },
  });

  await db.message.create({
    data: {
      ticketId,
      body: agent
        ? `Ticket assigned to ${agent.name}`
        : "Ticket unassigned",
      senderType: "SYSTEM",
    },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard/tickets");
  return { success: true };
}
