"use client"

import { useState } from "react"
import { Sparkles, PlayCircle, CheckCircle2, AlertTriangle, Loader2, ChevronRight, BookOpen, Users, School, Sliders, Cpu, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { EngineOption, GenerationResult } from "@/lib/ai-engine/types"

type GenerationStep = {
  id: string
  label: string
  description: string
  status: "pending" | "running" | "done" | "error"
}

const initialSteps: GenerationStep[] = [
  { id: "validate",   label: "1. Validating Constraints & Infrastructure", description: "Checking faculty availability, room capacity, and college rules",         status: "pending" },
  { id: "graph",      label: "2. Graph Coloring Pass",                    description: "Applying graph-coloring algorithm to eliminate hard overlaps",             status: "pending" },
  { id: "csp",        label: "3. CSP Solver Execution",                   description: "Constraint Satisfaction Problem solver assigning subjects to slots",       status: "pending" },
  { id: "optimize",   label: "4. Soft Constraints & Workload Balance",    description: "Optimizing faculty workload balance and preferred timings",               status: "pending" },
  { id: "simulated",  label: "5. Simulated Annealing Pass",               description: "Fine-tuning schedule to minimize idle hours and maximize room utilization",status: "pending" },
  { id: "finalize",   label: "6. Finalizing Timetable State",             description: "Generating final conflict-free timetable for selected sections",           status: "pending" },
]

const departments = [
  { id: "cse", name: "Computer Science",   sections: 3, subjects: 8,  faculty: 12 },
  { id: "mech",name: "Mechanical Engg.",   sections: 2, subjects: 7,  faculty: 9  },
  { id: "ece", name: "Electronics",        sections: 2, subjects: 7,  faculty: 8  },
  { id: "civil",name: "Civil Engg.",       sections: 1, subjects: 6,  faculty: 7  },
]

const strategies: { id: EngineOption; label: string; desc: string }[] = [
  { id: "balanced",      label: "Balanced (Default)", desc: "Optimizes workload & room efficiency equally" },
  { id: "minimize_gaps", label: "Minimize Gaps",      desc: "Reduces empty idle periods between classes" },
  { id: "morning_heavy", label: "Morning Heavy",      desc: "Schedules core theory classes in morning periods" },
  { id: "lab_priority",  label: "Lab Priority",       desc: "Prioritizes block allocation for lab sessions" },
]

export default function AIGeneratePage() {
  const [selectedDepts, setSelectedDepts] = useState<string[]>(["cse"])
  const [selectedSemester, setSelectedSemester] = useState("4")
  const [strategy, setStrategy] = useState<EngineOption>("balanced")
  const [steps, setSteps] = useState<GenerationStep[]>(initialSteps)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)

  const toggleDept = (id: string) => {
    setSelectedDepts((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])
  }

  const runAIGenerator = async () => {
    setIsGenerating(true)
    setResult(null)
    setSteps(initialSteps.map((s) => ({ ...s, status: "pending" })))

    // Step animation controller
    for (let i = 0; i < initialSteps.length - 1; i++) {
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "running" } : s))
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "done" } : s))
    }

    setSteps((prev) => prev.map((s, idx) => idx === initialSteps.length - 1 ? { ...s, status: "running" } : s))

    try {
      const selectedDeptNames = selectedDepts.map(id => departments.find(d => d.id === id)?.name || id).join(", ")
      const res = await fetch("/api/generate-timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: selectedDeptNames,
          semester: selectedSemester,
          strategy,
          maxIterations: 2000,
        }),
      })

      const json = await res.json()
      if (json.data) {
        setResult(json.data)
        // Store in localStorage so Timetable Builder can load generated slots
        if (typeof window !== "undefined") {
          localStorage.setItem("schedai_latest_timetable", JSON.stringify(json.data.slots))
        }
      }
      setSteps((prev) => prev.map((s) => ({ ...s, status: "done" })))
    } catch (err) {
      console.error("API error:", err)
      setSteps((prev) => prev.map((s, idx) => idx === initialSteps.length - 1 ? { ...s, status: "error" } : s))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Timetable Generator</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure optimization criteria and launch the CSP + Simulated Annealing engine to generate conflict-free schedules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Settings */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" /> Configuration
              </CardTitle>
              <CardDescription>Select target scope and optimization strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Semester */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Semester</label>
                <div className="flex flex-wrap gap-2">
                  {["2", "4", "6", "8"].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                        selectedSemester === sem
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:border-indigo-300"
                      )}
                    >
                      Sem {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optimization Strategy */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Optimization Strategy</label>
                <div className="space-y-2">
                  {strategies.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStrategy(st.id)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-lg border transition-all text-xs",
                        strategy === st.id
                          ? "border-indigo-500 bg-indigo-50/80 font-medium"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="font-semibold text-slate-800">{st.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Departments</label>
                <div className="space-y-2">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => toggleDept(dept.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        selectedDepts.includes(dept.id)
                          ? "border-indigo-400 bg-indigo-50/50"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{dept.name}</span>
                        <div className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                          selectedDepts.includes(dept.id) ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                        )}>
                          {selectedDepts.includes(dept.id) && <CheckCircle2 className="w-3 h-3 text-white fill-white" />}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><School className="w-2.5 h-2.5" /> {dept.sections} sec</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> {dept.subjects} subs</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><Users className="w-2.5 h-2.5" /> {dept.faculty} fac</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={runAIGenerator}
                disabled={isGenerating || selectedDepts.length === 0}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all shadow-md",
                  isGenerating || selectedDepts.length === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
                )}
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Solving Constraints...</>
                ) : result ? (
                  <><CheckCircle2 className="w-4 h-4" /> Re-run Engine</>
                ) : (
                  <><PlayCircle className="w-4 h-4" /> Launch AI Engine</>
                )}
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Execution View & Metrics */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" /> Pipeline Execution Status
              </CardTitle>
              <CardDescription>Real-time execution of constraint optimization algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-all",
                      step.status === "running" && "border-indigo-300 bg-indigo-50/70",
                      step.status === "done" && "border-emerald-200 bg-emerald-50/50",
                      step.status === "error" && "border-red-200 bg-red-50/50",
                      step.status === "pending" && "border-slate-200 bg-white"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {step.status === "pending" && (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-400"></span>
                        </div>
                      )}
                      {step.status === "running" && <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />}
                      {step.status === "done" && <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />}
                      {step.status === "error" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-semibold",
                        step.status === "running" && "text-indigo-900",
                        step.status === "done" && "text-emerald-900",
                        step.status === "pending" && "text-slate-600",
                      )}>{step.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Engine Metrics Card */}
              {result && (
                <div className="mt-5 pt-5 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-600" /> Optimization Results
                      </h4>
                      <p className="text-xs text-slate-500">Solved in {result.executionTimeMs}ms across {result.iterationsCompleted} iterations</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-600">{result.score}/100</span>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">AI Quality Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 border text-center">
                      <div className="text-sm font-bold text-slate-800">{result.metrics.hardConstraintsSatisfied}%</div>
                      <div className="text-[10px] text-slate-500">Hard Constraints</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border text-center">
                      <div className="text-sm font-bold text-slate-800">{result.metrics.facultyWorkloadBalance}%</div>
                      <div className="text-[10px] text-slate-500">Faculty Balance</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border text-center">
                      <div className="text-sm font-bold text-slate-800">{result.metrics.roomEfficiency}%</div>
                      <div className="text-[10px] text-slate-500">Room Efficiency</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border text-center">
                      <div className="text-sm font-bold text-slate-800">{result.conflictsCount}</div>
                      <div className="text-[10px] text-slate-500">Conflicts Left</div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-800">✅ Timetable Ready for Inspection</p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Generated {result.slots.filter(s => s.subject).length} class slots saved to memory.
                      </p>
                    </div>
                    <a
                      href="/timetables"
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      View & Edit Grid <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Log View */}
                  <div className="bg-slate-950 text-slate-300 p-3 rounded-lg text-[11px] font-mono max-h-36 overflow-y-auto space-y-1">
                    <div className="text-slate-500 text-[10px] font-sans font-bold uppercase mb-1">Engine Execution Logs</div>
                    {result.logs.map((l, idx) => (
                      <div key={idx}>{l}</div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
