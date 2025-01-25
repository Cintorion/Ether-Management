'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Heart,
  MessageSquare,
  FolderKanban,
  Settings
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard
    },
    {
      href: "/dashboard/prompts",
      label: "Prompts",
      icon: MessageSquare
    },
    {
      href: "/dashboard/stored-prompts",
      label: "Stored Prompts",
      icon: Heart
    },
    {
      href: "/dashboard/tasks",
      label: "Tasks",
      icon: FolderKanban
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings
    }
  ]

  return (
    <nav className="grid items-start gap-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
        >
          <Button
            variant={pathname === route.href ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Button>
        </Link>
      ))}
    </nav>
  )
} 