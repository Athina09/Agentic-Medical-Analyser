import { Link } from "react-router-dom";
import { Stethoscope, Lightbulb } from "lucide-react";
import Heart3D from "@/components/Heart3D";

const FEATURE_CARDS = [
  {
    title: "AI-Driven Insights",
    description: "Leverages millions of data points to enhance diagnostic precision.",
    cardPos: "left-[2%] md:left-[4%] top-[16%] md:top-[18%]",
    lineEnd: "22%",
  },
  {
    title: "Anomaly Detection",
    description: "Identifies irregular patterns in medical scans within seconds.",
    cardPos: "right-[2%] md:right-[4%] top-[6%] md:top-[8%]",
    lineEnd: "18%",
  },
  {
    title: "Predictive Analysis",
    description: "Forecasts potential cardiovascular risks before symptoms appear.",
    cardPos: "right-[2%] md:right-[4%] bottom-[12%] md:bottom-[14%]",
    lineEnd: "75%",
  },
];

export default function HeroPage() {
  return (
    <div className="flex-1 relative px-6 md:px-10 pb-8 md:pb-12 min-h-[88vh]">
      {/* Heart layer - full bleed; nodes/lines on the heart */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 min-h-[480px]">
          <Heart3D />
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
              </linearGradient>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="rgba(255,255,255,0.8)" />
              </marker>
            </defs>
            <line x1="36%" y1="46%" x2="14%" y2="32%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead)" />
            <line x1="62%" y1="32%" x2="92%" y2="10%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead)" />
            <line x1="64%" y1="64%" x2="92%" y2="88%" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead)" />
            <circle cx="36%" cy="46%" r="6" fill="white" filter="url(#glow)" opacity="0.95" />
            <circle cx="62%" cy="32%" r="6" fill="white" filter="url(#glow)" opacity="0.95" />
            <circle cx="64%" cy="64%" r="6" fill="white" filter="url(#glow)" opacity="0.95" />
          </svg>
        </div>
      </div>

      {/* Feature callout boxes - frosted glass */}
      {FEATURE_CARDS.map((card) => (
        <div
          key={card.title}
          className={`absolute ${card.cardPos} w-[260px] md:w-[300px] p-5 rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-xl`}
        >
          <h3 className="font-bold text-slate-800 text-base md:text-lg mb-2">{card.title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
        </div>
      ))}

      {/* Headline + tagline + CTA */}
      <div className="relative z-20 pt-[380px] md:pt-[420px] lg:pt-[460px]">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          <span className="block">AI-Powered</span>
          <span className="block mt-1">Diagnostic System</span>
        </h1>
        <p className="text-white/95 text-base md:text-lg mt-4 max-w-lg">
          Revolutionizing medical diagnostics through AI and data science.
        </p>

        {/* Page navigation cards */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/intake"
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white text-base shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6366f1 100%)",
            }}
          >
            <Stethoscope className="w-5 h-5 flex-shrink-0" />
            Start Triage
          </Link>
          <Link
            to="/explain"
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-white text-base shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/40"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)",
            }}
          >
            <Lightbulb className="w-5 h-5 flex-shrink-0" />
            AI Explainability
          </Link>
        </div>
      </div>
    </div>
  );
}
