"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Tickets", href: "/dashboard/tickets" },
  { name: "Knowledge Base", href: "/dashboard/kb" },
  { name: "Canned Replies", href: "/dashboard/canned-replies" },
  { name: "Reports", href: "/dashboard/reports" },
  { name: "Settings", href: "/dashboard/settings" },
];

interface SidebarProps {
  agentName: string;
  agentRole: string;
}

export function Sidebar({ agentName, agentRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-brand-900">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="text-lg font-bold text-white">
          ItsManaged
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-brand-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="text-sm font-medium text-white">{agentName}</p>
        <p className="text-xs text-brand-200 capitalize">
          {agentRole.toLowerCase()}
        </p>
      </div>
    </aside>
  );
}
