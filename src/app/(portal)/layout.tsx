import Link from "next/link";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/portal" className="text-xl font-bold text-gray-900">
            ItsManaged
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/portal/kb"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Help Center
            </Link>
            <Link
              href="/portal/tickets/new"
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Submit a Request
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500 sm:px-6">
          Powered by ItsManaged
        </div>
      </footer>
    </div>
  );
}
