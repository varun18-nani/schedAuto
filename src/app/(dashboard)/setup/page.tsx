import { CollegeSetupWizard } from "@/components/wizard/college-setup"

export default function SetupPage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">College Setup Wizard</h1>
        <p className="text-slate-500 mt-2">Configure your institution's foundational data before generating timetables.</p>
      </div>
      <CollegeSetupWizard />
    </div>
  )
}
