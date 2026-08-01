import { Subject, TimetableSlot, PeriodConfig } from "@/types/timetable"

export type EngineOption = "balanced" | "minimize_gaps" | "morning_heavy" | "lab_priority"

export type GenerationRequest = {
  department: string
  semester: string
  sections: string[]
  days: number
  periods: PeriodConfig[]
  subjects: Subject[]
  strategy?: EngineOption
  maxIterations?: number
  lockExisting?: boolean
  existingSlots?: TimetableSlot[]
}

export type GenerationResult = {
  success: boolean
  slots: TimetableSlot[]
  score: number // 0 - 100 optimization score
  executionTimeMs: number
  iterationsCompleted: number
  conflictsCount: number
  metrics: {
    facultyWorkloadBalance: number // %
    roomEfficiency: number // %
    gapMinimization: number // %
    hardConstraintsSatisfied: number // %
  }
  logs: string[]
}

export type ConflictReport = {
  slotId: string
  day: number
  period: number
  type: "faculty_overlap" | "room_overlap" | "max_daily_exceeded" | "lab_split"
  severity: "critical" | "warning"
  description: string
  involvedFaculty?: string
  involvedSubject?: string
  suggestedFixSlotId?: string
}
