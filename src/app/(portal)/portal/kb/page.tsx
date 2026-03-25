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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gold-light">
        Knowledge Base
      </p>
      <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
        Help Center
      </h1>
      <p className="mt-2 text-center text-white/65">
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
              className="group rounded-2xl border border-white/12 bg-white/6 p-5 transition-all hover:-translate-y-1 hover:border-violet/50"
            >
              <h2 className="font-semibold text-white group-hover:text-violet-light">
                {cat.name}
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {cat._count.articles}{" "}
                {cat._count.articles === 1 ? "article" : "articles"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center text-white/50">
          No articles published yet. Check back soon!
        </div>
      )}
    </div>
  );
}
