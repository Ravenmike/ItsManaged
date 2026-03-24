import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArticleFeedback } from "@/components/kb/article-feedback";
import { stripHtml, truncate } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string; articleSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, articleSlug } = await params;

  const workspace = await db.workspace.findFirst();
  if (!workspace) return { title: "Help Center" };

  const category = await db.kbCategory.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });
  if (!category) return { title: "Help Center" };

  const article = await db.kbArticle.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: articleSlug,
      categoryId: category.id,
      status: "PUBLISHED",
    },
  });

  if (!article) return { title: "Article Not Found" };

  const description = truncate(stripHtml(article.bodyHtml), 160);

  return {
    title: `${article.title} | ${workspace.name} Help Center`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      modifiedTime: article.updatedAt.toISOString(),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; articleSlug: string }>;
}) {
  const { slug, articleSlug } = await params;

  const workspace = await db.workspace.findFirst();
  if (!workspace) return null;

  const category = await db.kbCategory.findUnique({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug } },
  });
  if (!category) notFound();

  const article = await db.kbArticle.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: articleSlug,
      categoryId: category.id,
      status: "PUBLISHED",
    },
  });

  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={`/portal/kb/${slug}`}
        className="text-sm text-blue-600 hover:underline"
      >
        &larr; {category.name}
      </Link>

      <article className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated{" "}
          {article.updatedAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div
          className="prose prose-sm mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
        />
      </article>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <ArticleFeedback
          articleId={article.id}
          helpfulCount={article.helpfulCount}
          notHelpfulCount={article.notHelpfulCount}
        />
      </div>
    </div>
  );
}
