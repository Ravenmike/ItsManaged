import { requireAuth } from "@/lib/auth-guard";

export default async function DashboardHome() {
  const session = await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome back, {session.user.name}. Here&apos;s your support overview.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Open Tickets", value: "—" },
          { label: "Awaiting Response", value: "—" },
          { label: "Resolved Today", value: "—" },
          { label: "KB Articles", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
