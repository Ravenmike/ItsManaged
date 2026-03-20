import Link from "next/link";

export default function PortalHome() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        How can we help?
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Search our knowledge base or submit a support request.
      </p>

      <div className="mt-8">
        <input
          type="search"
          placeholder="Search for help articles..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Link
          href="/portal/kb"
          className="rounded-lg border border-gray-200 p-6 text-left transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Knowledge Base
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Browse articles, guides, and FAQs to find answers fast.
          </p>
        </Link>

        <Link
          href="/portal/tickets/new"
          className="rounded-lg border border-gray-200 p-6 text-left transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Submit a Request
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Can&apos;t find what you need? Our team is here to help.
          </p>
        </Link>
      </div>
    </div>
  );
}
