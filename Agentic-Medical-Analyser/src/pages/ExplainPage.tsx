import { useState } from "react";
import { Link } from "react-router-dom";

const EXPLAIN_API = "http://127.0.0.1:9000/explain";

export default function ExplainPage() {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  async function generateExplanation() {
    setExplanation("");
    setError("");
    setLoading(true);
    const payload = {
      age: 40,
      gender: "Male",
      symptoms: ["Chest pain", "Shortness of breath"],
      vitals: { heart_rate: 115, temperature: 38.2 },
      pre_existing_conditions: ["Hypertension"],
      predicted_risk: "High",
      recommended_department: "Cardiology",
    };
    try {
      const res = await fetch(EXPLAIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setExplanation(data.explanation ?? "");
    } catch {
      setError("Failed to generate explanation. Check backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 md:px-10 pb-8 md:pb-12">
      <div className="max-w-2xl mx-auto rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-4">🧠 AI Explainability</h2>
        <div className="rounded-xl bg-white/20 p-4 mb-4 text-white/95 text-sm space-y-1">
          <p><strong>Age:</strong> 40</p>
          <p><strong>Gender:</strong> Male</p>
          <p><strong>Symptoms:</strong> Chest pain, Shortness of breath</p>
          <p><strong>Heart Rate:</strong> 115 bpm</p>
          <p><strong>Temperature:</strong> 38.2 °C</p>
          <p><strong>Pre-existing Conditions:</strong> Hypertension</p>
        </div>
        <div className="rounded-xl bg-white/20 p-4 mb-4 text-white/95 text-sm">
          <p><strong>Predicted Risk:</strong> <span className="text-violet-300 font-semibold">High</span></p>
          <p><strong>Recommended Department:</strong> <span className="text-violet-300 font-semibold">Cardiology</span></p>
        </div>
        <button
          onClick={generateExplanation}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 transition-all"
        >
          {loading ? "Generating..." : "Explain"}
        </button>
        {loading && <p className="mt-3 text-white/80 text-sm">Generating explanation...</p>}
        {explanation && (
          <div className="mt-4 p-4 rounded-xl bg-white/25 border-l-4 border-violet-400 text-white/95 text-sm whitespace-pre-line">
            {explanation.split("\n").map((line, i) => <p key={i} className="mb-1">{line}</p>)}
          </div>
        )}
        {error && <p className="mt-3 text-red-300 text-sm">{error}</p>}
        <Link to="/" className="inline-block mt-4 text-violet-300 hover:text-white font-medium text-sm">← Back to Home</Link>
      </div>
    </div>
  );
}
