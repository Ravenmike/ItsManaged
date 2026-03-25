import Link from "next/link";
import { KbSearch } from "@/components/kb/kb-search";

export default function PortalHome() {
  return (
    <div>
      {/* Hero section */}
      <div className="relative overflow-hidden pb-24 pt-20">
        {/* Radial gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(108,92,231,0.25)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold-light">
            Support Center
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-lg text-white/65">
            Search our knowledge base or submit a support request.
          </p>
          <div className="mt-8">
            <KbSearch />
          </div>
        </div>
      </div>

      {/* Cards section overlapping hero */}
      <div className="mx-auto -mt-12 max-w-3xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/portal/kb"
            className="group rounded-2xl border border-white/12 bg-white/6 p-6 transition-all hover:-translate-y-1 hover:border-violet/50"
          >
            <div className="mb-3 inline-flex rounded-xl bg-violet/15 p-2.5">
              <svg
                className="h-5 w-5 text-violet-light"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white group-hover:text-violet-light">
              Knowledge Base
            </h2>
            <p className="mt-2 text-sm text-white/65">
              Browse articles, guides, and FAQs to find answers fast.
            </p>
          </Link>

          <Link
            href="/portal/tickets/new"
            className="group rounded-2xl border border-white/12 bg-white/6 p-6 transition-all hover:-translate-y-1 hover:border-violet/50"
          >
            <div className="mb-3 inline-flex rounded-xl bg-violet/15 p-2.5">
              <svg
                className="h-5 w-5 text-violet-light"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white group-hover:text-violet-light">
              Submit a Request
            </h2>
            <p className="mt-2 text-sm text-white/65">
              Can&apos;t find what you need? Our team is here to help.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
