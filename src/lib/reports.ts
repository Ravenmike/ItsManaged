import { db } from "@/lib/db";

interface DailyVolume {
  day: string;
  count: number;
}

export async function getTicketVolumeByDay(
  workspaceId: string,
  days: number = 30,
): Promise<DailyVolume[]> {
  const rows: { day: Date; count: bigint }[] = await db.$queryRaw`
    SELECT date_trunc('day', created_at) AS day, COUNT(*)::bigint AS count
    FROM tickets
    WHERE workspace_id = ${workspaceId}
      AND created_at >= NOW() - CAST(${days + ' days'} AS INTERVAL)
    GROUP BY day
    ORDER BY day
  `;

  return rows.map((r) => ({
    day: r.day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: Number(r.count),
  }));
}

export async function getAvgFirstResponseTime(
  workspaceId: string,
  days: number = 30,
): Promise<number | null> {
  const result: { avg_seconds: number | null }[] = await db.$queryRaw`
    SELECT AVG(first_response.response_time) AS avg_seconds FROM (
      SELECT EXTRACT(EPOCH FROM MIN(m.created_at) - t.created_at) AS response_time
      FROM tickets t
      JOIN messages m ON m.ticket_id = t.id AND m.sender_type = 'AGENT'
      WHERE t.workspace_id = ${workspaceId}
        AND t.created_at >= NOW() - CAST(${days + ' days'} AS INTERVAL)
      GROUP BY t.id, t.created_at
    ) first_response
  `;

  return result[0]?.avg_seconds ?? null;
}

export async function getResolutionRate(
  workspaceId: string,
  days: number = 30,
): Promise<{ total: number; resolved: number; rate: number }> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const [total, resolved] = await Promise.all([
    db.ticket.count({
      where: { workspaceId, createdAt: { gte: cutoff } },
    }),
    db.ticket.count({
      where: { workspaceId, createdAt: { gte: cutoff }, resolvedAt: { not: null } },
    }),
  ]);

  return {
    total,
    resolved,
    rate: total > 0 ? Math.round((resolved / total) * 100) : 0,
  };
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "N/A";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}
