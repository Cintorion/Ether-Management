"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Clock,
  Users,
  Settings,
  Plus,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Tasks", href: "/tasks", icon: FileText },
  { name: "Time log", href: "/time-log", icon: Clock },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-orange-500" />
          <span className="text-xl font-semibold">Promage</span>
        </div>
        <button className="w-full flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 font-medium">
          <Plus className="h-5 w-5" />
          Create new project
        </button>
      </div>
      <nav className="flex-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 mb-1",
                pathname === item.href && "bg-gray-100 font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}