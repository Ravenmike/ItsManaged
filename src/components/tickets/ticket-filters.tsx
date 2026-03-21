"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TICKET_CATEGORIES } from "@/lib/constants";

interface TicketFiltersProps {
  currentStatus?: string;
  currentPriority?: string;
  currentCategory?: string;
}

export function TicketFilters({
  currentStatus,
  currentPriority,
  currentCategory,
}: TicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/tickets?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/dashboard/tickets");
  }

  const hasFilters = currentStatus || currentPriority || currentCategory;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <select
        value={currentStatus || ""}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="">All Statuses</option>
        {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={currentPriority || ""}
        onChange={(e) => updateFilter("priority", e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="">All Priorities</option>
        {Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={currentCategory || ""}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      >
        <option value="">All Categories</option>
        {TICKET_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
