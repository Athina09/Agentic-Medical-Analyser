import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const isIntake = location.pathname === "/intake";
  const isResults = location.pathname === "/results";
  const isHospitals = location.pathname === "/hospitals";
  const isChat = location.pathname === "/chat";
  const isExplain = location.pathname === "/explain";

  return (
    <div className="min-h-screen bg-slate-200/80 flex items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-6xl rounded-[2rem] overflow-hidden shadow-2xl mt-8 flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Shared gradient & glass - same as hero */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(219, 39, 119, 0.3) 0%, rgba(147, 51, 234, 0.25) 40%, rgba(79, 70, 229, 0.25) 70%, rgba(59, 130, 246, 0.2) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 55% 48%, rgba(236, 72, 153, 0.35) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 78% 38%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[3px]" />

        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          <header className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 pb-4 flex-shrink-0">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold text-violet-600 tracking-tight hover:text-violet-700 transition-colors"
            >
              Agentic Medical Analyser
            </Link>
            <nav className="hidden md:flex items-center gap-2 text-slate-700 text-sm font-medium">
              <Link
                to="/"
                className={isHome ? "text-violet-600 font-semibold" : "hover:text-violet-600 transition-colors"}
              >
                Home
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/dashboard"
                className={isDashboard ? "text-violet-600 font-semibold" : "hover:text-violet-600 transition-colors"}
              >
                Dashboard
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/intake"
                className={isIntake ? "text-violet-600 font-semibold" : "hover:text-violet-600 transition-colors"}
              >
                Triage
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/results"
                className={isResults ? "text-violet-600 font-semibold" : "hover:text-violet-600 transition-colors"}
              >
                Results
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/hospitals"
                className={isHospitals ? "text-violet-600 font-semibold" : "hover:text-violet-600 transition-colors"}
              >
                Hospitals
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/chat"
                className={isChat ? "text-violet-600 font-semibold" : "hover:text-violet-600 transition-colors"}
              >
                AI Assistant
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                to="/explain"
                className={isExplain ? "text-violet-600 font-semibold" : "hover:text-violet-600 transition-colors"}
              >
                Explain
              </Link>
            </nav>
            <button className="p-2 text-slate-700 hover:text-violet-600 md:hidden" aria-label="Menu">
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="flex-1 relative min-h-0 overflow-auto">
            {location.pathname === "/" ? (
              <Outlet />
            ) : (
              <div className="px-6 md:px-10 pt-8 md:pt-10 pb-8 md:pb-12">
                <Outlet />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
