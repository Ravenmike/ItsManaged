import { Badge } from "@/components/ui/badge";
import { TICKET_PRIORITY_LABELS } from "@/lib/constants";
import type { TicketPriority } from "@/generated/prisma/client";

const priorityVariants: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  LOW: "default",
  NORMAL: "info",
  HIGH: "warning",
  URGENT: "danger",
};

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <Badge variant={priorityVariants[priority] ?? "default"}>
      {TICKET_PRIORITY_LABELS[priority] ?? priority}
    </Badge>
  );
}
