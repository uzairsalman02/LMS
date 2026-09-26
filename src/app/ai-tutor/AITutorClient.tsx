"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface ChatMessageItem {
  id?: string;
  role: "ai" | "user";
  text: string;
  createdAt?: string;
}

interface ChapterSummary {
  id: string;
  chapterNumber: number;
  title: string;
  _count: {
    Topic: number;
    Question: number;
  };
}

interface AITutorClientProps {
  studentName: string;
  initialMessages: ChatMessageItem[];
  chapters: ChapterSummary[];
  subjectId?: string;
}

const QUICK_INQUIRIES = [
  {
    label: "Star vs Mesh Topology",
    query: "Explain Star vs Mesh Topology with differences and exam points",
    icon: "fa-solid fa-network-wired",
    unit: "Unit 2",
  },
  {
    label: "System Bus Architecture",
    query: "What is System Bus and its types (Data, Address, Control)?",
    icon: "fa-solid fa-microchip",
    unit: "Unit 5",
  },
  {
    label: "Data Transmission Modes",
    query: "Simplex vs Half-Duplex vs Full-Duplex transmission with examples",
    icon: "fa-solid fa-tower-broadcast",
    unit: "Unit 3",
  },
  {
    label: "CPU Register Functions",
    query: "Explain the functions of PC, MAR, MBR, and IR registers",
    icon: "fa-solid fa-memory",
    unit: "Unit 5",
  },
  {
    label: "SDLC Sequential Phases",
    query: "What are the 6 phases of Software Development Life Cycle (SDLC)?",
    icon: "fa-solid fa-diagram-project",
    unit: "Unit 1",
  },
  {
    label: "Computer Virus vs Worm",
    query: "Differentiate between a Computer Virus and a Computer Worm",
    icon: "fa-solid fa-shield-virus",
    unit: "Unit 6",
  },
];

export function AITutorClient({
  studentName,
  initialMessages,
  chapters,
  subjectId = "subj-cs-11",
}: AITutorClientProps) {
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const q = (queryText || prompt).trim();
    if (!q || loading) return;

    const userMessage: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: q,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, subjectId }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: ChatMessageItem = {
          id: data.messageId || `ai-${Date.now()}`,
          role: "ai",
          text: data.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "ai",
            text: "Sorry, I encountered an issue retrieving the syllabus answer. Please verify your query.",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("AI Tutor communication error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "ai",
          text: "Connection error. Please check your local network or server status.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear your conversation history?")) return;
    setIsClearing(true);
    try {
      await fetch("/api/ai-tutor", { method: "DELETE" });
      setMessages([
        {
          id: "cleared-1",
          role: "ai",
          text: `Chat cleared. Hello ${studentName}! Ask me any conceptual question or board exam topic from your textbook.`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: "How does the AI Tutor generate answers?",
      a: "It queries your local Punjab Textbook Board syllabus database in real time. It retrieves official definitions, rubric keywords, analogies, and examiner tips without using any external paid APIs.",
    },
    {
      q: "Does it help with Board Exam preparation?",
      a: "Yes. Every response is structured to follow BISE marking criteria, including key heading points, real-world examples, and examiner presentation tips to secure full marks in short and long questions.",
    },
    {
      q: "Is my chat history saved?",
      a: "Yes. Your conversation is securely stored in your student database session. You can continue anytime or click 'Clear History' to start fresh.",
    },
    {
      q: "Can I ask questions from any unit?",
      a: "You can ask about any topic across Units 1 to 10 of Class 11 Computer Science, including Software Engineering, Networks, Architecture, Data Communications, and MS Office.",
    },
  ];

  const rightPanelContent = (
    <div className="space-y-4">
      {/* 1. AI Tutor Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-2.5 mb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200/60">
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              About AI Syllabus Tutor
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">What this tutor does</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
          Your dedicated academic assistant engineered specifically for Punjab Board (PCTB) Computer Science preparation.
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <i className="fa-solid fa-book-bookmark text-emerald-600 text-xs mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold text-slate-800 text-[11px]">Syllabus-Grounded Definitions</p>
              <p className="text-[10px] text-slate-500">Provides textbook-accurate concepts and terminology.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <i className="fa-solid fa-pen-to-square text-emerald-600 text-xs mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold text-slate-800 text-[11px]">Board Presentation Guidance</p>
              <p className="text-[10px] text-slate-500">Guides how to structure answers and diagrams for full marks.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <i className="fa-solid fa-lightbulb text-emerald-600 text-xs mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold text-slate-800 text-[11px]">Real-World Analogies</p>
              <p className="text-[10px] text-slate-500">Translates complex technical ideas into everyday examples.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <i className="fa-solid fa-shield-halved text-emerald-600 text-xs mt-0.5 shrink-0"></i>
            <div>
              <p className="font-semibold text-slate-800 text-[11px]">100% Local & Private</p>
              <p className="text-[10px] text-slate-500">Runs offline against your curriculum database with zero delay.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FAQs Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-2.5 mb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200/60">
            <i className="fa-solid fa-circle-question"></i>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Frequently Asked Questions
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Quick answers</p>
          </div>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/60 transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-emerald-700 transition cursor-pointer"
                >
                  <span className="pr-2">{faq.q}</span>
                  <i
                    className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  ></i>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-0 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1 pt-2 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <StudentShell
      pageTitle="AI Syllabus Tutor"
      badge="11th Standard"
      studentName={studentName}
      rightPanel={rightPanelContent}
      rightPanelIcon="fa-circle-info"
      rightPanelLabel="Tutor Info & FAQs"
    >
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)]">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-500/20">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  AI Computer Science Tutor
                </h1>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Local Syllabus Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Instant board exam guidance grounded in official Punjab Textbook Board curriculum.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleClearChat}
              disabled={isClearing || messages.length <= 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-700 bg-white text-xs font-semibold transition disabled:opacity-40 cursor-pointer flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-rotate-left text-[11px]"></i>
              <span>Clear History</span>
            </button>
            <Link
              href="/revision"
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-book-bookmark text-[11px] text-emerald-600"></i>
              <span>Flashcards</span>
            </Link>
          </div>
        </div>

        {/* Chat Thread Container */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm border leading-relaxed ${
                    m.role === "user"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-50/80 text-slate-800 border-slate-200/90 shadow-2xs"
                  }`}
                >
                  {/* Sender Tag */}
                  <div
                    className={`flex items-center space-x-2 mb-2 pb-1.5 border-b text-[11px] font-bold ${
                      m.role === "user"
                        ? "border-emerald-500/40 text-emerald-100"
                        : "border-slate-200/80 text-emerald-700"
                    }`}
                  >
                    {m.role === "user" ? (
                      <>
                        <i className="fa-solid fa-user text-[10px]"></i>
                        <span>{studentName}</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-robot text-[10px]"></i>
                        <span>Syllabus AI Tutor</span>
                      </>
                    )}
                    {m.createdAt && (
                      <span
                        className={`text-[10px] font-normal ml-auto ${
                          m.role === "user" ? "text-emerald-200" : "text-slate-400"
                        }`}
                      >
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="whitespace-pre-line font-medium leading-relaxed">
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center space-x-2.5">
                  <i className="fa-solid fa-circle-notch animate-spin text-emerald-600 text-sm"></i>
                  <span>Consulting official Punjab Board syllabus database...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Chat Input Bar */}
          <div className="border-t border-slate-100 p-3 sm:p-4 bg-white">
            {/* Quick Inquiry Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 pt-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center space-x-1">
                <i className="fa-solid fa-sparkles text-[9px] text-emerald-600"></i>
                <span>Suggested:</span>
              </span>
              {QUICK_INQUIRIES.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.query)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-[11px] font-medium transition shrink-0 border border-slate-200/80 cursor-pointer flex items-center space-x-1.5"
                >
                  <i className={`${item.icon} text-[10px] text-emerald-600`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything from Class 11 CS (e.g. Star vs Mesh, System Bus, Simplex vs Duplex, SDLC)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2 shrink-0 shadow-sm"
              >
                <span>Ask Tutor</span>
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Press Enter to send. Answers strictly follow Punjab Textbook Board guidelines.</span>
              <span className="hidden sm:inline">Zero External Latency</span>
            </div>
          </div>
        </div>
      </main>
    </StudentShell>
  );
}
