import { NextRequest, NextResponse } from "next/server"
import { CSPSolver } from "@/lib/ai-engine/csp-solver"
import { GenerationRequest } from "@/lib/ai-engine/types"
import { DEFAULT_PERIODS, SAMPLE_SUBJECTS } from "@/lib/timetable-data"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      department = "Computer Science",
      semester = "4",
      strategy = "balanced",
      maxIterations = 2000,
      lockExisting = false,
      existingSlots = [],
    } = body

    const request: GenerationRequest = {
      department,
      semester,
      sections: ["Section A", "Section B"],
      days: 6,
      periods: DEFAULT_PERIODS,
      subjects: SAMPLE_SUBJECTS,
      strategy,
      maxIterations,
      lockExisting,
      existingSlots,
    }

    const solver = new CSPSolver(request)
    const result = solver.solve()

    return NextResponse.json(
      {
        message: "Timetable generated successfully",
        data: result,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("AI Generation Error:", error)
    return NextResponse.json(
      { error: "Failed to generate timetable", details: error.message },
      { status: 500 }
    )
  }
}
