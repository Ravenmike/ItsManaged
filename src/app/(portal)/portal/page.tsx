import Link from "next/link";
import { KbSearch } from "@/components/kb/kb-search";

export default function PortalHome() {
  return (
    <div>
      {/* Hero section with gradient */}
      <div className="bg-gradient-to-b from-brand-900 to-brand-800 pb-20 pt-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            How can we help?
          </h1>
          <p className="mt-4 text-lg text-brand-200">
            Search our knowledge base or submit a support request.
          </p>
          <div className="mt-8">
            <KbSearch />
          </div>
        </div>
      </div>

      {/* Cards section overlapping hero */}
      <div className="mx-auto -mt-10 max-w-3xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/portal/kb"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-3 inline-flex rounded-lg bg-brand-100 p-2.5">
              <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600">
              Knowledge Base
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Browse articles, guides, and FAQs to find answers fast.
            </p>
          </Link>

          <Link
            href="/portal/tickets/new"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-3 inline-flex rounded-lg bg-brand-100 p-2.5">
              <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600">
              Submit a Request
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Can&apos;t find what you need? Our team is here to help.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
