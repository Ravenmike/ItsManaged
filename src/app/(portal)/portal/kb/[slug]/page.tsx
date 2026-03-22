import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const workspace = await db.workspace.findFirst();
  if (!workspace) return null;

  const category = await db.kbCategory.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });

  if (!category) notFound();

  const articles = await db.kbArticle.findMany({
    where: {
      workspaceId: workspace.id,
      categoryId: category.id,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/portal/kb"
        className="text-sm text-blue-600 hover:underline"
      >
        &larr; Back to Help Center
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        {category.name}
      </h1>

      {articles.length === 0 ? (
        <p className="mt-6 text-gray-500">No articles in this category yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/portal/kb/${slug}/${article.slug}`}
              className="block rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
            >
              <h2 className="font-medium text-gray-900">{article.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Updated{" "}
                {article.updatedAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
