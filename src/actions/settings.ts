"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function updateWorkspaceSettings(formData: FormData) {
  const session = await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const supportEmail = (formData.get("supportEmail") as string)?.trim();
  const brandColor = (formData.get("brandColor") as string)?.trim();

  if (!name) {
    return { error: "Workspace name is required" };
  }

  if (!supportEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
    return { error: "A valid support email is required" };
  }

  if (brandColor && !/^#[0-9a-fA-F]{6}$/.test(brandColor)) {
    return { error: "Brand color must be a valid hex color (e.g., #2563eb)" };
  }

  await db.workspace.update({
    where: { id: session.user.workspaceId },
    data: {
      name,
      supportEmail,
      brandColor: brandColor || "#2563eb",
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
