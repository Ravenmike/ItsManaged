"use server";

import { db } from "@/lib/db";
import { requireAdmin, requireAuth } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

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

export async function addAgent(formData: FormData) {
  const session = await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string);
  const role = (formData.get("role") as string) || "AGENT";

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const existing = await db.agent.findUnique({ where: { email } });
  if (existing) {
    return { error: "An agent with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.agent.create({
    data: {
      workspaceId: session.user.workspaceId,
      name,
      email,
      passwordHash,
      role: role === "ADMIN" ? "ADMIN" : "AGENT",
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function removeAgent(agentId: string) {
  const session = await requireAdmin();

  if (agentId === session.user.id) {
    return { error: "You cannot remove yourself" };
  }

  const agent = await db.agent.findUnique({ where: { id: agentId } });
  if (!agent || agent.workspaceId !== session.user.workspaceId) {
    return { error: "Agent not found" };
  }

  // Unassign any tickets assigned to this agent
  await db.ticket.updateMany({
    where: { assignedAgentId: agentId },
    data: { assignedAgentId: null },
  });

  await db.agent.delete({ where: { id: agentId } });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateAgentProfile(formData: FormData) {
  const session = await requireAuth();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const newPassword = (formData.get("newPassword") as string);

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  // Check email uniqueness if changed
  const existing = await db.agent.findUnique({ where: { email } });
  if (existing && existing.id !== session.user.id) {
    return { error: "This email is already in use by another agent" };
  }

  const updateData: { name: string; email: string; passwordHash?: string } = { name, email };

  if (newPassword) {
    if (newPassword.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }
    updateData.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  await db.agent.update({
    where: { id: session.user.id },
    data: updateData,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
