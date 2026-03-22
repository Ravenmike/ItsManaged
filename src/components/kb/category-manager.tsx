"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, deleteCategory } from "@/actions/kb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { articles: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createCategory(formData);
    if (result.error) { setError(result.error); return; }
    setShowForm(false);
    router.refresh();
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateCategory(id, formData);
    if (result.error) { setError(result.error); return; }
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const result = await deleteCategory(id);
    if (result.error) { setError(result.error); return; }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>New Category</Button>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          <Input id="name" name="name" label="Category Name" placeholder="e.g., Getting Started" required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setError(null); }}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {categories.map((cat) =>
          editingId === cat.id ? (
            <form key={cat.id} onSubmit={(e) => handleUpdate(e, cat.id)} className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
              <Input id="name" name="name" label="Name" defaultValue={cat.name} required />
              <Input id="slug" name="slug" label="Slug" defaultValue={cat.slug} required />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit">Update</Button>
                <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setError(null); }}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div key={cat.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <div>
                <h3 className="font-medium text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500">
                  /{cat.slug} &middot; {cat._count.articles} {cat._count.articles === 1 ? "article" : "articles"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingId(cat.id)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}>Delete</Button>
              </div>
            </div>
          ),
        )}
        {categories.length === 0 && !showForm && (
          <p className="text-sm text-gray-500">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
