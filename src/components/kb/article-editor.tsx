"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle, publishArticle, unpublishArticle, deleteArticle } from "@/actions/kb";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/kb/tiptap-editor";

interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  bodyHtml: string;
  categoryId: string | null;
  status: string;
}

interface ArticleEditorProps {
  article?: Article;
  categories: Category[];
}

export function ArticleEditor({ article, categories }: ArticleEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [bodyHtml, setBodyHtml] = useState(article?.bodyHtml || "");
  const [categoryId, setCategoryId] = useState(article?.categoryId || "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = !!article;
  const isPublished = article?.status === "PUBLISHED";

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  async function handleSave() {
    setError(null);
    setSaving(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("bodyHtml", bodyHtml);
    formData.set("categoryId", categoryId);

    const result = isEdit
      ? await updateArticle(article.id, formData)
      : await createArticle(formData);

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (!isEdit && "articleId" in result) {
      router.push(`/dashboard/kb/${result.articleId}`);
    } else {
      router.refresh();
    }
  }

  async function handlePublishToggle() {
    if (!article) return;
    const result = isPublished
      ? await unpublishArticle(article.id)
      : await publishArticle(article.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!article || !confirm("Delete this article?")) return;
    await deleteArticle(article.id);
    router.push("/dashboard/kb");
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Article title"
          required
        />
        <Input
          id="slug"
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="article-slug"
          required
        />
      </div>

      <Select
        id="categoryId"
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={categoryOptions}
        placeholder="Select a category..."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <TipTapEditor content={bodyHtml} onChange={setBodyHtml} />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
        </Button>
        {isEdit && (
          <>
            <Button
              variant={isPublished ? "secondary" : "primary"}
              onClick={handlePublishToggle}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
