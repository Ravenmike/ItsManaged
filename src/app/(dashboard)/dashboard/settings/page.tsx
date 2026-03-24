import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const session = await requireAdmin();

  const workspace = await db.workspace.findUnique({
    where: { id: session.user.workspaceId },
  });

  if (!workspace) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-gray-600">
        Manage your workspace configuration.
      </p>

      <div className="mt-6 max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <SettingsForm
          workspace={{
            name: workspace.name,
            supportEmail: workspace.supportEmail,
            brandColor: workspace.brandColor,
          }}
        />
      </div>
    </div>
  );
}
