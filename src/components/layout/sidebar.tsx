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
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/dashboard" className="text-lg font-bold text-gray-900">
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
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-sm font-medium text-gray-900">{agentName}</p>
        <p className="text-xs text-gray-500 capitalize">
          {agentRole.toLowerCase()}
        </p>
      </div>
    </aside>
  );
}
