import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { ArticleEditor } from "@/components/kb/article-editor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const { id } = await params;

  const article = await db.kbArticle.findUnique({ where: { id } });
  if (!article || article.workspaceId !== session.user.workspaceId) notFound();

  const categories = await db.kbCategory.findMany({
    where: { workspaceId: session.user.workspaceId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
      <div className="mt-6">
        <ArticleEditor
          article={article}
          categories={categories}
        />
      </div>
    </div>
  );
}
