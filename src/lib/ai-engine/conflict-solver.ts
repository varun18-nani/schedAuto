import { TimetableSlot } from "@/types/timetable"
import { ConflictReport } from "./types"

export class ConflictSolver {
  /**
   * Analyze all slots and report conflicts.
   */
  public static analyzeConflicts(slots: TimetableSlot[]): ConflictReport[] {
    const reports: ConflictReport[] = []
    const facultyMap = new Map<string, TimetableSlot[]>()

    // Track faculty allocations per (day, period)
    for (const slot of slots) {
      if (!slot.subject || slot.isBreak) continue
      const key = `${slot.day}-${slot.period}-${slot.subject.facultyId}`

      if (!facultyMap.has(key)) {
        facultyMap.set(key, [])
      }
      facultyMap.get(key)!.push(slot)
    }

    // Detect overlaps
    facultyMap.forEach((overlappingSlots, key) => {
      if (overlappingSlots.length > 1) {
        const firstSlot = overlappingSlots[0]
        const facultyName = firstSlot.subject?.facultyName || "Faculty"

        overlappingSlots.forEach((slot) => {
          reports.push({
            slotId: slot.id,
            day: slot.day,
            period: slot.period,
            type: "faculty_overlap",
            severity: "critical",
            description: `${facultyName} is assigned to multiple classes simultaneously on ${this.getDayName(slot.day)} at Period ${slot.period + 1}.`,
            involvedFaculty: facultyName,
            involvedSubject: slot.subject?.name,
          })
        })
      }
    })

    return reports
  }

  /**
   * Auto-repair conflicts in a timetable by swapping conflicting slots with open valid slots.
   */
  public static autoFixConflicts(slots: TimetableSlot[]): {
    repairedSlots: TimetableSlot[]
    resolvedCount: number
    logs: string[]
  } {
    const logs: string[] = []
    const repairedSlots = slots.map((s) => ({ ...s }))
    let resolvedCount = 0

    const initialReports = this.analyzeConflicts(repairedSlots)
    logs.push(`Found ${initialReports.length} initial conflict(s) to auto-repair.`)

    if (initialReports.length === 0) {
      return { repairedSlots, resolvedCount: 0, logs: ["No conflicts detected! Timetable is clean."] }
    }

    const conflictingSlotIds = new Set(initialReports.map((r) => r.slotId))

    // Attempt to move conflicting slots to open valid slots
    for (const conflictId of Array.from(conflictingSlotIds)) {
      const targetSlot = repairedSlots.find((s) => s.id === conflictId)
      if (!targetSlot || !targetSlot.subject || targetSlot.isLocked) continue

      // Find an open slot without conflicts for this faculty
      const candidateSlot = repairedSlots.find(
        (candidate) =>
          !candidate.isBreak &&
          !candidate.subject &&
          !candidate.isLocked &&
          candidate.id !== targetSlot.id &&
          !this.hasFacultyConflict(candidate.day, candidate.period, targetSlot.subject!.facultyId, repairedSlots)
      )

      if (candidateSlot) {
        candidateSlot.subject = targetSlot.subject
        targetSlot.subject = undefined
        resolvedCount++
        logs.push(
          `Moved ${candidateSlot.subject.name} (${candidateSlot.subject.facultyName}) from ${this.getDayName(targetSlot.day)} P${targetSlot.period + 1} to ${this.getDayName(candidateSlot.day)} P${candidateSlot.period + 1}`
        )
      }
    }

    const remainingReports = this.analyzeConflicts(repairedSlots)
    logs.push(`Auto-repair complete. ${remainingReports.length} remaining conflict(s).`)

    return { repairedSlots, resolvedCount, logs }
  }

  private static hasFacultyConflict(
    day: number,
    period: number,
    facultyId: string,
    slots: TimetableSlot[]
  ): boolean {
    return slots.some((s) => s.day === day && s.period === period && s.subject?.facultyId === facultyId)
  }

  private static getDayName(day: number): string {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[day] || `Day ${day}`
  }
}
