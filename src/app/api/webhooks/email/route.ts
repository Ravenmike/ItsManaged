import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Resend inbound email webhook handler
// Payload format: { type: "email.received", data: { from, subject, to, text, html, ... } }
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Resend wraps inbound email data in a `data` object
    const emailData = payload.data || payload;

    const senderEmail = emailData.from;
    const subject = emailData.subject;
    const bodyText = emailData.text;
    const bodyHtml = emailData.html;

    if (!senderEmail || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract sender name and email
    const emailMatch = senderEmail.match(/<(.+?)>/) || [null, senderEmail];
    const cleanEmail = (emailMatch[1] || senderEmail).toLowerCase().trim();
    const senderName = senderEmail.replace(/<.+?>/, "").trim() || cleanEmail;

    // Check for ticket token in subject line: [#TOKEN]
    const tokenMatch = subject.match(/\[#([a-z0-9]+)\]/i);

    // Use plain text body, fall back to stripping HTML, fall back to subject
    const body = bodyText
      || (bodyHtml ? bodyHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "")
      || subject;

    const workspace = await db.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: "No workspace configured" }, { status: 500 });
    }

    // Try to match to existing ticket
    let ticket = null;

    // First, try matching by token in subject
    if (tokenMatch) {
      ticket = await db.ticket.findUnique({
        where: { lookupToken: tokenMatch[1] },
      });
    }

    // If no token match, look for an open ticket from this sender
    if (!ticket) {
      ticket = await db.ticket.findFirst({
        where: {
          workspaceId: workspace.id,
          submitterEmail: cleanEmail,
          status: { in: ["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER"] },
        },
        orderBy: { updatedAt: "desc" },
      });
    }

    if (ticket) {
      // Append as reply to existing ticket
      await db.message.create({
        data: {
          ticketId: ticket.id,
          body,
          senderType: "USER",
        },
      });

      // Reopen if waiting on customer
      if (ticket.status === "WAITING_ON_CUSTOMER" || ticket.status === "RESOLVED") {
        await db.ticket.update({
          where: { id: ticket.id },
          data: { status: "OPEN" },
        });
      }
    } else {
      // Create new ticket from email
      const cleanSubject = subject
        .replace(/^(Re|Fwd|Fw):\s*/gi, "")
        .replace(/\[#[a-z0-9]+\]/gi, "")
        .trim() || "Email inquiry";

      await db.ticket.create({
        data: {
          workspaceId: workspace.id,
          subject: cleanSubject,
          submitterName: senderName,
          submitterEmail: cleanEmail,
          messages: {
            create: {
              body,
              senderType: "USER",
            },
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inbound email webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
