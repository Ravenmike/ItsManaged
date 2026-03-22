import Link from "next/link";
import { db } from "@/lib/db";
import { KbSearch } from "@/components/kb/kb-search";

export const dynamic = "force-dynamic";

export default async function KbLandingPage() {
  const workspace = await db.workspace.findFirst();
  if (!workspace) return null;

  const categories = await db.kbCategory.findMany({
    where: { workspaceId: workspace.id },
    include: {
      _count: {
        select: { articles: { where: { status: "PUBLISHED" } } },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Only show categories that have published articles
  const activeCategories = categories.filter((c) => c._count.articles > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
        Help Center
      </h1>
      <p className="mt-2 text-center text-gray-600">
        Find answers to common questions
      </p>

      <div className="mt-6">
        <KbSearch />
      </div>

      {activeCategories.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/portal/kb/${cat.slug}`}
              className="rounded-lg border border-gray-200 p-5 transition-shadow hover:shadow-md"
            >
              <h2 className="font-semibold text-gray-900">{cat.name}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {cat._count.articles} {cat._count.articles === 1 ? "article" : "articles"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center text-gray-500">
          No articles published yet. Check back soon!
        </div>
      )}
    </div>
  );
}
