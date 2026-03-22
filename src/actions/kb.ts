"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

// ─── Categories ──────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const session = await requireAuth();
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (!name) return { error: "Name is required" };

  const existing = await db.kbCategory.findUnique({
    where: { workspaceId_slug: { workspaceId: session.user.workspaceId, slug } },
  });
  if (existing) return { error: "A category with this slug already exists" };

  await db.kbCategory.create({
    data: {
      workspaceId: session.user.workspaceId,
      name,
      slug,
    },
  });

  revalidatePath("/dashboard/kb");
  revalidatePath("/dashboard/kb/categories");
  revalidatePath("/portal/kb");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await requireAuth();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) return { error: "Name and slug are required" };

  const category = await db.kbCategory.findUnique({ where: { id } });
  if (!category || category.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  await db.kbCategory.update({ where: { id }, data: { name, slug } });

  revalidatePath("/dashboard/kb");
  revalidatePath("/dashboard/kb/categories");
  revalidatePath("/portal/kb");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const session = await requireAuth();

  const category = await db.kbCategory.findUnique({ where: { id } });
  if (!category || category.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  // Check for articles in this category
  const articleCount = await db.kbArticle.count({ where: { categoryId: id } });
  if (articleCount > 0) {
    return { error: `Cannot delete: ${articleCount} articles are in this category. Move them first.` };
  }

  await db.kbCategory.delete({ where: { id } });

  revalidatePath("/dashboard/kb");
  revalidatePath("/dashboard/kb/categories");
  revalidatePath("/portal/kb");
  return { success: true };
}

// ─── Articles ────────────────────────────────────────────────────────────────

export async function createArticle(formData: FormData) {
  const session = await requireAuth();
  const title = formData.get("title") as string;
  const bodyHtml = formData.get("bodyHtml") as string;
  const categoryId = formData.get("categoryId") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (!title || !bodyHtml) return { error: "Title and content are required" };

  const existing = await db.kbArticle.findUnique({
    where: { workspaceId_slug: { workspaceId: session.user.workspaceId, slug } },
  });
  if (existing) return { error: "An article with this slug already exists" };

  const article = await db.kbArticle.create({
    data: {
      workspaceId: session.user.workspaceId,
      title,
      slug,
      bodyHtml,
      categoryId: categoryId || null,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/kb");
  return { success: true, articleId: article.id };
}

export async function updateArticle(id: string, formData: FormData) {
  const session = await requireAuth();
  const title = formData.get("title") as string;
  const bodyHtml = formData.get("bodyHtml") as string;
  const categoryId = formData.get("categoryId") as string;
  const slug = formData.get("slug") as string;

  if (!title || !bodyHtml) return { error: "Title and content are required" };

  const article = await db.kbArticle.findUnique({ where: { id } });
  if (!article || article.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  await db.kbArticle.update({
    where: { id },
    data: {
      title,
      slug: slug || article.slug,
      bodyHtml,
      categoryId: categoryId || null,
    },
  });

  revalidatePath("/dashboard/kb");
  revalidatePath(`/dashboard/kb/${id}`);
  revalidatePath("/portal/kb");
  return { success: true };
}

export async function publishArticle(id: string) {
  const session = await requireAuth();

  const article = await db.kbArticle.findUnique({ where: { id } });
  if (!article || article.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  await db.kbArticle.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });

  revalidatePath("/dashboard/kb");
  revalidatePath("/portal/kb");
  return { success: true };
}

export async function unpublishArticle(id: string) {
  const session = await requireAuth();

  const article = await db.kbArticle.findUnique({ where: { id } });
  if (!article || article.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  await db.kbArticle.update({
    where: { id },
    data: { status: "DRAFT" },
  });

  revalidatePath("/dashboard/kb");
  revalidatePath("/portal/kb");
  return { success: true };
}

export async function deleteArticle(id: string) {
  const session = await requireAuth();

  const article = await db.kbArticle.findUnique({ where: { id } });
  if (!article || article.workspaceId !== session.user.workspaceId) {
    return { error: "Not found" };
  }

  await db.kbArticle.delete({ where: { id } });

  revalidatePath("/dashboard/kb");
  revalidatePath("/portal/kb");
  return { success: true };
}

// ─── Feedback ────────────────────────────────────────────────────────────────

export async function submitArticleFeedback(articleId: string, helpful: boolean) {
  const article = await db.kbArticle.findUnique({ where: { id: articleId } });
  if (!article) return { error: "Not found" };

  await db.kbArticle.update({
    where: { id: articleId },
    data: helpful
      ? { helpfulCount: { increment: 1 } }
      : { notHelpfulCount: { increment: 1 } },
  });

  return { success: true };
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchArticles(query: string, workspaceId?: string) {
  if (!query.trim()) return [];

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { bodyHtml: { contains: query, mode: "insensitive" } },
    ],
  };

  if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  const articles = await db.kbArticle.findMany({
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      category: { select: { slug: true, name: true } },
    },
    take: 5,
    orderBy: { updatedAt: "desc" },
  });

  return articles;
}
