import { requireAuth } from "@/lib/auth-guard";
import {
  getTicketVolumeByDay,
  getAvgFirstResponseTime,
  getResolutionRate,
  formatDuration,
} from "@/lib/reports";
import { KpiCard } from "@/components/reports/kpi-card";
import { TicketVolumeChart } from "@/components/reports/ticket-volume-chart";

export default async function ReportsPage() {
  const session = await requireAuth();
  const wid = session.user.workspaceId;

  const [volume, avgResponse, resolution] = await Promise.all([
    getTicketVolumeByDay(wid, 30),
    getAvgFirstResponseTime(wid, 30),
    getResolutionRate(wid, 30),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      <p className="mt-1 text-gray-600">Last 30 days overview.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total Tickets"
          value={resolution.total}
          subtext="Last 30 days"
        />
        <KpiCard
          label="Avg First Response"
          value={formatDuration(avgResponse)}
          subtext="Time to first agent reply"
        />
        <KpiCard
          label="Resolution Rate"
          value={`${resolution.rate}%`}
          subtext={`${resolution.resolved} of ${resolution.total} resolved`}
        />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Ticket Volume
        </h2>
        <TicketVolumeChart data={volume} />
      </div>
    </div>
  );
}
