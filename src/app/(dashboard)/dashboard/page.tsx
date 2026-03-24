import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";

export default async function DashboardHome() {
  const session = await requireAuth();
  const wid = session.user.workspaceId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [openCount, waitingCount, resolvedToday, kbCount] = await Promise.all([
    db.ticket.count({
      where: { workspaceId: wid, status: "OPEN" },
    }),
    db.ticket.count({
      where: { workspaceId: wid, status: "WAITING_ON_CUSTOMER" },
    }),
    db.ticket.count({
      where: { workspaceId: wid, resolvedAt: { gte: today } },
    }),
    db.kbArticle.count({
      where: { workspaceId: wid, status: "PUBLISHED" },
    }),
  ]);

  const stats = [
    { label: "Open Tickets", value: openCount, color: "text-brand-600", bg: "bg-brand-50" },
    { label: "Awaiting Response", value: waitingCount, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Resolved Today", value: resolvedToday, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "KB Articles", value: kbCount, color: "text-sky-600", bg: "bg-sky-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-500">
        Welcome back, {session.user.name}. Here&apos;s your support overview.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
