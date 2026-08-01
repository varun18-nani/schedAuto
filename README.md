# SchedAI — AI-Powered College Timetable Generator

> A production-ready SaaS platform for generating conflict-free college timetables using AI and modern web technologies.

---

## 🚀 Features

- **AI Timetable Generation** — Multi-algorithm scheduling engine (CSP, Graph Coloring, Simulated Annealing)
- **Drag-and-Drop Timetable Builder** — Interactive Excel-like grid with real-time conflict detection
- **Real-time Conflict Detection** — Faculty overlap and room clash warnings
- **Undo/Redo** — Full state history for manual edits
- **Analytics Dashboard** — Charts for room utilization, faculty workload, department distribution
- **College Setup Wizard** — Multi-step onboarding for institutions
- **Multi-Role Access** — Super Admin, College Admin, HOD, Faculty, Student
- **Export** — PDF, Excel, CSV support (coming in Phase 5)
- **Dark Sidebar UI** — Premium enterprise-grade SaaS design

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React, TypeScript |
| Styling | TailwindCSS v4, shadcn/ui, Framer Motion |
| Charts | Recharts |
| Drag-and-Drop | @dnd-kit/core |
| Forms | React Hook Form + Zod |
| ORM | Prisma + PostgreSQL |
| Auth | NextAuth.js (Google OAuth + Email) |
| State | useReducer + TanStack Query |

---

## 📦 Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # All dashboard routes
│   │   ├── page.tsx          # Analytics dashboard
│   │   ├── timetables/       # Manual timetable builder
│   │   ├── ai-generate/      # AI generation pipeline
│   │   └── setup/            # College setup wizard
│   └── api/auth/             # NextAuth API routes
├── components/
│   ├── layout/               # Sidebar, Header
│   ├── timetable/            # Grid, Cells, Builder
│   ├── wizard/               # Setup wizard forms
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities and data helpers
├── types/                    # TypeScript types
└── prisma/                   # Database schema
```

---

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, etc.

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📋 Development Phases

- [x] **Phase 1** — Foundation (Next.js, shadcn/ui, Prisma, NextAuth)
- [x] **Phase 2** — Dashboard + College Setup Wizard
- [x] **Phase 3** — Manual Timetable Builder + AI Generator UI
- [ ] **Phase 4** — AI Scheduling Engine (Backend + DB)
- [ ] **Phase 5** — Export, Polish, Notifications, Subscriptions

---

## 📄 License

MIT © SchedAI
