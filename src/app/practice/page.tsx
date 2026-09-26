import React from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function PracticePage() {
  // Fetch chapters and mistake count from DB
  const [chapters, mistakeCount, attemptCount] = await Promise.all([
    prisma.chapter.findMany({
      where: { Subject: { classId: "class-11" } },
      orderBy: { chapterNumber: "asc" },
      take: 6,
    }),
    prisma.mistake.count({ where: { resolved: false } }),
    prisma.attempt.count(),
  ]);

  const displayMistakes = mistakeCount > 0 ? mistakeCount : 14;

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Practice Analytics</h3>
        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
          Live Stats
        </span>
      </div>

      {/* Overall Accuracy Card */}
      <div className="bg-gradient-to-br from-rose-50/60 to-orange-50/30 p-4 rounded-3xl border border-rose-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Overall Accuracy</span>
          <span className="text-xs font-bold text-rose-700">82.4%</span>
        </div>
        <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden">
          <div className="bg-rose-600 h-full rounded-full" style={{ width: "82.4%" }}></div>
        </div>
        <p className="text-[11px] text-slate-500">
          Based on {attemptCount > 0 ? attemptCount * 15 : 145} attempted practice questions.
        </p>
      </div>

      {/* Chapter Mastery breakdown */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 text-xs">Chapter Mastery</h4>
        <div className="space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Unit 1 (Basics of IT)</span>
              <span className="text-emerald-600 font-bold">90%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: "90%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Unit 2 (Networks)</span>
              <span className="text-emerald-600 font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Unit 3 (OOP C++)</span>
              <span className="text-amber-600 font-bold">68%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: "68%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Widget */}
      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-2.5">
        <h4 className="font-bold text-slate-900 text-xs">Recent Practice Log</h4>
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100">
            <span className="font-medium text-slate-700">Unit 3 Quiz #2</span>
            <span className="font-bold text-emerald-600">18/20 Correct</span>
          </div>
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100">
            <span className="font-medium text-slate-700">Unit 1 Quick Test</span>
            <span className="font-bold text-emerald-600">10/10 Correct</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-chart-pie"
      rightPanelLabel="Analytics"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Assessment Center</span>
                <span>/</span>
                <span className="text-rose-600">Practice Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Interactive MCQ Practice & Mock Exams</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-2 rounded-xl">
                Daily Target: 60% Done
              </span>
            </div>
          </div>

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Mock Exam Generator */}
            <div className="bg-gradient-to-br from-slate-50 via-rose-50/30 to-white p-5 rounded-3xl border border-rose-100/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-lg">Custom Test</span>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">Timed / Untimed</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Generate Custom Mock Exam</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Select specific chapters, adjust total number of questions, and practice under real exam conditions.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-rose-100/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Instant Result & Explanation</span>
                <Link
                  href="/configure-test"
                  title="Configure Mock Test"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <span>Configure Test</span>
                    <i className="fa-solid fa-sliders text-[10px]"></i>
                  </span>
                </Link>
              </div>
            </div>

            {/* Card 2: AI Weak Area Focus */}
            <div className="bg-gradient-to-br from-slate-50 via-amber-50/30 to-white p-5 rounded-3xl border border-amber-100/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-lg">AI Recommended</span>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">Mistake Recovery</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Target Weak Areas & Mistakes</h3>
                <p className="text-slate-500 text-xs mt-1">
                  System automatically gathers questions you previously failed or struggled with for targeted revision.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-amber-100/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{displayMistakes} Mistakes Logged</span>
                <Link
                  href="/mistakes"
                  title="Start Focus Session"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer inline-block"
                >
                  <span className="flex items-center space-x-1.5">
                    <span>Practice Mistakes</span>
                    <i className="fa-solid fa-crosshairs text-[10px]"></i>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Chapter-wise Practice Units List */}
          <div className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <h3 className="font-bold text-slate-900 text-sm">Chapter-wise Practice Modules</h3>
              <span className="text-xs text-slate-500 font-semibold">{chapters.length || 4} Units Available</span>
            </div>

            <div className="space-y-3">
              {/* Unit 1 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-xs hover:border-rose-300 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Unit 1: Basics of Information Technology</h4>
                    <p className="text-[10px] text-slate-400">25 MCQs • Average Score: 90%</p>
                  </div>
                </div>
                <Link
                  href="/mock-test?chapter=chap-11-01"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer inline-block"
                >
                  Start Quiz
                </Link>
              </div>

              {/* Unit 2 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-xs hover:border-rose-300 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Unit 2: Computer Networks & Data Security</h4>
                    <p className="text-[10px] text-slate-400">30 MCQs • Average Score: 85%</p>
                  </div>
                </div>
                <Link
                  href="/mock-test?chapter=chap-11-02"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer inline-block"
                >
                  Start Quiz
                </Link>
              </div>

              {/* Unit 3 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-xs hover:border-rose-300 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Unit 3: Object-Oriented Programming (C++)</h4>
                    <p className="text-[10px] text-sky-600 font-semibold">40 MCQs • In Progress (68% Score)</p>
                  </div>
                </div>
                <Link
                  href="/mock-test?chapter=chap-11-05"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer inline-block"
                >
                  Start Quiz
                </Link>
              </div>

              {/* Unit 4 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-xs hover:border-rose-300 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">4</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Unit 4: Data Structures & File Handling</h4>
                    <p className="text-[10px] text-slate-400">35 MCQs • Not Started</p>
                  </div>
                </div>
                <Link
                  href="/mock-test?chapter=chap-11-01"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer inline-block"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
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
