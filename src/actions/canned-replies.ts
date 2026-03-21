"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createCannedReply(formData: FormData) {
  const session = await requireAuth();

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!title || !body) {
    return { error: "Title and body are required" };
  }

  await db.cannedReply.create({
    data: {
      workspaceId: session.user.workspaceId,
      title,
      body,
      createdByAgentId: session.user.id,
    },
  });

  revalidatePath("/dashboard/canned-replies");
  return { success: true };
}

export async function updateCannedReply(id: string, formData: FormData) {
  const session = await requireAuth();

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!title || !body) {
    return { error: "Title and body are required" };
  }

  const reply = await db.cannedReply.findUnique({ where: { id } });
  if (!reply || reply.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  await db.cannedReply.update({
    where: { id },
    data: { title, body },
  });

  revalidatePath("/dashboard/canned-replies");
  return { success: true };
}

export async function deleteCannedReply(id: string) {
  const session = await requireAuth();

  const reply = await db.cannedReply.findUnique({ where: { id } });
  if (!reply || reply.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  await db.cannedReply.delete({ where: { id } });

  revalidatePath("/dashboard/canned-replies");
  return { success: true };
}
