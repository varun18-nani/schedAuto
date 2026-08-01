import { NextRequest, NextResponse } from "next/server"
import { ConflictSolver } from "@/lib/ai-engine/conflict-solver"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slots = [] } = body

    if (!Array.isArray(slots) || slots.length === 0) {
      return NextResponse.json({ error: "Invalid slots provided" }, { status: 400 })
    }

    const reports = ConflictSolver.analyzeConflicts(slots)
    const fixResult = ConflictSolver.autoFixConflicts(slots)

    return NextResponse.json({
      reports,
      repairedSlots: fixResult.repairedSlots,
      resolvedCount: fixResult.resolvedCount,
      logs: fixResult.logs,
    })
  } catch (error: any) {
    console.error("Conflict Resolver Error:", error)
    return NextResponse.json({ error: "Failed to resolve conflicts", details: error.message }, { status: 500 })
  }
}
