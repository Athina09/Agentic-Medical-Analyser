import { Link } from "react-router-dom";

export default function DiagnosisPage() {
  return (
    <div className="px-6 md:px-10 pb-8 md:pb-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-xl w-full rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-xl p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
          Start Diagnosis
        </h1>
        <p className="text-white/90 text-base md:text-lg mb-6">
          Enter patient vitals and symptoms to get AI-powered department routing and risk assessment.
        </p>
        <div className="space-y-4 text-slate-700">
          <p className="text-sm">
            This page will connect to the diagnostic model (inference) to analyze symptoms and suggest the right department.
          </p>
          <Link
            to="/"
            className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
