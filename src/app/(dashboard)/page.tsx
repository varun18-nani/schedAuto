"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, School, BookOpen, Activity, Calendar, TrendingUp, Clock, AlertTriangle, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"

const roomUtilization = [
  { room: "CS Lab 1",  util: 88 },
  { room: "CS Lab 2",  util: 72 },
  { room: "Room 301",  util: 95 },
  { room: "Room 302",  util: 61 },
  { room: "Room 201",  util: 78 },
  { room: "Mech Lab",  util: 55 },
]

const weeklyLoad = [
  { day: "Mon", periods: 42 },
  { day: "Tue", periods: 38 },
  { day: "Wed", periods: 45 },
  { day: "Thu", periods: 40 },
  { day: "Fri", periods: 35 },
  { day: "Sat", periods: 20 },
]

const deptDistribution = [
  { name: "Computer Science",  value: 35, color: "#6366f1" },
  { name: "Mechanical",        value: 25, color: "#8b5cf6" },
  { name: "Electronics",       value: 22, color: "#ec4899" },
  { name: "Civil",             value: 18, color: "#f97316" },
]

const stats = [
  { title: "Total Departments",      value: "12",   change: "+2 this year",     icon: BookOpen,  color: "text-indigo-600",  bg: "bg-indigo-50"  },
  { title: "Total Faculty",          value: "148",  change: "+12 new hires",    icon: Users,     color: "text-violet-600",  bg: "bg-violet-50"  },
  { title: "Total Students",         value: "4,231",change: "+18% enrollment",  icon: School,    color: "text-pink-600",    bg: "bg-pink-50"    },
  { title: "Active Timetables",      value: "24",   change: "All conflict-free",icon: Calendar,  color: "text-emerald-600", bg: "bg-emerald-50" },
]

const recentActivities = [
  { action: "Timetable Generated",  detail: "Computer Science · Sem 4 · Sec A",  time: "2h ago",  type: "success" },
  { action: "Faculty Leave Approved",detail: "Dr. Sarah Jenkins (Physics)",        time: "5h ago",  type: "info"    },
  { action: "Conflict Detected",    detail: "Room 301 double-booked Thursday",     time: "8h ago",  type: "warning" },
  { action: "New Department Added", detail: "Artificial Intelligence",             time: "1d ago",  type: "success" },
  { action: "Exam Timetable Draft", detail: "All 4th Sem departments",             time: "2d ago",  type: "info"    },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here's your institution's overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ai-generate" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Sparkles className="w-4 h-4" />
            Generate Timetable
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.title}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Weekly Period Load */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Weekly Period Distribution</CardTitle>
            <CardDescription>Total periods scheduled across all departments per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyLoad}>
                <defs>
                  <linearGradient id="colorPeriods" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Area type="monotone" dataKey="periods" stroke="#6366f1" strokeWidth={2} fill="url(#colorPeriods)" dot={{ fill: "#6366f1", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Pie */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Department Distribution</CardTitle>
            <CardDescription>Classes by department this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={deptDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {deptDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {deptDistribution.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-slate-600 truncate">{d.name}</span>
                    <span className="ml-auto text-xs font-semibold text-slate-800">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Room Utilization */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Room Utilization</CardTitle>
            <CardDescription>Average room usage percentage this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={roomUtilization} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="room" type="category" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(val) => [`${val}%`, "Utilization"]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="util" radius={[0, 4, 4, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent Activities</CardTitle>
              <CardDescription>Latest changes across the platform</CardDescription>
            </div>
            <Link href="/reports" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    activity.type === "success" ? "bg-emerald-500" :
                    activity.type === "warning" ? "bg-amber-500" : "bg-indigo-400"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800">{activity.action}</p>
                    <p className="text-xs text-slate-500 truncate">{activity.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Add Department", href: "/departments",  icon: BookOpen,  color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700" },
              { label: "Add Faculty",    href: "/faculty",      icon: Users,     color: "bg-violet-50 hover:bg-violet-100 text-violet-700" },
              { label: "AI Generate",   href: "/ai-generate",  icon: Sparkles,  color: "bg-pink-50 hover:bg-pink-100 text-pink-700"       },
              { label: "View Reports",  href: "/reports",      icon: Activity,  color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-2.5 p-3 rounded-xl transition-colors font-medium text-sm ${action.color}`}
              >
                <action.icon className="w-4 h-4 shrink-0" />
                {action.label}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
