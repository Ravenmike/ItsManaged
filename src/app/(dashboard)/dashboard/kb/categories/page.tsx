import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { CategoryManager } from "@/components/kb/category-manager";

export default async function CategoriesPage() {
  const session = await requireAuth();

  const categories = await db.kbCategory.findMany({
    where: { workspaceId: session.user.workspaceId },
    include: { _count: { select: { articles: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">KB Categories</h1>
      <p className="mt-1 text-gray-600">
        Organize your knowledge base articles into categories.
      </p>
      <div className="mt-6">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
