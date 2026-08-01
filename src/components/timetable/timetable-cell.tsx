"use client"

import React from "react"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { Subject, TimetableSlot } from "@/types/timetable"
import { Lock, GripVertical, FlaskConical } from "lucide-react"

// ─── Draggable Subject Card (from palette) ───────────────────────────────────
export function SubjectPaletteCard({ subject }: { subject: Subject }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${subject.id}`,
    data: { type: "palette", subject },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg cursor-grab border border-transparent",
        "hover:border-slate-200 hover:shadow-sm transition-all select-none",
        isDragging && "opacity-40 cursor-grabbing"
      )}
      style={{ borderLeftColor: subject.color, borderLeftWidth: 3 }}
    >
      <GripVertical className="w-3 h-3 text-slate-400 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-800 truncate">{subject.name}</p>
        <p className="text-[10px] text-slate-500">{subject.code} · {subject.facultyName.split(" ").slice(-1)[0]}</p>
      </div>
      {subject.type === "lab" && (
        <FlaskConical className="w-3 h-3 text-slate-400 shrink-0 ml-auto" />
      )}
    </div>
  )
}

// ─── Draggable Slot Cell ──────────────────────────────────────────────────────
function DraggableSlotContent({ slot }: { slot: TimetableSlot }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `slot-${slot.id}`,
    data: { type: "slot", slot },
    disabled: !slot.subject || slot.isLocked,
  })

  if (!slot.subject) return null

  const subject = slot.subject
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "absolute inset-1 rounded-md p-1.5 flex flex-col gap-0.5 cursor-grab",
        "shadow-sm transition-all group select-none overflow-hidden",
        isDragging && "opacity-0",
        slot.isLocked && "cursor-default"
      )}
      style={{ backgroundColor: `${subject.color}18`, borderLeft: `3px solid ${subject.color}` }}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-[11px] font-bold leading-tight" style={{ color: subject.color }}>
          {subject.name}
        </span>
        {slot.isLocked && <Lock className="w-2.5 h-2.5 shrink-0 mt-0.5" style={{ color: subject.color }} />}
      </div>
      <span className="text-[10px] text-slate-500 truncate">{subject.facultyName.split(" ").slice(-1)}</span>
      {subject.type === "lab" && (
        <span
          className="text-[8px] font-semibold px-1 py-0.5 rounded self-start"
          style={{ backgroundColor: `${subject.color}25`, color: subject.color }}
        >
          LAB
        </span>
      )}
    </div>
  )
}

// ─── Droppable Cell ───────────────────────────────────────────────────────────
interface TimetableCellProps {
  slot: TimetableSlot
  isConflict?: boolean
  onClear?: (slotId: string) => void
  onLock?: (slotId: string) => void
}

export function TimetableCell({ slot, isConflict, onClear, onLock }: TimetableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: slot.id,
    data: { type: "cell", slot },
    disabled: slot.isBreak || slot.isLocked,
  })

  if (slot.isBreak) {
    return (
      <div className="relative bg-slate-100 flex items-center justify-center border border-slate-200 border-t-0 border-l-0">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest rotate-0">
          {slot.breakLabel}
        </span>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative border border-slate-200 border-t-0 border-l-0 transition-colors min-h-[72px] group/cell",
        isOver && "bg-indigo-50 ring-2 ring-inset ring-indigo-400",
        isConflict && "bg-red-50 ring-2 ring-inset ring-red-400",
        !slot.subject && !isOver && "hover:bg-slate-50",
        slot.subject && "bg-white"
      )}
    >
      {slot.subject ? (
        <>
          <DraggableSlotContent slot={slot} />
          {/* Context actions on hover */}
          <div className="absolute top-1 right-1 hidden group-hover/cell:flex gap-0.5 z-10">
            <button
              onClick={() => onLock?.(slot.id)}
              className="p-0.5 rounded bg-white shadow-sm hover:bg-slate-100 text-slate-400"
              title={slot.isLocked ? "Unlock" : "Lock"}
            >
              <Lock className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => onClear?.(slot.id)}
              className="p-0.5 rounded bg-white shadow-sm hover:bg-red-50 text-slate-400 hover:text-red-500"
              title="Clear"
            >
              <span className="text-[10px] font-bold leading-none">✕</span>
            </button>
          </div>
        </>
      ) : (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity",
          isOver && "opacity-100"
        )}>
          <span className="text-xs text-indigo-400 font-medium">Drop here</span>
        </div>
      )}
    </div>
  )
}
