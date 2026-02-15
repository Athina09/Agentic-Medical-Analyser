import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="px-6 md:px-10 pb-8 md:pb-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-xl w-full rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-xl p-8 md:p-10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
            }}
          >
            <MessageCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            Diagnostic Assistant
          </h1>
        </div>
        <p className="text-white/90 text-base md:text-lg mb-6">
          Chat with the AI assistant for medical triage and diagnostic guidance.
        </p>
        <div className="space-y-4 text-slate-700">
          <p className="text-sm">
            This page will host the chat interface for the diagnostic system.
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
