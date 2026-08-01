"use client"

import React, { useState, useCallback, useReducer } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { TimetableSlot, Subject, TimetableConfig } from "@/types/timetable"
import { TimetableCell, SubjectPaletteCard } from "./timetable-cell"
import { SAMPLE_SUBJECTS, DEFAULT_PERIODS, DAYS, generateInitialSlots, seedSampleTimetable } from "@/lib/timetable-data"
import { AlertTriangle, Undo2, Redo2, Download, Save, Sparkles, ChevronDown } from "lucide-react"

// ─── State Management ─────────────────────────────────────────────────────────
type State = { past: TimetableSlot[][], present: TimetableSlot[], future: TimetableSlot[][] }

type Action =
  | { type: "UPDATE"; slots: TimetableSlot[] }
  | { type: "UNDO" }
  | { type: "REDO" }

function timetableReducer(state: State, action: Action): State {
  switch (action.type) {
    case "UPDATE":
      return { past: [...state.past, state.present], present: action.slots, future: [] }
    case "UNDO":
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] }
    case "REDO":
      if (state.future.length === 0) return state
      const next = state.future[0]
      return { past: [...state.past, state.present], present: next, future: state.future.slice(1) }
    default:
      return state
  }
}

const initial = seedSampleTimetable(generateInitialSlots(6, DEFAULT_PERIODS))

// ─── Main Timetable Builder ───────────────────────────────────────────────────
export function TimetableBuilder() {
  const [state, dispatch] = useReducer(timetableReducer, {
    past: [], present: initial, future: []
  })
  const [activeDragSubject, setActiveDragSubject] = useState<Subject | null>(null)
  const [activeDragSlot, setActiveDragSlot] = useState<TimetableSlot | null>(null)
  const [conflictSlots, setConflictSlots] = useState<Set<string>>(new Set())
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved")

  const config: TimetableConfig = {
    days: DAYS.slice(0, 6),
    periods: DEFAULT_PERIODS,
    department: "Computer Science",
    semester: "Semester 4",
    section: "Section A",
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current
    if (data?.type === "palette") setActiveDragSubject(data.subject)
    else if (data?.type === "slot") setActiveDragSlot(data.slot)
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragSubject(null)
    setActiveDragSlot(null)

    const { active, over } = event
    if (!over) return

    const sourceData = active.data.current
    const targetSlotId = over.id as string

    const newSlots = state.present.map((slot) => {
      if (slot.id === targetSlotId && !slot.isBreak && !slot.isLocked) {
        if (sourceData?.type === "palette") {
          return { ...slot, subject: sourceData.subject }
        }
        if (sourceData?.type === "slot") {
          return { ...slot, subject: sourceData.slot.subject }
        }
      }
      // Clear the source slot if moving from slot
      if (sourceData?.type === "slot" && slot.id === sourceData.slot.id && slot.id !== targetSlotId) {
        return { ...slot, subject: undefined }
      }
      return slot
    })

    dispatch({ type: "UPDATE", slots: newSlots })
    setSaveStatus("unsaved")
    detectConflicts(newSlots)
  }, [state.present])

  const detectConflicts = (slots: TimetableSlot[]) => {
    const conflicts = new Set<string>()
    // Detect faculty overlap: same faculty, same period, different days
    for (let period = 0; period < DEFAULT_PERIODS.length; period++) {
      const periodSlots = slots.filter((s) => s.period === period && s.subject)
      const facultyMap = new Map<string, string[]>()
      periodSlots.forEach((s) => {
        if (s.subject) {
          const ids = facultyMap.get(s.subject.facultyId) || []
          ids.push(s.id)
          facultyMap.set(s.subject.facultyId, ids)
        }
      })
      facultyMap.forEach((ids) => {
        if (ids.length > 1) ids.forEach((id) => conflicts.add(id))
      })
    }
    setConflictSlots(conflicts)
  }

  const clearSlot = (slotId: string) => {
    const newSlots = state.present.map((s) => s.id === slotId ? { ...s, subject: undefined } : s)
    dispatch({ type: "UPDATE", slots: newSlots })
    setSaveStatus("unsaved")
  }

  const toggleLock = (slotId: string) => {
    const newSlots = state.present.map((s) => s.id === slotId ? { ...s, isLocked: !s.isLocked } : s)
    dispatch({ type: "UPDATE", slots: newSlots })
  }

  // Load generated timetable from localStorage if available
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("schedai_latest_timetable")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            dispatch({ type: "UPDATE", slots: parsed })
            detectConflicts(parsed)
          }
        } catch (e) {
          console.error("Failed to parse stored timetable", e)
        }
      }
    }
  }, [])

  const autoFixConflicts = async () => {
    try {
      setSaveStatus("saving")
      const res = await fetch("/api/resolve-conflicts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: state.present }),
      })
      const data = await res.json()
      if (data.repairedSlots) {
        dispatch({ type: "UPDATE", slots: data.repairedSlots })
        detectConflicts(data.repairedSlots)
        setSaveStatus("saved")
      }
    } catch (e) {
      console.error("Auto fix error", e)
      setSaveStatus("unsaved")
    }
  }

  const handleSave = () => {
    setSaveStatus("saving")
    if (typeof window !== "undefined") {
      localStorage.setItem("schedai_latest_timetable", JSON.stringify(state.present))
    }
    setTimeout(() => setSaveStatus("saved"), 800)
  }

  const filledCount = state.present.filter((s) => !s.isBreak && s.subject).length
  const totalSlots = state.present.filter((s) => !s.isBreak).length
  const fillPercent = Math.round((filledCount / totalSlots) * 100)

  return (
    <div className="flex h-full gap-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── Subject Palette ── */}
      <div className="w-56 shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-3 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Palette</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Drag subjects into the grid</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SAMPLE_SUBJECTS.map((subject) => (
            <SubjectPaletteCard key={subject.id} subject={subject} />
          ))}
        </div>
        {/* Conflict Indicator */}
        {conflictSlots.size > 0 && (
          <div className="m-2 p-2 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[11px] font-semibold text-red-700">Conflicts ({conflictSlots.size})</span>
            </div>
            <button
              onClick={autoFixConflicts}
              className="w-full py-1 text-[11px] font-semibold bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Auto-Fix Conflicts (AI)
            </button>
          </div>
        )}
        {/* Fill meter */}
        <div className="p-3 border-t border-slate-200">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Fill rate</span>
            <span className="font-semibold text-slate-700">{fillPercent}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${fillPercent}%`, backgroundColor: fillPercent === 100 ? "#10b981" : "#6366f1" }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{filledCount}/{totalSlots} periods filled</p>
        </div>
      </div>

      {/* ── Grid Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold text-slate-800">{config.department}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{config.semester}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{config.section}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={state.past.length === 0}
              className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 text-slate-600"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch({ type: "REDO" })}
              disabled={state.future.length === 0}
              className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 text-slate-600"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button
              onClick={autoFixConflicts}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Fix & Swap
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-slate-100 text-slate-600 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={handleSave}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                saveStatus === "saved" && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                saveStatus === "unsaved" && "bg-slate-800 text-white hover:bg-slate-700",
                saveStatus === "saving" && "bg-slate-200 text-slate-500 cursor-wait"
              )}
            >
              <Save className="w-3.5 h-3.5" />
              {saveStatus === "saved" ? "Saved" : saveStatus === "saving" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="flex-1 overflow-auto p-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="min-w-max">
              {/* Header Row */}
              <div
                className="grid border-b border-slate-200 bg-slate-50 sticky top-0 z-20"
                style={{ gridTemplateColumns: `140px repeat(${config.days.length}, minmax(120px, 1fr))` }}
              >
                <div className="p-2 border-r border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Period / Day</span>
                </div>
                {config.days.map((day) => (
                  <div key={day} className="p-2 text-center border-r border-slate-200 last:border-r-0">
                    <span className="text-xs font-semibold text-slate-700">{day.slice(0, 3).toUpperCase()}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{day.slice(3)}</span>
                  </div>
                ))}
              </div>

              {/* Period Rows */}
              {config.periods.map((period) => (
                <div
                  key={period.index}
                  className={cn(
                    "grid border-b border-slate-200 last:border-b-0",
                    period.isBreak && "bg-slate-50"
                  )}
                  style={{ gridTemplateColumns: `140px repeat(${config.days.length}, minmax(120px, 1fr))` }}
                >
                  {/* Period Label */}
                  <div className={cn(
                    "p-2 border-r border-slate-200 flex flex-col justify-center",
                    period.isBreak && "bg-slate-100"
                  )}>
                    <span className={cn("text-xs font-semibold", period.isBreak ? "text-slate-400" : "text-slate-700")}>
                      {period.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{period.startTime} – {period.endTime}</span>
                  </div>

                  {/* Day Cells */}
                  {config.days.map((_, dayIndex) => {
                    const slot = state.present.find((s) => s.day === dayIndex && s.period === period.index)
                    if (!slot) return <div key={dayIndex} />
                    return (
                      <TimetableCell
                        key={slot.id}
                        slot={slot}
                        isConflict={conflictSlots.has(slot.id)}
                        onClear={clearSlot}
                        onLock={toggleLock}
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay dropAnimation={null}>
              {activeDragSubject && (
                <div
                  className="px-3 py-2 rounded-lg shadow-xl text-xs font-bold text-white pointer-events-none"
                  style={{ backgroundColor: activeDragSubject.color }}
                >
                  {activeDragSubject.name}
                </div>
              )}
              {activeDragSlot?.subject && (
                <div
                  className="px-3 py-2 rounded-lg shadow-xl text-xs font-bold text-white pointer-events-none"
                  style={{ backgroundColor: activeDragSlot.subject.color }}
                >
                  {activeDragSlot.subject.name}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}
