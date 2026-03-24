import Link from "next/link";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <header className="bg-brand-900 shadow-lg">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/portal" className="text-xl font-bold text-white">
            ItsManaged
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/portal/kb"
              className="text-sm font-medium text-brand-200 transition-colors hover:text-white"
            >
              Help Center
            </Link>
            <Link
              href="/portal/tickets/new"
              className="rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
            >
              Submit a Request
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-400 sm:px-6">
          Powered by <span className="font-medium text-gray-600">ItsManaged</span>
        </div>
      </footer>
    </div>
  );
}
