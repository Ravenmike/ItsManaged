import Link from "next/link";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-navy">
      <header className="sticky top-0 z-50 border-b border-white/12 bg-navy/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/portal"
            className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet to-gold-light bg-clip-text text-transparent"
          >
            EarnYourEars
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/portal/kb"
              className="text-sm font-medium text-white/65 transition-colors hover:text-white"
            >
              Help Center
            </Link>
            <Link
              href="/portal/tickets/new"
              className="rounded-full bg-gradient-to-r from-violet to-violet-light px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-88"
            >
              Submit a Request
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/12 bg-navy py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-white/40 sm:px-6">
          Powered by{" "}
          <span className="font-medium text-white/65">ItsManaged</span>
        </div>
      </footer>
    </div>
  );
}
