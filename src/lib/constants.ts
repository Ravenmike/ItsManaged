export const TICKET_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING_ON_CUSTOMER: "Waiting on Customer",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const TICKET_PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
};

export const TICKET_CATEGORIES = [
  "General",
  "Account & Billing",
  "Getting Started",
  "Race Day",
  "Pace Calculator",
  "Bug Report",
  "Feature Request",
] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
