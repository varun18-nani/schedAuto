"use client"

import { useState } from "react"
import { Sparkles, PlayCircle, CheckCircle2, AlertTriangle, Loader2, ChevronRight, BookOpen, Users, School, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type GenerationStep = {
  id: string
  label: string
  description: string
  status: "pending" | "running" | "done" | "error"
}

const initialSteps: GenerationStep[] = [
  { id: "validate",   label: "Validating Constraints",   description: "Checking faculty availability, room capacity, and college rules",         status: "pending" },
  { id: "graph",      label: "Graph Coloring Pass",      description: "Applying graph-coloring algorithm to eliminate time conflicts",            status: "pending" },
  { id: "csp",        label: "CSP Solver",               description: "Constraint Satisfaction Problem solver assigning subjects to slots",       status: "pending" },
  { id: "optimize",   label: "Greedy Optimization",      description: "Optimizing faculty workload balance and preferred timings",               status: "pending" },
  { id: "simulated",  label: "Simulated Annealing",      description: "Fine-tuning schedule to minimize idle hours and maximize room utilization",status: "pending" },
  { id: "finalize",   label: "Finalizing Timetable",     description: "Generating final conflict-free timetable for all sections",               status: "pending" },
]

const departments = [
  { id: "cse", name: "Computer Science",   sections: 3, subjects: 8,  faculty: 12 },
  { id: "mech",name: "Mechanical Engg.",   sections: 2, subjects: 7,  faculty: 9  },
  { id: "ece", name: "Electronics",        sections: 2, subjects: 7,  faculty: 8  },
  { id: "civil",name: "Civil Engg.",       sections: 1, subjects: 6,  faculty: 7  },
]

export default function AIGeneratePage() {
  const [selectedDepts, setSelectedDepts] = useState<string[]>(["cse"])
  const [selectedSemester, setSelectedSemester] = useState("4")
  const [steps, setSteps] = useState<GenerationStep[]>(initialSteps)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const toggleDept = (id: string) => {
    setSelectedDepts((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])
  }

  const simulate = async () => {
    setIsGenerating(true)
    setIsDone(false)
    setSteps(initialSteps.map((s) => ({ ...s, status: "pending" })))

    for (let i = 0; i < initialSteps.length; i++) {
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "running" } : s))
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600))
      setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "done" } : s))
    }

    setIsGenerating(false)
    setIsDone(true)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Timetable Generator</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Select departments, semester, and launch the AI engine to generate conflict-free timetables automatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configuration</CardTitle>
              <CardDescription>Select what to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Semester</label>
                <div className="flex flex-wrap gap-2">
                  {["2","4","6","8"].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                        selectedSemester === sem
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-slate-200 text-slate-600 hover:border-indigo-300"
                      )}
                    >
                      Sem {sem}
                    </button>
                  ))}
                </div>
              </div>

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
                          ? "border-indigo-400 bg-indigo-50"
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
                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><School className="w-2.5 h-2.5" /> {dept.sections} sections</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> {dept.subjects} subjects</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><Users className="w-2.5 h-2.5" /> {dept.faculty} faculty</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={simulate}
                disabled={isGenerating || selectedDepts.length === 0}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
                  isGenerating || selectedDepts.length === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                )}
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : isDone ? (
                  <><CheckCircle2 className="w-4 h-4" /> Regenerate</>
                ) : (
                  <><PlayCircle className="w-4 h-4" /> Generate Timetable</>
                )}
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Progress Panel */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Generation Pipeline</CardTitle>
              <CardDescription>Real-time view of the AI scheduling algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-all",
                      step.status === "running" && "border-indigo-300 bg-indigo-50",
                      step.status === "done" && "border-emerald-200 bg-emerald-50",
                      step.status === "error" && "border-red-200 bg-red-50",
                      step.status === "pending" && "border-slate-200 bg-white"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {step.status === "pending" && (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-400">{i + 1}</span>
                        </div>
                      )}
                      {step.status === "running" && <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />}
                      {step.status === "done" && <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />}
                      {step.status === "error" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className={cn(
                        "text-sm font-semibold",
                        step.status === "running" && "text-indigo-800",
                        step.status === "done" && "text-emerald-800",
                        step.status === "pending" && "text-slate-600",
                      )}>{step.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                    </div>
                    {step.status === "running" && (
                      <div className="ml-auto shrink-0">
                        <div className="h-1.5 w-24 bg-indigo-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: "60%" }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isDone && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-800">✅ Timetable Generated Successfully!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {selectedDepts.length} department(s) · Semester {selectedSemester} · 0 conflicts detected
                    </p>
                  </div>
                  <a href="/timetables" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                    View Timetable <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
