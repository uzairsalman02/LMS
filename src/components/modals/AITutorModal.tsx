"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface AITutorModalProps {
  onClose: () => void;
  studentName?: string;
  subjectId?: string;
}

interface ChatMessage {
  id?: string;
  role: "ai" | "user";
  text: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  onClose,
  studentName = "Uzair",
  subjectId = "subj-cs-11",
}) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: `Hello ${studentName}! I am your AI Computer Science Tutor, powered directly by your Punjab Board syllabus. Ask me anything about Units 1 to 10!`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load persistent chat history from database on open
  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const res = await fetch("/api/ai-tutor");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text: q.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q.trim(), subjectId }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Sorry, I encountered an issue retrieving the syllabus answer. Please try asking again.",
          },
        ]);
      }
    } catch (err) {
      console.error("Error asking AI tutor:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Connection error. Please verify your local dev server connection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch("/api/ai-tutor", { method: "DELETE" });
      setMessages([
        {
          role: "ai",
          text: `Chat cleared. Hello ${studentName}! Ask me any conceptual or board exam question from your textbook.`,
        },
      ]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  return (
    <div
      id="lms-ai-tutor-modal"
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-5 sm:p-7 relative max-h-[92vh] flex flex-col justify-between">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-200">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black text-slate-900">AI Computer Science Tutor</h3>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Local Syllabus Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Punjab Board 11th CS Knowledge Base</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="text-slate-400 hover:text-rose-600 font-medium text-xs p-1.5 rounded-lg transition cursor-pointer"
              aria-label="Clear Chat"
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>
            <button
              type="button"
              onClick={onClose}
              id="close-tutor-modal"
              className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1.5 rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div className="my-3 space-y-3 text-xs max-h-[46vh] overflow-y-auto no-scrollbar pr-1 py-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border ${
                m.role === "ai"
                  ? "bg-slate-50/90 border-slate-200/90 text-slate-800"
                  : "bg-emerald-50/90 border-emerald-200 text-emerald-950 ml-6"
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-bold">
                {m.role === "ai" ? (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <i className="fa-solid fa-book-bookmark text-[9px]"></i>
                    <span>Syllabus Tutor</span>
                  </span>
                ) : (
                  <span className="text-emerald-800 flex items-center space-x-1">
                    <i className="fa-solid fa-user text-[9px]"></i>
                    <span>You</span>
                  </span>
                )}
              </div>
              <p className="leading-relaxed font-medium whitespace-pre-line">{m.text}</p>
            </div>
          ))}

          {loading && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs flex items-center space-x-2">
              <i className="fa-solid fa-circle-notch animate-spin text-emerald-600"></i>
              <span>Consulting official textbook database...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Inquiries (Aligned with 11th CS Curriculum) */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Frequent Board Questions:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAsk("Explain Star vs Mesh Topology")}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-[11px]"
            >
              <i className="fa-solid fa-network-wired text-emerald-600 text-xs shrink-0"></i>
              <span className="truncate">Star vs Mesh Topology</span>
            </button>
            <button
              type="button"
              onClick={() => handleAsk("What is System Bus and its types?")}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-[11px]"
            >
              <i className="fa-solid fa-microchip text-emerald-600 text-xs shrink-0"></i>
              <span className="truncate">System Bus Architecture</span>
            </button>
            <button
              type="button"
              onClick={() => handleAsk("Simplex vs Half vs Full Duplex")}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-[11px]"
            >
              <i className="fa-solid fa-tower-broadcast text-emerald-600 text-xs shrink-0"></i>
              <span className="truncate">Data Transmission Modes</span>
            </button>
            <button
              type="button"
              onClick={() => handleAsk("CPU Registers: PC, MAR, MBR")}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-[11px]"
            >
              <i className="fa-solid fa-memory text-emerald-600 text-xs shrink-0"></i>
              <span className="truncate">CPU Register Functions</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask anything from Class 11 CS (e.g., SDLC, Bus, Topologies)..."
            className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleAsk()}
            disabled={loading || !prompt.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
          >
            <span>Ask</span>
            <i className="fa-solid fa-paper-plane text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
