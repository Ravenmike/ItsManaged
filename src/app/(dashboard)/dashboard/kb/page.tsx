import Link from "next/link";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function KbManagementPage() {
  const session = await requireAuth();

  const [articles, categories] = await Promise.all([
    db.kbArticle.findMany({
      where: { workspaceId: session.user.workspaceId },
      include: { category: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    db.kbCategory.findMany({
      where: { workspaceId: session.user.workspaceId },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/kb/categories">
            <Button variant="secondary">Manage Categories</Button>
          </Link>
          <Link href="/dashboard/kb/new">
            <Button>New Article</Button>
          </Link>
        </div>
      </div>

      <p className="mt-1 text-gray-600">
        {articles.length} articles across {categories.length} categories
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No articles yet. Create your first article to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Feedback
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/kb/${article.id}`}
                      className="font-medium text-gray-900 hover:text-brand-600"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {article.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        article.status === "PUBLISHED" ? "success" : "default"
                      }
                    >
                      {article.status === "PUBLISHED" ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {article.helpfulCount + article.notHelpfulCount > 0
                      ? `${Math.round((article.helpfulCount / (article.helpfulCount + article.notHelpfulCount)) * 100)}% helpful`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {article.updatedAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
