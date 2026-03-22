import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { ArticleEditor } from "@/components/kb/article-editor";

export default async function NewArticlePage() {
  const session = await requireAuth();

  const categories = await db.kbCategory.findMany({
    where: { workspaceId: session.user.workspaceId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
      <div className="mt-6">
        <ArticleEditor categories={categories} />
      </div>
    </div>
  );
}
