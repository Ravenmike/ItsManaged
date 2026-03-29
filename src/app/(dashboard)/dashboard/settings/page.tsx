import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/settings/settings-form";
import { AgentProfile } from "@/components/settings/agent-profile";
import { AgentManagement } from "@/components/settings/agent-management";

export default async function SettingsPage() {
  const session = await requireAdmin();

  const workspace = await db.workspace.findUnique({
    where: { id: session.user.workspaceId },
  });

  if (!workspace) return null;

  const currentAgent = await db.agent.findUnique({
    where: { id: session.user.id },
  });

  const agents = await db.agent.findMany({
    where: { workspaceId: session.user.workspaceId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-gray-600">
        Manage your workspace, profile, and team.
      </p>

      <div className="mt-6 max-w-2xl space-y-8">
        {/* Profile */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <AgentProfile
            name={currentAgent?.name ?? ""}
            email={currentAgent?.email ?? ""}
          />
        </div>

        {/* Workspace */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Workspace</h2>
          <SettingsForm
            workspace={{
              name: workspace.name,
              supportEmail: workspace.supportEmail,
              brandColor: workspace.brandColor,
            }}
          />
        </div>

        {/* Agents */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <AgentManagement
            agents={agents.map((a) => ({
              ...a,
              role: a.role as string,
              createdAt: a.createdAt.toISOString(),
            }))}
            currentAgentId={session.user.id}
          />
        </div>
      </div>
    </div>
  );
}
