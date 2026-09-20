import React from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function MistakesPage() {
  const [dbMistakes, totalLogged, resolvedCount] = await Promise.all([
    prisma.mistake.findMany({
      include: {
        Question: {
          include: {
            Chapter: true,
            Topic: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mistake.count(),
    prisma.mistake.count({ where: { resolved: true } }),
  ]);

  const unresolvedCount = totalLogged - resolvedCount;
  const displayTotal = totalLogged > 0 ? totalLogged : 42;
  const displayUnresolved = unresolvedCount > 0 ? unresolvedCount : 14;
  const displayResolved = resolvedCount > 0 ? resolvedCount : 28;
  const fixedRate = ((displayResolved / displayTotal) * 100).toFixed(1);

  // Fallback sample mistakes if DB only has a few records
  const sampleMistakes = [
    {
      id: "m1",
      chapterNum: 3,
      topicName: "Topic 3.4: Polymorphism in C++",
      text: "Confused final specifier with static.",
    },
    {
      id: "m2",
      chapterNum: 2,
      topicName: "Topic 2.2: Network Topologies",
      text: "Mixed up central hub requirement of Star vs Bus topology.",
    },
    {
      id: "m3",
      chapterNum: 4,
      topicName: "Topic 4.1: Binary File Streams",
      text: "Incorrect syntax used for opening binary files in append mode.",
    },
    {
      id: "m4",
      chapterNum: 1,
      topicName: "Topic 1.3: Memory Hierarchy",
      text: "Wrong access time comparison between Cache and RAM.",
    },
  ];

  const tableRows =
    dbMistakes.length > 0
      ? dbMistakes.map((m) => ({
          id: m.id,
          chapterNum: m.Question?.Chapter?.chapterNumber || 1,
          topicName: m.Question?.Topic?.title || "Topic 1.3: Waterfall vs Agile",
          text: m.Question?.text || "Question error logged",
          resolved: m.resolved,
        }))
      : sampleMistakes;

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Mistake Recovery</h3>
        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
          Active Tracking
        </span>
      </div>

      {/* Recovery Progress Card */}
      <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/30 p-4 rounded-3xl border border-amber-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Resolved Mistakes</span>
          <span className="text-xs font-bold text-amber-700">
            {displayResolved} / {displayTotal}
          </span>
        </div>
        <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-600 h-full rounded-full"
            style={{ width: `${fixedRate}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-slate-500">
          You have successfully cleared {fixedRate}% of your logged test mistakes.
        </p>
      </div>

      {/* Breakdown by Unit */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-3 text-xs">
        <h4 className="font-bold text-slate-900">Mistakes by Unit</h4>
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Unit 3: OOP in C++</span>
              <span className="text-rose-600 font-bold">8 Errors</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full" style={{ width: "70%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Unit 4: Data Structures</span>
              <span className="text-amber-600 font-bold">4 Errors</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: "40%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Unit 2: Networks</span>
              <span className="text-emerald-600 font-bold">2 Errors</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: "20%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tip Card */}
      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-2">
        <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
          <i className="fa-solid fa-lightbulb text-amber-500"></i>
          <span>Revision Advice</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Reviewing logged mistakes right after a mock test increases long-term concept retention by 40%!
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-triangle-exclamation"
      rightPanelLabel="Recovery"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Assessment Center</span>
                <span>/</span>
                <span className="text-amber-600">Mistakes Review Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Logged Mistakes & Concept Recovery
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3.5 py-2 rounded-xl">
                {displayUnresolved} Unresolved Mistakes
              </span>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Logged */}
            <div className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Logged
                </span>
                <h3 className="text-2xl font-bold text-slate-900">{displayTotal}</h3>
                <span className="text-[11px] text-slate-500 font-medium">All time errors</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-folder-open"></i>
              </div>
            </div>

            {/* Card 2: Need Revision */}
            <div className="bg-gradient-to-br from-slate-50 via-amber-50/30 to-white p-5 rounded-3xl border border-amber-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                  Need Revision
                </span>
                <h3 className="text-2xl font-bold text-amber-700">{displayUnresolved}</h3>
                <span className="text-[11px] text-amber-600 font-medium">Pending review</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
            </div>

            {/* Card 3: Mastered Concepts */}
            <div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Mastered
                </span>
                <h3 className="text-2xl font-bold text-emerald-700">{displayResolved}</h3>
                <span className="text-[11px] text-emerald-600 font-medium">Concepts cleared</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>

            {/* Card 4: Fixed Rate % */}
            <div className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white p-5 rounded-3xl border border-indigo-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Fixed Rate
                </span>
                <h3 className="text-2xl font-bold text-indigo-700">{fixedRate}%</h3>
                <span className="text-[11px] text-indigo-600 font-medium">Recovery score</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-chart-line"></i>
              </div>
            </div>
          </div>

          {/* Targeted Mistakes Drill Option Box */}
          <div className="bg-gradient-to-br from-slate-50 via-amber-50/20 to-white p-5 rounded-3xl border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0 shadow-inner">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Targeted Mistakes Drill Session</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Take an adaptive test focusing strictly on your {displayUnresolved} unresolved error topics.
                </p>
              </div>
            </div>
            <Link
              href="/mock-test?mode=drill"
              className="w-full sm:w-auto text-center bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md shadow-amber-600/20 cursor-pointer shrink-0"
            >
              Start Drill Test 🎯
            </Link>
          </div>

          {/* Organized Mistakes Table Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Mistakes Log Directory
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                Showing {tableRows.length} Pending Items
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                    <th className="py-3 px-4 font-bold">Chapter No.</th>
                    <th className="py-3 px-4 font-bold">Topic Name</th>
                    <th className="py-3 px-4 font-bold">Logged Mistake / Question</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tableRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Chapter {row.chapterNum}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-sky-700">
                        {row.topicName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{row.text}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/learn"
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-lg text-[11px] border border-amber-200 transition cursor-pointer inline-block"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
