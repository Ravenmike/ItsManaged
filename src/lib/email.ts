import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface TicketEmailData {
  submitterName: string;
  submitterEmail: string;
  subject: string;
  lookupToken: string;
  workspaceName?: string;
}

function getBaseUrl() {
  return process.env.NEXTAUTH_URL || "https://itsmanaged.app";
}

function getFromEmail() {
  return "EarnYourEars Support <support@earnyourears.app>";
}

export async function sendTicketConfirmation(ticket: TicketEmailData) {
  const trackingUrl = `${getBaseUrl()}/portal/tickets/${ticket.lookupToken}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: ticket.submitterEmail,
    replyTo: "support@earnyourears.app",
    subject: `We received your request: ${ticket.subject} [#${ticket.lookupToken}]`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">We got your message</h2>
        <p>Hi ${ticket.submitterName},</p>
        <p>Thanks for reaching out. We&rsquo;ve received your support request:</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <strong>${ticket.subject}</strong>
        </div>
        <p>Our team will review your request and get back to you as soon as possible.</p>
        <p>
          <a href="${trackingUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">
            View Your Request
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          You can check the status of your request anytime at:<br/>
          <a href="${trackingUrl}" style="color: #2563eb;">${trackingUrl}</a>
        </p>
      </div>
    `,
  });
}

export async function sendAgentReplyNotification(ticket: TicketEmailData, replyBody: string) {
  const trackingUrl = `${getBaseUrl()}/portal/tickets/${ticket.lookupToken}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: ticket.submitterEmail,
    replyTo: "support@earnyourears.app",
    subject: `Re: ${ticket.subject} [#${ticket.lookupToken}]`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">New reply to your request</h2>
        <p>Hi ${ticket.submitterName},</p>
        <p>We&rsquo;ve replied to your support request:</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <strong>${ticket.subject}</strong>
        </div>
        <div style="border-left: 3px solid #2563eb; padding-left: 16px; margin: 16px 0; white-space: pre-wrap;">${replyBody}</div>
        <p>
          <a href="${trackingUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">
            View Full Conversation
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendTicketStatusUpdate(ticket: TicketEmailData, newStatus: string) {
  const trackingUrl = `${getBaseUrl()}/portal/tickets/${ticket.lookupToken}`;

  await resend.emails.send({
    from: getFromEmail(),
    to: ticket.submitterEmail,
    replyTo: "support@earnyourears.app",
    subject: `Status update: ${ticket.subject} [#${ticket.lookupToken}]`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">Your request has been updated</h2>
        <p>Hi ${ticket.submitterName},</p>
        <p>The status of your support request has been updated:</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <strong>${ticket.subject}</strong><br/>
          <span style="color: #2563eb; font-weight: 500;">Status: ${newStatus}</span>
        </div>
        <p>
          <a href="${trackingUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">
            View Your Request
          </a>
        </p>
      </div>
    `,
  });
}
