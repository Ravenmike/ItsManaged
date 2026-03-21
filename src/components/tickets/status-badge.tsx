import { Badge } from "@/components/ui/badge";
import { TICKET_STATUS_LABELS } from "@/lib/constants";
import type { TicketStatus } from "@/generated/prisma/client";

const statusVariants: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  OPEN: "info",
  IN_PROGRESS: "warning",
  WAITING_ON_CUSTOMER: "default",
  RESOLVED: "success",
  CLOSED: "default",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge variant={statusVariants[status] ?? "default"}>
      {TICKET_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
