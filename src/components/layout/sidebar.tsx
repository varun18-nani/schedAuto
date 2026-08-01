"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, Users, School, Settings, BookOpen, Clock, FileText, Sparkles, GraduationCap, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard",    href: "/",             icon: LayoutDashboard },
  { name: "Timetables",  href: "/timetables",   icon: Calendar },
  { name: "AI Generate", href: "/ai-generate",  icon: Sparkles },
  { name: "Departments", href: "/departments",  icon: BookOpen },
  { name: "Faculty",     href: "/faculty",      icon: Users },
  { name: "Students",    href: "/students",     icon: GraduationCap },
  { name: "Rooms & Labs",href: "/rooms",        icon: FlaskConical },
  { name: "Colleges",    href: "/colleges",     icon: School },
  { name: "Reports",     href: "/reports",      icon: FileText },
  { name: "Settings",    href: "/settings",     icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-slate-950 text-slate-300 shrink-0">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">SchedAI</span>
            <span className="block text-[10px] text-slate-500 -mt-0.5">Smart Timetabling</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <nav className="flex-1 space-y-0.5 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom User */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-900 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Admin User</p>
            <p className="text-[10px] text-slate-500 truncate">College Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
