// Timetable data types for SchedAI

export type Subject = {
  id: string
  name: string
  code: string
  color: string
  type: "theory" | "lab" | "tutorial"
  facultyId: string
  facultyName: string
  credits: number
}

export type TimetableSlot = {
  id: string
  day: number        // 0=Mon, 1=Tue...
  period: number     // 0-indexed
  subject?: Subject
  isBreak?: boolean
  breakLabel?: string
  isLocked?: boolean
}

export type TimetableConfig = {
  days: string[]
  periods: PeriodConfig[]
  department: string
  semester: string
  section: string
}

export type PeriodConfig = {
  index: number
  label: string
  startTime: string
  endTime: string
  isBreak: boolean
}

export type ConflictInfo = {
  slotId: string
  type: "faculty_overlap" | "room_overlap" | "student_overlap"
  message: string
}
