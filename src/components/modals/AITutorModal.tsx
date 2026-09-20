"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AITutorModalProps {
  onClose: () => void;
  studentName?: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  onClose,
  studentName = "Uzair",
}) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([
    {
      role: "ai",
      text: `Hello ${studentName}! I'm your CS Assistant. Need clarification on C++ OOP concepts, pointers, or networking models?`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setPrompt("");
    setLoading(true);

    setTimeout(() => {
      let reply = "Here is a conceptual breakdown based on your syllabus: ";
      if (q.toLowerCase().includes("polymorphism")) {
        reply =
          "Polymorphism allows functions to act differently based on the object calling them. In C++, compile-time polymorphism uses function overloading/templates, while runtime polymorphism uses Virtual Functions with base pointers!";
      } else if (q.toLowerCase().includes("osi") || q.toLowerCase().includes("tcp")) {
        reply =
          "The OSI model has 7 layers (Physical to Application). TCP/IP condenses this into 4 layers: Network Access, Internet (IP), Transport (TCP/UDP), and Application (HTTP, FTP, DNS).";
      } else {
        reply = `Regarding "${q}": In the Punjab Board syllabus, focus on understanding the core definitions, working examples in C++, and remembering key examiner rubric terms.`;
      }
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div
      id="lms-ai-tutor-modal"
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] flex flex-col justify-between">
        <button
          onClick={onClose}
          id="close-tutor-modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded-lg cursor-pointer"
        >
          ✕
        </button>

        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Computer Science Tutor</h3>
              <p className="text-xs text-slate-500">24/7 Conceptual & Coding Assistant</p>
            </div>
          </div>

          <div className="space-y-3 text-xs max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${
                  m.role === "ai"
                    ? "bg-purple-50/70 border-purple-100 text-purple-900"
                    : "bg-slate-100 border-slate-200 text-slate-800 ml-6"
                }`}
              >
                <p className="font-medium leading-relaxed">{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-purple-600 text-xs flex items-center space-x-2">
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                <span>Thinking...</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Inquiries:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAsk("Polymorphism in C++")}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-xs"
              >
                <i className="fa-solid fa-code text-purple-600"></i>
                <span>Polymorphism in C++</span>
              </button>
              <button
                type="button"
                onClick={() => handleAsk("OSI vs TCP/IP Layers")}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-xs"
              >
                <i className="fa-solid fa-network-wired text-purple-600"></i>
                <span>OSI vs TCP/IP Layers</span>
              </button>
              <button
                type="button"
                onClick={() => handleAsk("Virtual Destructors")}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-xs"
              >
                <i className="fa-solid fa-cube text-purple-600"></i>
                <span>Virtual Destructors</span>
              </button>
              <Link
                href="/mistakes"
                onClick={onClose}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2 cursor-pointer text-xs"
              >
                <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                <span>Review Logged Errors</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask AI anything about CS..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-purple-500 focus:outline-none"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};
