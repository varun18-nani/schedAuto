import { TimetableBuilder } from "@/components/timetable/timetable-builder"

export default function TimetablePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Timetable Builder</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Drag subjects from the palette into the grid. AI-powered conflict detection is active.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Computer Science</option>
            <option>Mechanical Engineering</option>
            <option>Electronics</option>
          </select>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Semester 4</option>
            <option>Semester 2</option>
            <option>Semester 6</option>
          </select>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Section A</option>
            <option>Section B</option>
            <option>Section C</option>
          </select>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <TimetableBuilder />
      </div>
    </div>
  )
}
