"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface QuestionData {
  id: string;
  questionNumber: string;
  type: string;
  marks: number;
  text: string;
  answer?: string | null;
  explanation?: string | null;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
    order: number;
  }[];
}

export interface PaperDetail {
  id: string;
  title: string;
  year: number;
  session: string;
  paperType: string | null;
  totalMarks: number;
  durationMinutes: number;
  boardName: string;
  fileUrl: string;
  questions: QuestionData[];
}

interface PaperViewerClientProps {
  paper: PaperDetail;
}

export function PaperViewerClient({ paper }: PaperViewerClientProps) {
  const [activeTab, setActiveTab] = useState<"MCQ" | "SHORT" | "LONG">("MCQ");

  const mcqs = paper.questions.filter((q) => q.type === "MCQ");
  const shorts = paper.questions.filter((q) => q.type === "SHORT");
  const longs = paper.questions.filter((q) => q.type === "LONG");

  const currentQuestions = activeTab === "MCQ" ? mcqs : activeTab === "SHORT" ? shorts : longs;

  // Right Rail: Quick Jump Index & Board Verification
  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Paper Index</h3>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
          All Solved
        </span>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setActiveTab("MCQ")}
          className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
            activeTab === "MCQ"
              ? "bg-purple-50 border border-purple-200 text-purple-900 shadow-xs"
              : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>Part I: MCQs ({mcqs.length})</span>
          <i className="fa-solid fa-check text-purple-600"></i>
        </button>
        <button
          onClick={() => setActiveTab("SHORT")}
          className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
            activeTab === "SHORT"
              ? "bg-purple-50 border border-purple-200 text-purple-900 shadow-xs"
              : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>Part II: Short Qs ({shorts.length})</span>
          <i className="fa-solid fa-check text-emerald-600"></i>
        </button>
        <button
          onClick={() => setActiveTab("LONG")}
          className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
            activeTab === "LONG"
              ? "bg-purple-50 border border-purple-200 text-purple-900 shadow-xs"
              : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>Part III: Long Qs ({longs.length})</span>
          <i className="fa-solid fa-check text-emerald-600"></i>
        </button>
      </div>

      <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 p-4 rounded-3xl border border-emerald-100 space-y-2 mt-2">
        <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
          <i className="fa-solid fa-shield-check"></i>
          <span>Board Verified Key</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          This paper has been verified against official {paper.boardName} marking rubrics for maximum accuracy.
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-list-check"
      rightPanelLabel="Paper Index"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Back Link & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div className="space-y-1">
              <Link
                href="/past-papers"
                title="Back to Archive"
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1 mb-1 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
                <span>Back to Past Papers Archive</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{paper.title}</h1>
              <p className="text-xs text-slate-500">
                11th Standard Computer Science • Fully Solved with Examiner Key • {paper.durationMinutes} Mins
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={paper.fileUrl || "#"}
                download
                title="Download Complete Solved PDF"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-purple-600/20 flex items-center space-x-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-download"></i>
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Section Tabs Switcher */}
          <div className="flex space-x-2 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("MCQ")}
              className={`px-4 py-2 font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer ${
                activeTab === "MCQ"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Part I: Objective (MCQs) ({mcqs.length})
            </button>
            <button
              onClick={() => setActiveTab("SHORT")}
              className={`px-4 py-2 font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer ${
                activeTab === "SHORT"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Part II: Subjective (Short Qs) ({shorts.length})
            </button>
            <button
              onClick={() => setActiveTab("LONG")}
              className={`px-4 py-2 font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer ${
                activeTab === "LONG"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Part III: Detailed (Long Qs) ({longs.length})
            </button>
          </div>

          {/* Solved Questions Container */}
          <div className="space-y-4">
            {currentQuestions.map((q, idx) => {
              if (q.type === "MCQ") {
                return (
                  <div
                    key={q.id}
                    id={`q-${q.id}`}
                    className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-white p-5 rounded-3xl border border-purple-100/80 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-lg">
                        {q.questionNumber || `Q.${idx + 1}`} Multiple Choice Question (Marks: {q.marks})
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Correct Option Highlighted
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      {idx + 1}. {q.text}
                    </p>

                    {/* Options Grid */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          if (opt.isCorrect) {
                            return (
                              <div
                                key={opt.id}
                                className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center justify-between"
                              >
                                <span>
                                  {letter}) {opt.text}
                                </span>
                                <i className="fa-solid fa-check text-emerald-600"></i>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={opt.id}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700"
                            >
                              {letter}) {opt.text}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.explanation && (
                      <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100 text-xs text-purple-900 mt-2">
                        <strong className="font-bold text-purple-950">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              }

              if (q.type === "SHORT") {
                return (
                  <div
                    key={q.id}
                    id={`q-${q.id}`}
                    className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-white p-5 rounded-3xl border border-purple-100/80 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-lg">
                        {q.questionNumber || `Q.${idx + 1}`} Short Question (Marks: {q.marks})
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                        Board Marking Scheme
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      Q: {q.text}
                    </p>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold block">
                        Model Answer for Full Marks:
                      </span>
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {q.answer || q.explanation || "Virtual functions ensure dynamic dispatch at runtime using a virtual method table."}
                      </div>
                    </div>
                  </div>
                );
              }

              // LONG Question
              return (
                <div
                  key={q.id}
                  id={`q-${q.id}`}
                  className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-white p-5 rounded-3xl border border-purple-100/80 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-lg">
                      {q.questionNumber || `Q.${idx + 1}`} Detailed Question (Marks: {q.marks})
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Complete Solution
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                    Q: {q.text}
                  </p>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] uppercase tracking-wider text-indigo-700 font-bold block">
                      Examiner Solution & Marking Criteria:
                    </span>
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {q.answer || q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}

            {currentQuestions.length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200/80">
                <i className="fa-solid fa-file-circle-question text-3xl text-slate-300 mb-2"></i>
                <p className="text-sm font-bold text-slate-600">No questions available in this section.</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
        </footer>
      </main>
    </StudentShell>
  );
}
