"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentShell } from "@/components/layout/StudentShell";

export interface ChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
}

export interface ExamReadinessStats {
  syllabusCoverage: number;
  coveredTopics: number;
  totalTopics: number;
  accuracy: number;
  totalAnswers: number;
  correctAnswers: number;
  activeMistakes: number;
  readinessScore: number;
}

interface ExamModeClientProps {
  chapters: ChapterItem[];
  readinessStats?: ExamReadinessStats;
}

export function ExamModeClient({ chapters, readinessStats }: ExamModeClientProps) {
  const router = useRouter();

  const [scope, setScope] = useState<"full" | "chapter">("full");
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    chapters[0]?.id || ""
  );
  const [examFormat, setExamFormat] = useState<"full" | "official" | "grand">("full");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [isOmrSampleModalOpen, setIsOmrSampleModalOpen] = useState(false);
  const [activeSamplePage, setActiveSamplePage] = useState<1 | 2>(1);
  const [activeReferenceTab, setActiveReferenceTab] = useState<"tips" | "omr-rules" | "physical-sheet">("tips");

  const stats = readinessStats || {
    syllabusCoverage: 34,
    coveredTopics: 12,
    totalTopics: 35,
    accuracy: 60,
    totalAnswers: 32,
    correctAnswers: 19,
    activeMistakes: 4,
    readinessScore: 39,
  };

  const questionCount =
    scope === "chapter" ? 15 : examFormat === "full" ? 23 : examFormat === "official" ? 15 : 30;
  const timeMinutes =
    scope === "chapter" ? 20 : examFormat === "full" ? 60 : examFormat === "official" ? 20 : 40;

  const handleStartExam = () => {
    const params = new URLSearchParams();
    params.set("mode", "formal");

    if (scope === "chapter") {
      params.set("count", "15");
      params.set("time", "20");
      params.set("paperType", "objective");
      if (selectedChapterId) {
        params.set("chapters", selectedChapterId);
      }
    } else {
      if (examFormat === "full") {
        params.set("paperType", "full");
        params.set("count", "23");
        params.set("time", "60");
      } else if (examFormat === "grand") {
        params.set("paperType", "objective");
        params.set("count", "30");
        params.set("time", "40");
      } else {
        params.set("paperType", "objective");
        params.set("count", "15");
        params.set("time", "20");
      }
    }

    params.set("difficulty", difficulty);
    router.push(`/mock-test?${params.toString()}`);
  };

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId);

  // Status badge logic based on readiness score
  let statusBadge = {
    label: "Needs Practice",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    barColor: "from-rose-500 to-amber-500",
  };
  if (stats.readinessScore >= 80) {
    statusBadge = {
      label: "Board Ready",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      barColor: "from-emerald-500 to-teal-500",
    };
  } else if (stats.readinessScore >= 60) {
    statusBadge = {
      label: "On Track",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      barColor: "from-indigo-500 to-purple-500",
    };
  } else if (stats.readinessScore >= 40) {
    statusBadge = {
      label: "Developing",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      barColor: "from-amber-500 to-indigo-500",
    };
  }

  const rightRail = (
    <div className="space-y-3.5">
      {/* 1. Exam Readiness & Preparation Progress Widget */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white p-4 rounded-3xl border border-indigo-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <i className="fa-solid fa-gauge-high text-indigo-600 text-xs"></i>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Exam Readiness</h3>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-indigo-950">{stats.readinessScore}%</span>
              <span className="text-[10px] font-bold text-slate-400">Score</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500">Board Target: 80%+</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className={`bg-gradient-to-r ${statusBadge.barColor} h-full rounded-full transition-all duration-500`}
              style={{ width: `${Math.max(5, stats.readinessScore)}%` }}
            ></div>
          </div>
        </div>

        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-center">
          <div className="bg-white/80 p-2 rounded-xl border border-indigo-50 shadow-2xs">
            <span className="text-[10px] text-slate-400 block font-medium">Syllabus</span>
            <span className="text-xs font-bold text-slate-800">{stats.syllabusCoverage}%</span>
            <span className="text-[9px] text-slate-400 block truncate">{stats.coveredTopics}/{stats.totalTopics} Topics</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-indigo-50 shadow-2xs">
            <span className="text-[10px] text-slate-400 block font-medium">Accuracy</span>
            <span className="text-xs font-bold text-emerald-700">{stats.accuracy}%</span>
            <span className="text-[9px] text-slate-400 block truncate">{stats.correctAnswers}/{stats.totalAnswers} Right</span>
          </div>
          <Link
            href="/mistakes"
            className="bg-white/80 p-2 rounded-xl border border-rose-100 hover:border-rose-300 transition shadow-2xs block group"
          >
            <span className="text-[10px] text-slate-400 block font-medium group-hover:text-rose-600">Mistakes</span>
            <span className="text-xs font-bold text-rose-600">{stats.activeMistakes}</span>
            <span className="text-[9px] text-rose-400 block group-hover:underline">Fix Errors →</span>
          </Link>
        </div>

        {/* Formula Explanation Note */}
        <div className="pt-2 border-t border-indigo-100/70 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center space-x-1 truncate" title="(55% Syllabus + 45% Accuracy) - Mistakes Penalty">
            <i className="fa-solid fa-calculator text-indigo-400 text-[9px]"></i>
            <span className="truncate">Formula: (55% Syl + 45% Acc) - Mistakes</span>
          </span>
          <span className="text-[9px] font-semibold text-indigo-600 shrink-0">PCTB Rule</span>
        </div>
      </div>

      {/* 2. Compact BISE Marking Scheme (Adjusted & No Longer Oversized) */}
      <div className="bg-gradient-to-br from-amber-50 via-amber-100/20 to-orange-50/30 border border-amber-200/70 p-3.5 rounded-2xl space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
            <i className="fa-solid fa-file-lines text-amber-600"></i>
            <span>BISE Marking Scheme</span>
          </h3>
          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            Official
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="bg-white/80 p-2 rounded-xl border border-amber-100/80">
            <span className="text-[10px] text-slate-500 block leading-tight">Total MCQs</span>
            <span className="font-bold text-slate-900 text-xs">15 Questions</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-100/80">
            <span className="text-[10px] text-slate-500 block leading-tight">Time Limit</span>
            <span className="font-bold text-amber-700 text-xs">20 Minutes</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-100/80">
            <span className="text-[10px] text-slate-500 block leading-tight">Total Marks</span>
            <span className="font-bold text-slate-900 text-xs">15 (1/MCQ)</span>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-100/80">
            <span className="text-[10px] text-slate-500 block leading-tight">Neg. Marking</span>
            <span className="font-bold text-emerald-700 text-xs">None (0)</span>
          </div>
        </div>

        <p className="text-[10px] text-amber-900/70 leading-tight pt-0.5 border-t border-amber-200/40">
          Punjab Textbook Board (PCTB) scheme across all 9 Punjab Boards.
        </p>
      </div>

      {/* 3. Formal Rules & Instructions Card */}
      <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm space-y-2 text-xs">
        <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
          <i className="fa-solid fa-shield-halved text-indigo-600"></i>
          <span>Formal Exam Guidelines</span>
        </h4>
        <ul className="space-y-1.5 text-slate-600 text-[11px]">
          <li className="flex items-start space-x-1.5">
            <i className="fa-solid fa-clock text-indigo-500 mt-0.5 text-[10px]"></i>
            <span>Real-time countdown timer starts as test commences.</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <i className="fa-solid fa-circle-dot text-teal-600 mt-0.5 text-[10px]"></i>
            <span>Interactive Punjab Board OMR Bubble Sheet enabled.</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <i className="fa-solid fa-bookmark text-indigo-500 mt-0.5 text-[10px]"></i>
            <span>Use &ldquo;Mark for Review&rdquo; for tough questions.</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <i className="fa-solid fa-certificate text-indigo-500 mt-0.5 text-[10px]"></i>
            <span>Instant official BISE Progress Report on submission.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-file-lines"
      rightPanelLabel="Pattern"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6 max-w-5xl">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Assessment Center</span>
                <span>/</span>
                <span className="text-indigo-600 font-bold">Formal Exam Mode</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Official Board Exam Simulation Hub
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic BISE Punjab timed assessment environment for 11th Standard Computer Science
              </p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-center">
              <span className="bg-indigo-100 text-indigo-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5">
                <i className="fa-solid fa-shield-check"></i>
                <span>BISE Standard Active</span>
              </span>
            </div>
          </div>

          {/* Unified Exam Setup & Configuration Panel */}
          <div className="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 sm:space-y-5">
            {/* Panel Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-indigo-600 text-sm">
                  <i className="fa-solid fa-sliders"></i>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Exam Setup &amp; Configuration
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure scope, pattern, and difficulty before starting the timer
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-white border border-indigo-100 shadow-2xs px-2.5 py-1 rounded-full self-start sm:self-auto">
                BISE Simulation
              </span>
            </div>

            {/* Setting 1: Syllabus Scope */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <i className="fa-solid fa-book text-indigo-600 text-[10px]"></i>
                  <span>1. Syllabus Scope</span>
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  {scope === "full" ? "All 10 Units Included" : "Unit-Specific Test"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setScope("full")}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    scope === "full"
                      ? "bg-white text-indigo-950 shadow-xs border border-indigo-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <i className="fa-solid fa-graduation-cap text-indigo-600"></i>
                  <span>Full Syllabus Board Simulation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScope("chapter")}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    scope === "chapter"
                      ? "bg-white text-indigo-950 shadow-xs border border-indigo-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <i className="fa-solid fa-list-check text-indigo-600"></i>
                  <span>Chapter-wise Unit Exam</span>
                </button>
              </div>

              {/* Compact Unit Selector if Chapter Scope */}
              {scope === "chapter" && (
                <div className="pt-1.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                    {chapters.map((ch) => {
                      const isSelected = selectedChapterId === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setSelectedChapterId(ch.id)}
                          className={`p-2 rounded-xl text-left text-[11px] transition flex items-center space-x-1.5 cursor-pointer border ${
                            isSelected
                              ? "bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-white text-slate-600 border border-slate-200"
                            }`}
                          >
                            {ch.chapterNumber}
                          </span>
                          <span className="truncate">{ch.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Setting 2: Paper Format & Timing (Full Syllabus) */}
            {scope === "full" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <i className="fa-solid fa-clock text-indigo-600 text-[10px]"></i>
                    <span>2. Paper Format &amp; Timing</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Board Standard Timings</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Full Exam */}
                  <div
                    onClick={() => setExamFormat("full")}
                    className={`p-3 rounded-2xl border cursor-pointer transition shadow-2xs flex flex-col justify-between ${
                      examFormat === "full"
                        ? "border-2 border-indigo-600 bg-white ring-2 ring-indigo-500/10"
                        : "border-slate-200/90 hover:border-indigo-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Complete Board Exam</span>
                      <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                        Auto-Graded
                      </span>
                    </div>
                    <span className="text-[11px] text-indigo-700 font-semibold mt-1">
                      15 MCQs + 6 Short + 2 Long
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">60 Mins • 50 Marks</span>
                  </div>

                  {/* Objective Standard */}
                  <div
                    onClick={() => setExamFormat("official")}
                    className={`p-3 rounded-2xl border cursor-pointer transition shadow-2xs flex flex-col justify-between ${
                      examFormat === "official"
                        ? "border-2 border-indigo-600 bg-white ring-2 ring-indigo-500/10"
                        : "border-slate-200/90 hover:border-indigo-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Objective Standard</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        Exact BISE
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1">
                      15 Objective MCQs
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">20 Mins • 15 Marks</span>
                  </div>

                  {/* Speed MCQ Drill */}
                  <div
                    onClick={() => setExamFormat("grand")}
                    className={`p-3 rounded-2xl border cursor-pointer transition shadow-2xs flex flex-col justify-between ${
                      examFormat === "grand"
                        ? "border-2 border-indigo-600 bg-white ring-2 ring-indigo-500/10"
                        : "border-slate-200/90 hover:border-indigo-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Speed MCQ Drill</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                        Drill
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-700 font-semibold mt-1">
                      30 Objective MCQs
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">40 Mins • 30 Marks</span>
                  </div>
                </div>
              </div>
            )}

            {/* Setting 3: Difficulty Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <i className="fa-solid fa-gauge-high text-indigo-600 text-[10px]"></i>
                  <span>{scope === "full" ? "3." : "2."} Difficulty Level</span>
                </span>
                <span className="text-[11px] text-slate-500">Weightage Calibration</span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setDifficulty("EASY")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-1.5 ${
                    difficulty === "EASY"
                      ? "bg-white text-indigo-950 shadow-xs border border-indigo-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Easy</span>
                  <span className="text-[10px] font-normal text-slate-400 hidden sm:inline">
                    (Definitions)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty("MEDIUM")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-1.5 ${
                    difficulty === "MEDIUM"
                      ? "bg-white text-indigo-950 shadow-xs border border-indigo-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Board Standard</span>
                  <span className="text-[10px] font-normal text-indigo-600 hidden sm:inline">
                    (Official)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty("HARD")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-1.5 ${
                    difficulty === "HARD"
                      ? "bg-white text-indigo-950 shadow-xs border border-indigo-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Advanced</span>
                  <span className="text-[10px] font-normal text-slate-400 hidden sm:inline">
                    (Analytical)
                  </span>
                </button>
              </div>
            </div>

            {/* Integrated Action / Summary Bar */}
            <div className="pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-900">
                  {scope === "full"
                    ? examFormat === "full"
                      ? "Complete Board Exam"
                      : examFormat === "grand"
                      ? "Speed MCQ Drill"
                      : "Official Objective Paper"
                    : `${selectedChapter?.title || "Selected Unit"}`}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-700 font-semibold">
                  {scope === "full" && examFormat === "full"
                    ? "15 MCQs + 6 Short + 2 Long (50 Marks)"
                    : `${questionCount} Questions (${questionCount} Marks)`}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">{timeMinutes} Minutes</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  {difficulty === "MEDIUM" ? "Board Standard" : difficulty}
                </span>
              </div>

              <button
                onClick={handleStartExam}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-2xl text-xs sm:text-sm transition shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 cursor-pointer shrink-0"
              >
                <i className="fa-solid fa-play text-xs"></i>
                <span>Start Official Exam Now</span>
              </button>
            </div>
          </div>

          {/* Segmented Board Reference & Guidelines Hub with Tabs */}
          <div className="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            {/* Header with Segmented Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-indigo-600 text-sm">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Board Reference &amp; Guidelines Hub
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Examination tactics, scanner evaluation rules, and physical sheet reference
                  </p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center space-x-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveReferenceTab("tips")}
                  className={`py-1.5 px-3 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                    activeReferenceTab === "tips"
                      ? "bg-white text-indigo-900 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <i className="fa-solid fa-lightbulb text-amber-500 text-xs"></i>
                  <span>Strategy Tips</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReferenceTab("omr-rules")}
                  className={`py-1.5 px-3 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                    activeReferenceTab === "omr-rules"
                      ? "bg-white text-indigo-900 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <i className="fa-solid fa-circle-dot text-teal-600 text-xs"></i>
                  <span>OMR Bubble Rules</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveReferenceTab("physical-sheet")}
                  className={`py-1.5 px-3 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                    activeReferenceTab === "physical-sheet"
                      ? "bg-white text-indigo-900 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <i className="fa-solid fa-file-lines text-indigo-600 text-xs"></i>
                  <span>Physical Sheet Sample</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Strategy Tips */}
            {activeReferenceTab === "tips" && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-700 animate-in fade-in duration-150">
                <li className="flex items-start space-x-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-xs mt-0.5 shrink-0"></i>
                  <span>
                    <strong className="text-slate-900">Pacing:</strong> Allocate ~1.3 minutes per question. Do not spend too long on any single problem.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-xs mt-0.5 shrink-0"></i>
                  <span>
                    <strong className="text-slate-900">No Negative Marking:</strong> Attempt every MCQ. An educated guess is always better than leaving a question blank.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-xs mt-0.5 shrink-0"></i>
                  <span>
                    <strong className="text-slate-900">Read Stems Thoroughly:</strong> Pay close attention to keywords like &ldquo;NOT&rdquo;, &ldquo;EXCEPT&rdquo;, or &ldquo;ALWAYS&rdquo; in questions.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-xs mt-0.5 shrink-0"></i>
                  <span>
                    <strong className="text-slate-900">Review Flags:</strong> Use the bookmark feature to mark uncertain questions and review them before finishing.
                  </span>
                </li>
                <li className="flex items-start space-x-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs sm:col-span-2">
                  <i className="fa-solid fa-circle-dot text-teal-600 text-xs mt-0.5 shrink-0"></i>
                  <span>
                    <strong className="text-slate-900">BISE OMR Bubble Sheet:</strong> Real-time objective response sheet is synchronized with your paper. You can click choices on screen or tap bubbles directly on the OMR drawer.
                  </span>
                </li>
              </ul>
            )}

            {/* Tab 2: OMR Bubble Rules */}
            {activeReferenceTab === "omr-rules" && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <p className="text-xs text-slate-600 leading-relaxed">
                  In actual Punjab Board examinations (BISE Lahore, Gujranwala, Rawalpindi, etc.), objective papers are scored by automated high-speed OMR optical scanners. A single mistake in shading can cause your answer to be rejected. Study the filling rules below:
                </p>

                {/* 4 Sample Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {/* Card 1: Correct Filling */}
                  <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 flex flex-col items-center text-center space-y-2.5 transition shadow-2xs hover:shadow-xs">
                    <div className="flex items-center space-x-1.5 p-1 bg-slate-50 rounded-full border border-emerald-200 px-2.5">
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">A</div>
                      <div className="w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-950 text-white text-[11px] font-black flex items-center justify-center shadow-inner scale-110 ring-2 ring-emerald-400">B</div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">C</div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">D</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center justify-center space-x-1 mb-1">
                        <i className="fa-solid fa-check text-[9px]"></i>
                        <span>Correct (100% Valid)</span>
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">Complete Solid Fill</h4>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Circle is completely shaded with blue/black ballpoint. Scanner reads 100% optical density.
                    </p>
                  </div>

                  {/* Card 2: Tick or Cross Mark */}
                  <div className="bg-white border border-rose-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-2.5 transition shadow-2xs hover:shadow-xs">
                    <div className="flex items-center space-x-1.5 p-1 bg-slate-50 rounded-full border border-rose-200 px-2.5">
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">A</div>
                      <div className="w-6 h-6 rounded-full border-2 border-rose-400 bg-rose-50 text-rose-600 text-xs font-black flex items-center justify-center">
                        <i className="fa-solid fa-check text-[11px]"></i>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">C</div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">D</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center justify-center space-x-1 mb-1">
                        <i className="fa-solid fa-xmark text-[9px]"></i>
                        <span>Invalid (Rejected)</span>
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">Tick / Cross Mark</h4>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Never use checkmarks (&check;) or cross marks (&cross;). OMR sensors ignore non-shaded symbols.
                    </p>
                  </div>

                  {/* Card 3: Partial / Half Shading */}
                  <div className="bg-white border border-rose-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-2.5 transition shadow-2xs hover:shadow-xs">
                    <div className="flex items-center space-x-1.5 p-1 bg-slate-50 rounded-full border border-rose-200 px-2.5">
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">A</div>
                      <div className="w-6 h-6 rounded-full border-2 border-slate-400 bg-white relative overflow-hidden flex items-center justify-center text-[10px] font-bold">
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-slate-900"></div>
                        <span className="relative z-10 text-[9px] text-white">B</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">C</div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">D</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center justify-center space-x-1 mb-1">
                        <i className="fa-solid fa-xmark text-[9px]"></i>
                        <span>Invalid (Unread)</span>
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">Half / Incomplete Fill</h4>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Partial shading, tiny central dots, or faint pencil strokes fall below the OMR sensor threshold.
                    </p>
                  </div>

                  {/* Card 4: Multiple Bubbles */}
                  <div className="bg-white border border-rose-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-2.5 transition shadow-2xs hover:shadow-xs">
                    <div className="flex items-center space-x-1.5 p-1 bg-slate-50 rounded-full border border-rose-200 px-2.5">
                      <div className="w-5 h-5 rounded-full bg-slate-950 text-white text-[9px] font-black flex items-center justify-center">A</div>
                      <div className="w-5 h-5 rounded-full bg-slate-950 text-white text-[9px] font-black flex items-center justify-center">B</div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">C</div>
                      <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold flex items-center justify-center">D</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center justify-center space-x-1 mb-1">
                        <i className="fa-solid fa-ban text-[9px]"></i>
                        <span>0 Marks (Multi-Fill)</span>
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">Multiple Bubbles</h4>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Filling two or more circles for the same question results in immediate cancellation (0 marks).
                    </p>
                  </div>
                </div>

                {/* Quick Practice Tip Footer */}
                <div className="bg-white border border-teal-200/80 rounded-2xl p-3.5 flex items-center space-x-2.5 text-xs text-teal-900 shadow-2xs">
                  <i className="fa-solid fa-circle-info text-teal-600 text-sm shrink-0"></i>
                  <span className="text-[11px] leading-relaxed">
                    <strong className="text-teal-950">Pro-Tip:</strong> In our Exam Mode, clicking an option on screen automatically fills the corresponding circle on your digital OMR sheet with 100% valid density. You can also click bubbles directly on the OMR drawer!
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: Physical Sheet Sample */}
            {activeReferenceTab === "physical-sheet" && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-xs text-slate-600">
                    Preview actual physical Punjab Board OMR sheet layouts. Click either page card to view high-resolution scan:
                  </p>
                  <a
                    href="/bise-omr-sample.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 border border-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
                  >
                    <i className="fa-solid fa-download text-indigo-600"></i>
                    <span>Download Sample PDF</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Page 1 Card */}
                  <div
                    onClick={() => {
                      setActiveSamplePage(1);
                      setIsOmrSampleModalOpen(true);
                    }}
                    className="group bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-indigo-400/80 rounded-2xl p-3.5 transition-all duration-150 cursor-pointer flex flex-col space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          1
                        </span>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-950 transition">
                          Side 1: MCQs Response &amp; Award Sheet
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        F-BISE-RA
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[3/4] max-h-52">
                      <img
                        src="/images/omr/bise-omr-thumb-1.webp"
                        alt="Sample OMR Sheet Side 1"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transition duration-200 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow flex items-center space-x-1.5">
                          <i className="fa-solid fa-magnifying-glass-plus"></i>
                          <span>Click to View Full Size</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Shows student MCQ response bubbles (Q.01 to Q.24), Paper Code block, and examiner Award Sheet.
                    </p>
                  </div>

                  {/* Page 2 Card */}
                  <div
                    onClick={() => {
                      setActiveSamplePage(2);
                      setIsOmrSampleModalOpen(true);
                    }}
                    className="group bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-indigo-400/80 rounded-2xl p-3.5 transition-all duration-150 cursor-pointer flex flex-col space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          2
                        </span>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-950 transition">
                          Side 2: Roll Number &amp; Instructions
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        F-BISE-ROLL
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[3/4] max-h-52">
                      <img
                        src="/images/omr/bise-omr-thumb-2.webp"
                        alt="Sample OMR Sheet Side 2"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transition duration-200 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow flex items-center space-x-1.5">
                          <i className="fa-solid fa-magnifying-glass-plus"></i>
                          <span>Click to View Full Size</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Shows Roll Number bubbles (6 digits), Paper Code bubbles (4 digits), date grid, and board rules.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* High-Resolution Interactive OMR Sample Viewer Modal */}
        {isOmrSampleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Top Header */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 text-sm">
                    <i className="fa-solid fa-file-lines"></i>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      Physical OMR Answer Sheet (Sample Reference)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Standard board examination paper layout for student practice
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOmrSampleModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Segmented Page Switcher Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-xl font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveSamplePage(1)}
                    className={`py-1 px-3 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                      activeSamplePage === 1
                        ? "bg-white text-teal-900 shadow-2xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <i className="fa-solid fa-list-ol text-teal-600 text-[10px]"></i>
                    <span>Side 1: MCQs &amp; Award</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSamplePage(2)}
                    className={`py-1 px-3 rounded-lg transition flex items-center space-x-1.5 cursor-pointer ${
                      activeSamplePage === 2
                        ? "bg-white text-indigo-900 shadow-2xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <i className="fa-solid fa-id-card text-indigo-600 text-[10px]"></i>
                    <span>Side 2: Roll No &amp; Rules</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-500">
                    Form: <strong className="text-slate-800">{activeSamplePage === 1 ? "F-BISE-RA" : "F-BISE-ROLL"}</strong>
                  </span>
                  <a
                    href="/bise-omr-sample.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:text-teal-900 font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-lg transition flex items-center space-x-1 text-[11px]"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>PDF</span>
                  </a>
                </div>
              </div>

              {/* High-Resolution Document Display */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-100 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-md border border-slate-200 max-w-xl w-full p-2 overflow-hidden">
                  <img
                    src={`/images/omr/bise-omr-page-${activeSamplePage}.webp`}
                    alt={`Sample OMR Sheet Page ${activeSamplePage}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-auto rounded-lg object-contain mx-auto"
                  />
                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                <span className="text-slate-500 text-[11px]">
                  {activeSamplePage === 1
                    ? "Side 1: Student fills circles for MCQs 1 to 24 using Blue or Black ballpoint."
                    : "Side 2: Candidate shades Roll Number (6 digits) and Paper Code (4 digits)."}
                </span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <a
                    href="/bise-omr-sample.pdf"
                    download="Punjab-Board-OMR-Sample.pdf"
                    className="flex-1 sm:flex-none px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer text-xs"
                  >
                    <i className="fa-solid fa-download text-[11px]"></i>
                    <span>Download PDF</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsOmrSampleModalOpen(false)}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold transition cursor-pointer text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Board of Intermediate and Secondary Education (BISE) Simulation System. 11th Standard Computer Science.</p>
        </footer>
      </main>
    </StudentShell>
  );
}
