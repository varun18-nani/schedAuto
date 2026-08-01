import { Subject, TimetableConfig, TimetableSlot } from "@/types/timetable"

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const DEFAULT_PERIODS: TimetableConfig["periods"] = [
  { index: 0, label: "Period 1", startTime: "09:00", endTime: "09:50", isBreak: false },
  { index: 1, label: "Period 2", startTime: "09:50", endTime: "10:40", isBreak: false },
  { index: 2, label: "Period 3", startTime: "10:40", endTime: "11:30", isBreak: false },
  { index: 3, label: "Break",    startTime: "11:30", endTime: "11:45", isBreak: true  },
  { index: 4, label: "Period 4", startTime: "11:45", endTime: "12:35", isBreak: false },
  { index: 5, label: "Period 5", startTime: "12:35", endTime: "13:25", isBreak: false },
  { index: 6, label: "Lunch",    startTime: "13:25", endTime: "14:10", isBreak: true  },
  { index: 7, label: "Period 6", startTime: "14:10", endTime: "15:00", isBreak: false },
  { index: 8, label: "Period 7", startTime: "15:00", endTime: "15:50", isBreak: false },
  { index: 9, label: "Period 8", startTime: "15:50", endTime: "16:40", isBreak: false },
]

export const SAMPLE_SUBJECTS: Subject[] = [
  { id: "s1", name: "Data Structures",        code: "CS201", color: "#6366f1", type: "theory",  facultyId: "f1", facultyName: "Dr. A. Kumar",   credits: 4 },
  { id: "s2", name: "Operating Systems",      code: "CS301", color: "#8b5cf6", type: "theory",  facultyId: "f2", facultyName: "Dr. P. Sharma",  credits: 4 },
  { id: "s3", name: "DBMS",                   code: "CS302", color: "#ec4899", type: "theory",  facultyId: "f3", facultyName: "Dr. R. Singh",   credits: 3 },
  { id: "s4", name: "Computer Networks",      code: "CS401", color: "#f97316", type: "theory",  facultyId: "f4", facultyName: "Dr. S. Patel",   credits: 3 },
  { id: "s5", name: "DS Lab",                 code: "CS201L",color: "#0ea5e9", type: "lab",     facultyId: "f1", facultyName: "Dr. A. Kumar",   credits: 2 },
  { id: "s6", name: "DBMS Lab",               code: "CS302L",color: "#10b981", type: "lab",     facultyId: "f3", facultyName: "Dr. R. Singh",   credits: 2 },
  { id: "s7", name: "Software Engineering",   code: "CS501", color: "#f59e0b", type: "theory",  facultyId: "f5", facultyName: "Prof. M. Gupta", credits: 3 },
  { id: "s8", name: "Mathematics III",        code: "MA301", color: "#14b8a6", type: "theory",  facultyId: "f6", facultyName: "Dr. N. Mehta",   credits: 4 },
]

export function generateInitialSlots(days = 6, periods = DEFAULT_PERIODS): TimetableSlot[] {
  const slots: TimetableSlot[] = []
  for (let d = 0; d < days; d++) {
    for (let p = 0; p < periods.length; p++) {
      slots.push({
        id: `slot-${d}-${p}`,
        day: d,
        period: p,
        isBreak: periods[p].isBreak,
        breakLabel: periods[p].isBreak ? periods[p].label : undefined,
        subject: undefined,
        isLocked: false,
      })
    }
  }
  return slots
}

export function seedSampleTimetable(slots: TimetableSlot[]): TimetableSlot[] {
  const assignments: { day: number; period: number; subjectId: string }[] = [
    { day: 0, period: 0, subjectId: "s1" }, { day: 0, period: 1, subjectId: "s2" },
    { day: 0, period: 4, subjectId: "s3" }, { day: 0, period: 5, subjectId: "s4" },
    { day: 0, period: 7, subjectId: "s5" }, { day: 0, period: 8, subjectId: "s5" },
    { day: 1, period: 0, subjectId: "s8" }, { day: 1, period: 1, subjectId: "s7" },
    { day: 1, period: 2, subjectId: "s1" }, { day: 1, period: 4, subjectId: "s2" },
    { day: 1, period: 7, subjectId: "s6" }, { day: 1, period: 8, subjectId: "s6" },
    { day: 2, period: 0, subjectId: "s3" }, { day: 2, period: 1, subjectId: "s4" },
    { day: 2, period: 4, subjectId: "s8" }, { day: 2, period: 5, subjectId: "s7" },
    { day: 2, period: 7, subjectId: "s1" }, { day: 2, period: 9, subjectId: "s2" },
    { day: 3, period: 0, subjectId: "s4" }, { day: 3, period: 2, subjectId: "s3" },
    { day: 3, period: 4, subjectId: "s1" }, { day: 3, period: 5, subjectId: "s8" },
    { day: 3, period: 7, subjectId: "s5" }, { day: 3, period: 8, subjectId: "s5" },
    { day: 4, period: 0, subjectId: "s2" }, { day: 4, period: 1, subjectId: "s7" },
    { day: 4, period: 4, subjectId: "s3" }, { day: 4, period: 5, subjectId: "s4" },
    { day: 4, period: 7, subjectId: "s6" }, { day: 4, period: 8, subjectId: "s6" },
    { day: 5, period: 0, subjectId: "s8" }, { day: 5, period: 1, subjectId: "s3" },
    { day: 5, period: 2, subjectId: "s7" }, { day: 5, period: 4, subjectId: "s4" },
  ]

  const subjectMap = Object.fromEntries(SAMPLE_SUBJECTS.map((s) => [s.id, s]))
  return slots.map((slot) => {
    const assignment = assignments.find((a) => a.day === slot.day && a.period === slot.period)
    if (assignment && !slot.isBreak) {
      return { ...slot, subject: subjectMap[assignment.subjectId] }
    }
    return slot
  })
}
