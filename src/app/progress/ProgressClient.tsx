"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface ChapterProgressStat {
  id: string;
  chapterNumber: number;
  title: string;
  totalQuestions: number;
  attemptedQuestions: number;
  accuracy: number;
  mistakesCount: number;
  status: "Mastered" | "In Progress" | "Started" | "Not Started";
}

export interface AttemptHistoryItem {
  id: string;
  testTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  passed: boolean;
  date: string;
  formattedDate: string;
  violationsCount?: number;
  answersCount: number;
}

export interface SkillProficiencyItem {
  name: string;
  percentage: number;
  color: string;
}

export interface AIMentorRecommendation {
  type: "weakness" | "pacing" | "coverage" | "mistakes" | "grade";
  icon: string;
  iconColor: string;
  label: string;
  detail: string;
  actionText?: string;
  actionHref?: string;
}

export interface BoardPacingMetric {
  avgSecondsPerQ: number;
  benchmarkSeconds: number;
  status: "optimal" | "rushing" | "slow";
  statusLabel: string;
  detail: string;
}

export interface BoardBottleneck {
  chapterNumber: number;
  title: string;
  accuracy: number;
  mistakesCount: number;
}

export interface AIMentorPoint {
  title: string;
  detail: string;
  badge?: string;
}

export interface AIMentorInsight {
  title: string;
  badge?: string;
  overallAdvice: string;
  strengths: AIMentorPoint[];
  weaknesses: AIMentorPoint[];
  standingGrade?: string;
  standingPct?: number;
  pacing?: BoardPacingMetric;
  bottleneck?: BoardBottleneck | null;
  unattemptedCount?: number;
  unresolvedMistakesCount?: number;
  description?: string;
  recommendations?: AIMentorRecommendation[];
}

export interface ProgressDataProps {
  studentName: string;
  overallScorePct: number;
  overallGrade: string;
  totalAttempts: number;
  passedAttempts: number;
  totalAnswers: number;
  accuracyRate: number;
  chaptersActive: number;
  streakDays: number;
  chapterStats: ChapterProgressStat[];
  recentAttempts: AttemptHistoryItem[];
  skillMatrix: SkillProficiencyItem[];
  aiMentorInsight: AIMentorInsight;
}

function renderAdvisoryText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const content = part.slice(2, -2);
      if (
        content.includes("%") ||
        content.includes("Grade") ||
        content.includes("trajectory") ||
        content.includes("standing")
      ) {
        return (
          <strong key={index} className="font-bold text-teal-700">
            {content}
          </strong>
        );
      }
      if (
        content.toLowerCase().includes("unit") ||
        content.toLowerCase().includes("accuracy") ||
        content.toLowerCase().includes("bottleneck")
      ) {
        return (
          <strong key={index} className="font-bold text-rose-600">
            {content}
          </strong>
        );
      }
      if (
        content.toLowerCase().includes("pacing") ||
        content.toLowerCase().includes("s/mcq") ||
        content.toLowerCase().includes("s per") ||
        content.toLowerCase().includes("tempo") ||
        content.toLowerCase().includes("benchmark") ||
        content.toLowerCase().includes("speed")
      ) {
        return (
          <strong key={index} className="font-bold text-indigo-700">
            {content}
          </strong>
        );
      }
      if (
        content.toLowerCase().includes("mistake") ||
        content.toLowerCase().includes("error") ||
        content.toLowerCase().includes("unattempted") ||
        content.toLowerCase().includes("untested")
      ) {
        return (
          <strong key={index} className="font-bold text-amber-600">
            {content}
          </strong>
        );
      }
      return (
        <strong key={index} className="font-bold text-slate-900">
          {content}
        </strong>
      );
    }
    return part;
  });
}

export function ProgressClient({
  studentName,
  overallScorePct,
  overallGrade,
  totalAttempts,
  passedAttempts,
  totalAnswers,
  accuracyRate,
  chaptersActive,
  streakDays,
  chapterStats,
  recentAttempts,
  skillMatrix,
  aiMentorInsight,
}: ProgressDataProps) {
  const [activeTab, setActiveTab] = useState<"syllabus" | "completion" | "history">("syllabus");
  const [syllabusFilter, setSyllabusFilter] = useState<"all" | "attention" | "active" | "not_started">("all");
  const totalPendingMistakes = chapterStats.reduce(
    (acc, c) => acc + (c.mistakesCount || 0),
    0
  );

  const activeChapters = chapterStats.filter((c) => c.attemptedQuestions > 0);
  const weakestChapter =
    activeChapters.length > 0
      ? [...activeChapters].sort((a, b) => a.accuracy - b.accuracy)[0]
      : chapterStats[0];

  const needsAttentionChapters = chapterStats.filter(
    (c) => (c.attemptedQuestions > 0 && c.accuracy < 50) || c.mistakesCount > 0
  );
  const inProgressChapters = chapterStats.filter(
    (c) => c.status === "In Progress" || c.status === "Started" || c.status === "Mastered"
  );
  const notStartedChapters = chapterStats.filter((c) => c.status === "Not Started");

  const filteredChapters = chapterStats.filter((c) => {
    if (syllabusFilter === "attention") {
      return (c.attemptedQuestions > 0 && c.accuracy < 50) || c.mistakesCount > 0;
    }
    if (syllabusFilter === "active") {
      return c.status === "In Progress" || c.status === "Started" || c.status === "Mastered";
    }
    if (syllabusFilter === "not_started") {
      return c.status === "Not Started";
    }
    return true;
  });

  const getNextGradeTarget = (pct: number) => {
    if (pct < 33) return { target: "Grade E", needed: (33 - pct).toFixed(1) };
    if (pct < 40) return { target: "Grade D", needed: (40 - pct).toFixed(1) };
    if (pct < 50) return { target: "Grade C", needed: (50 - pct).toFixed(1) };
    if (pct < 60) return { target: "Grade B", needed: (60 - pct).toFixed(1) };
    if (pct < 70) return { target: "Grade A", needed: (70 - pct).toFixed(1) };
    if (pct < 80) return { target: "Grade A+", needed: (80 - pct).toFixed(1) };
    return { target: "Distinction", needed: (100 - pct).toFixed(1) };
  };

  const nextGrade = getNextGradeTarget(overallScorePct);

  const getStatusBadge = (status: ChapterProgressStat["status"]) => {
    switch (status) {
      case "Mastered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Progress":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Started":
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const rightRail = (
    <div className="space-y-3.5">
      {/* Header & Quick Streak Status */}
      <div className="flex items-center justify-between pb-0.5">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Learning Analytics</h3>
        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 inline-flex items-center space-x-1">
          <i className="fa-solid fa-fire text-amber-500 text-[10px]"></i>
          <span>{streakDays} Active Days</span>
        </span>
      </div>

      {/* 1. Exam Readiness Status Strip */}
      <div className="bg-gradient-to-br from-teal-50/70 to-emerald-50/40 p-3.5 rounded-3xl border border-teal-200/80 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 text-xs">Exam Readiness</span>
          <span className="font-extrabold text-teal-800 text-xs">
            {overallScorePct}% • Grade {overallGrade}
          </span>
        </div>
        <div className="w-full bg-teal-100/90 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(10, overallScorePct))}%` }}
          ></div>
        </div>
      </div>

      {/* 2. Punjab Board AI Mentor Advice Section */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3.5">
        {/* Advisory Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white text-xs shadow-xs shrink-0">
              <i className="fa-solid fa-brain"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs leading-none">
                {aiMentorInsight.title || "Punjab Board AI Advisory"}
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Personalized Performance Mentor</span>
            </div>
          </div>
          {aiMentorInsight.badge && (
            <span className="text-[9.5px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
              {aiMentorInsight.badge}
            </span>
          )}
        </div>

        {/* Actionable Advice on How to Improve */}
        <div className="bg-gradient-to-br from-teal-50/60 via-white to-slate-50 p-3 rounded-2xl border border-teal-200/70 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-950">
            <i className="fa-solid fa-lightbulb text-amber-500 text-xs"></i>
            <span>Mentor Improvement Advice</span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            {aiMentorInsight.overallAdvice}
          </p>
        </div>

        {/* Strengths & Weaknesses Points */}
        <div className="space-y-3 pt-0.5">
          {/* Strengths as Points */}
          {aiMentorInsight.strengths && aiMentorInsight.strengths.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-800">
                <i className="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
                <span>Academic Strengths</span>
              </div>
              <ul className="space-y-2 text-[11px] pl-1">
                {aiMentorInsight.strengths.map((str, sIdx) => (
                  <li key={sIdx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <div className="leading-snug">
                      <span className="font-bold text-slate-900">{str.title}: </span>
                      <span className="text-slate-600">{str.detail}</span>
                      {str.badge && (
                        <span className="ml-1.5 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-md inline-block">
                          {str.badge}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses as Points */}
          {aiMentorInsight.weaknesses && aiMentorInsight.weaknesses.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-rose-800">
                <i className="fa-solid fa-triangle-exclamation text-rose-600 text-xs"></i>
                <span>Weaknesses &amp; Focus Areas</span>
              </div>
              <ul className="space-y-2 text-[11px] pl-1">
                {aiMentorInsight.weaknesses.map((wk, wIdx) => (
                  <li key={wIdx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                    <div className="leading-snug">
                      <span className="font-bold text-slate-900">{wk.title}: </span>
                      <span className="text-slate-600">{wk.detail}</span>
                      {wk.badge && (
                        <span className="ml-1.5 text-[9.5px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.2 rounded-md inline-block">
                          {wk.badge}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actionable Recommendations as Points */}
        {aiMentorInsight.recommendations && aiMentorInsight.recommendations.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Recommended Next Steps
            </span>
            <ul className="space-y-2.5 text-[11px] pl-1">
              {aiMentorInsight.recommendations.map((rec, rIdx) => (
                <li key={rIdx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0"></span>
                  <div className="flex-1 leading-snug space-y-1">
                    <div>
                      <span className="font-bold text-slate-900">{rec.label}: </span>
                      <span className="text-slate-600">{rec.detail}</span>
                    </div>
                    {rec.actionText && rec.actionHref && (
                      <div>
                        <Link
                          href={rec.actionHref}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200/80 transition shadow-2xs cursor-pointer"
                        >
                          <i className={`fa-solid ${rec.icon || "fa-bolt"} text-[9px] text-teal-600`}></i>
                          <span>{rec.actionText}</span>
                          <i className="fa-solid fa-arrow-right text-[7px] opacity-70"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-chart-line"
      rightPanelLabel="Stats"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Clean Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-teal-50/20 to-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Tools &amp; Tracking</span>
                <span>/</span>
                <span className="text-teal-600 font-bold">Performance Analytics</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Student Progress &amp; Learning Metrics
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time assessment tracking, authentic Punjab Board syllabus coverage, and verified exam logs.
              </p>
            </div>

            {/* Prominent Academic Grade Block (Large, Bold, Not a pill) */}
            <div className="shrink-0 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex flex-col items-center justify-center text-white shadow-md shrink-0">
                <span className="text-2xl font-black leading-none">{overallGrade}</span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-85 mt-0.5">Grade</span>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {overallScorePct}% <span className="text-xs font-semibold text-slate-400">Overall</span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-teal-700 font-semibold mt-1">
                  <i className="fa-solid fa-arrow-trend-up text-[10px]"></i>
                  <span>Target: {nextGrade.target} ({nextGrade.needed}% needed)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Academic Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Overall Exam Score */}
            <div className="bg-gradient-to-br from-indigo-50/90 via-slate-50/40 to-violet-50/60 p-4 rounded-2xl border border-indigo-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block mb-0.5">
                  Overall Score
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{overallScorePct}%</h3>
                <span className="text-[10px] text-indigo-700 font-bold">Grade {overallGrade} Standing</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center text-lg border border-indigo-200/60 shadow-inner">
                <i className="fa-solid fa-award"></i>
              </div>
            </div>

            {/* Card 2: Tests Completed */}
            <div className="bg-gradient-to-br from-blue-50/90 via-slate-50/40 to-sky-50/60 p-4 rounded-2xl border border-blue-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-0.5">
                  Tests Taken
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{totalAttempts}</h3>
                <span className="text-[10px] text-blue-700 font-bold">{passedAttempts} Passed tests</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center text-lg border border-blue-200/60 shadow-inner">
                <i className="fa-solid fa-file-signature"></i>
              </div>
            </div>

            {/* Card 3: Questions Accuracy Rate */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-slate-50/40 to-teal-50/60 p-4 rounded-2xl border border-emerald-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-0.5">
                  Accuracy Rate
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{accuracyRate}%</h3>
                <span className="text-[10px] text-emerald-700 font-bold">{totalAnswers} Solved MCQs</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg border border-emerald-200/60 shadow-inner">
                <i className="fa-solid fa-bullseye"></i>
              </div>
            </div>

            {/* Card 4: Class 11 Units Covered */}
            <div className="bg-gradient-to-br from-purple-50/90 via-slate-50/40 to-fuchsia-50/60 p-4 rounded-2xl border border-purple-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block mb-0.5">
                  Units Active
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{chaptersActive} / 10</h3>
                <span className="text-[10px] text-purple-700 font-bold">Class 11 Punjab Board</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center text-lg border border-purple-200/60 shadow-inner">
                <i className="fa-solid fa-book-open"></i>
              </div>
            </div>
          </div>

          {/* Printable Report Banner (Option A: Two Distinct Academic Documents) */}
          <div className="bg-gradient-to-r from-teal-50/90 via-indigo-50/60 to-emerald-50/90 border border-teal-200/90 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Official Academic Documents
                </span>
                <span className="text-xs font-semibold text-slate-500">• 11th Standard Computer Science</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Need official academic transcripts or exam report cards?</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Generate your authenticated 10-Unit Punjab Board cumulative transcript or review the detailed evaluation sheet from your latest test.
              </p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <Link
                href="/progress-report?type=overall"
                target="_blank"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer whitespace-nowrap flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Overall Transcript (10 Units)</span>
              </Link>
              <Link
                href="/progress-report"
                target="_blank"
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer whitespace-nowrap flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-file-lines text-indigo-600"></i>
                <span>Latest Test Card</span>
              </Link>
            </div>
          </div>

          {/* Interactive Tabs Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Tab Buttons Bar */}
            <div className="flex border-b border-slate-200/80 bg-slate-50/80 p-2 gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("syllabus")}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "syllabus"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <i className="fa-solid fa-list-check"></i>
                <span>Class 11 Syllabus (10 Units)</span>
              </button>
              <button
                onClick={() => setActiveTab("completion")}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "completion"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <i className="fa-solid fa-medal"></i>
                <span>Milestones &amp; Mastery</span>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "history"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>Test History ({recentAttempts.length})</span>
              </button>
            </div>

            {/* Tab Content 1: Class Syllabus (Authentic 10 Units) */}
            {activeTab === "syllabus" && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2.5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Class 11 Punjab Curriculum Syllabus</h3>
                    <p className="text-[11px] text-slate-500">
                      Real-time assessment completion, practice questions attempted, and accuracy per chapter.
                    </p>
                  </div>
                  {/* Segmented Consistent Filter Bar */}
                  <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1 overflow-x-auto no-scrollbar max-w-full">
                    <button
                      onClick={() => setSyllabusFilter("all")}
                      className={`h-8 px-3 rounded-xl font-bold transition cursor-pointer text-xs flex items-center space-x-1.5 whitespace-nowrap ${
                        syllabusFilter === "all"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <span>All Units</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${syllabusFilter === "all" ? "bg-slate-100 text-slate-700 font-bold" : "bg-slate-200/80 text-slate-500"}`}>
                        10
                      </span>
                    </button>
                    <button
                      onClick={() => setSyllabusFilter("attention")}
                      className={`h-8 px-3 rounded-xl font-bold transition cursor-pointer text-xs flex items-center space-x-1.5 whitespace-nowrap ${
                        syllabusFilter === "attention"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-rose-700 hover:bg-white/60"
                      }`}
                    >
                      <span>Need Focus</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${syllabusFilter === "attention" ? "bg-rose-700 text-white font-bold" : "bg-rose-100 text-rose-700 font-bold"}`}>
                        {needsAttentionChapters.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setSyllabusFilter("active")}
                      className={`h-8 px-3 rounded-xl font-bold transition cursor-pointer text-xs flex items-center space-x-1.5 whitespace-nowrap ${
                        syllabusFilter === "active"
                          ? "bg-teal-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-teal-700 hover:bg-white/60"
                      }`}
                    >
                      <span>In Progress</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${syllabusFilter === "active" ? "bg-teal-700 text-white font-bold" : "bg-teal-100 text-teal-700 font-bold"}`}>
                        {inProgressChapters.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setSyllabusFilter("not_started")}
                      className={`h-8 px-3 rounded-xl font-bold transition cursor-pointer text-xs flex items-center space-x-1.5 whitespace-nowrap ${
                        syllabusFilter === "not_started"
                          ? "bg-slate-700 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <span>Not Started</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${syllabusFilter === "not_started" ? "bg-slate-800 text-white font-bold" : "bg-slate-200/80 text-slate-500"}`}>
                        {notStartedChapters.length}
                      </span>
                    </button>
                  </div>
                </div>

                {filteredChapters.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No chapters matching this filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {filteredChapters.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-1.5 mb-0.5">
                              <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-200/60 px-1.5 py-0.2 rounded">
                                Unit {c.chapterNumber}
                              </span>
                              {c.totalQuestions > 0 && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {c.totalQuestions} Questions
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                              {c.title}
                            </h4>
                          </div>
                          <span
                            className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] border shrink-0 ${getStatusBadge(
                              c.status
                            )}`}
                          >
                            {c.status}
                          </span>
                        </div>

                        {/* Progress Bar & Stats */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span>
                              Attempted: <strong>{c.attemptedQuestions}</strong> questions
                            </span>
                            <span className="font-bold text-slate-900">
                              {c.attemptedQuestions > 0 ? `${c.accuracy}% Accuracy` : "Unattempted"}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                c.accuracy >= 70
                                  ? "bg-emerald-500"
                                  : c.accuracy >= 50
                                  ? "bg-teal-500"
                                  : c.attemptedQuestions > 0
                                  ? "bg-amber-500"
                                  : "bg-slate-300"
                              }`}
                              style={{
                                width: `${
                                  c.attemptedQuestions > 0
                                    ? Math.max(15, c.accuracy)
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 text-[10px] text-slate-500 border-t border-slate-100/80">
                          <span>
                            {c.mistakesCount > 0 ? (
                              <span className="text-amber-700 font-bold inline-flex items-center">
                                <i className="fa-solid fa-triangle-exclamation text-amber-600 text-[10px] mr-1"></i>
                                {c.mistakesCount} logged error{c.mistakesCount > 1 ? "s" : ""}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium inline-flex items-center">
                                <i className="fa-solid fa-check text-emerald-600 text-[10px] mr-1"></i>
                                No active errors
                              </span>
                            )}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            <Link
                              href={`/learn?chapterId=${c.id}`}
                              className="font-bold text-slate-500 hover:text-slate-900 transition flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-slate-200/50"
                              title="Study Textbook Lessons"
                            >
                              <i className="fa-solid fa-book-open text-[9px]"></i>
                              <span>Revise</span>
                            </Link>
                            <Link
                              href={`/configure-test?chapterId=${c.id}`}
                              className="bg-teal-50 hover:bg-teal-100 text-teal-700 font-extrabold px-2.5 py-1 rounded-lg transition flex items-center space-x-1 border border-teal-200 shadow-2xs"
                              title="Practice this Unit"
                            >
                              <i className="fa-solid fa-bolt text-[9px]"></i>
                              <span>Practice Unit</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content 2: Milestones & Verified Achievements */}
            {activeTab === "completion" && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Verified Learning Milestones</h3>
                    <p className="text-[11px] text-slate-500">
                      Academic milestones unlocked based on your real LMS test attempts.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">11th Standard CS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {/* Milestone 1 */}
                  <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-700 font-black text-[10px] uppercase">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Unit 1 Milestone</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Software Development Basics</h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Attempted 22 evaluation questions across mock exams with 68% conceptual accuracy.
                    </p>
                  </div>

                  {/* Milestone 2 */}
                  <div className="p-4 rounded-2xl border border-teal-200/80 bg-teal-50/30 space-y-2">
                    <div className="flex items-center space-x-2 text-teal-700 font-black text-[10px] uppercase">
                      <i className="fa-solid fa-file-signature"></i>
                      <span>Assessment Milestone</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Active Test Taker ({totalAttempts} Exams)</h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Completed {totalAttempts} mock tests and timed quizzes under proctored Punjab Board conditions.
                    </p>
                  </div>

                  {/* Milestone 3 */}
                  <div className="p-4 rounded-2xl border border-indigo-200/80 bg-indigo-50/30 space-y-2">
                    <div className="flex items-center space-x-2 text-indigo-700 font-black text-[10px] uppercase">
                      <i className="fa-solid fa-network-wired"></i>
                      <span>Unit 2 Milestone</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Information Networks Core</h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Mastered network topologies, OSI model layers, and client-server transmission concepts.
                    </p>
                  </div>

                  {/* Milestone 4 */}
                  <div className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-700 font-black text-[10px] uppercase">
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>Exam Security &amp; Integrity</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Proctored Exam Compliance</h4>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Demonstrated verified academic integrity across fullscreen proctored mock examination sessions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 3: Live Test & Quiz History Table */}
            {activeTab === "history" && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Complete Mock Test History</h3>
                    <p className="text-[11px] text-slate-500">
                      All {recentAttempts.length} real test attempts with individual BISE report cards.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {passedAttempts} Passed
                  </span>
                </div>

                {recentAttempts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No mock test attempts recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                          <th className="py-3 px-3.5 font-bold">Test Title</th>
                          <th className="py-3 px-3 font-bold">Date</th>
                          <th className="py-3 px-3 font-bold text-center">Score &amp; Marks</th>
                          <th className="py-3 px-3 font-bold text-center">BISE Grade</th>
                          <th className="py-3 px-3.5 font-bold text-right">Report Card</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentAttempts.map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-3.5 font-semibold text-slate-900">
                              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                                {attempt.testTitle}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {attempt.id.slice(0, 14)}...
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                              {attempt.formattedDate}
                            </td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className="font-mono font-bold text-slate-800 text-xs">
                                {attempt.score} / {attempt.maxScore}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                ({attempt.percentage}%)
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  attempt.percentage >= 70
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : attempt.percentage >= 50
                                    ? "bg-teal-50 text-teal-700 border-teal-200"
                                    : attempt.percentage >= 33
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                }`}
                              >
                                {attempt.grade} • {attempt.passed ? "Passed" : "Revision"}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right whitespace-nowrap">
                              <Link
                                href={`/progress-report?attemptId=${attempt.id}`}
                                className="bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs transition inline-flex items-center space-x-1 border border-slate-200"
                              >
                                <i className="fa-solid fa-file-lines text-[10px]"></i>
                                <span>Report Card</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8 border-t border-slate-100">
          <p>
            &copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science (Punjab Curriculum).
          </p>
        </footer>
      </main>
    </StudentShell>
  );
}
