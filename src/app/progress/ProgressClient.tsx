"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export function ProgressClient() {
  const [activeTab, setActiveTab] = useState<"syllabus" | "completion" | "history">("syllabus");

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Learning Streak</h3>
        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
          🔥 12 Days
        </span>
      </div>

      {/* Streak Card */}
      <div className="bg-gradient-to-br from-teal-50/60 to-emerald-50/30 p-4 rounded-3xl border border-teal-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Consistency Goal</span>
          <span className="text-xs font-bold text-teal-700">85% Achieved</span>
        </div>
        <div className="w-full bg-teal-100 h-2 rounded-full overflow-hidden">
          <div className="bg-teal-600 h-full rounded-full" style={{ width: "85%" }}></div>
        </div>
        <p className="text-[11px] text-slate-500">You have logged in for 12 consecutive days. Keep it up, Uzair!</p>
      </div>

      {/* Skill Matrix Breakdown */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-3 text-xs">
        <h4 className="font-bold text-slate-900">Skill Proficiency Matrix</h4>
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>C++ Syntax & Coding</span>
              <span className="text-emerald-600 font-bold">92%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: "92%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Theory & Concepts</span>
              <span className="text-emerald-600 font-bold">88%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: "88%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Networking & Security</span>
              <span className="text-teal-700 font-bold">80%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Note */}
      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-2">
        <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs">
          <i className="fa-solid fa-robot"></i>
          <span>AI Mentor Insight</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Your coding consistency is exceptional. Try solving 5 more pointer-based questions in Unit 3 to reach 95%
          mastery.
        </p>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Tools & Tracking</span>
                <span>/</span>
                <span className="text-teal-600">Performance Analytics</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Student Progress & Learning Metrics
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-teal-100 text-teal-800 font-bold text-xs px-3.5 py-2 rounded-xl">
                Overall Grade: A+
              </span>
            </div>
          </div>

          {/* 4 Info Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Overall Score */}
            <div className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Overall Score
                </span>
                <h3 className="text-2xl font-bold text-slate-900">88.5%</h3>
                <span className="text-[11px] text-emerald-600 font-medium">+4.2% this week</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg shadow-inner border border-teal-100">
                <i className="fa-solid fa-award"></i>
              </div>
            </div>

            {/* Card 2: Chapters Completed */}
            <div className="bg-gradient-to-br from-slate-50 via-teal-50/30 to-white p-5 rounded-3xl border border-teal-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block mb-1">
                  Chapters Done
                </span>
                <h3 className="text-2xl font-bold text-teal-700">12 / 16</h3>
                <span className="text-[11px] text-teal-600 font-medium">75% syllabus complete</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-book-open"></i>
              </div>
            </div>

            {/* Card 3: Study Hours */}
            <div className="bg-gradient-to-br from-slate-50 via-sky-50/30 to-white p-5 rounded-3xl border border-sky-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-1">
                  Study Hours
                </span>
                <h3 className="text-2xl font-bold text-sky-700">48.5 hrs</h3>
                <span className="text-[11px] text-sky-600 font-medium">Logged on LMS</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-clock"></i>
              </div>
            </div>

            {/* Card 4: Accuracy Rate */}
            <div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Accuracy Rate
                </span>
                <h3 className="text-2xl font-bold text-emerald-700">84.2%</h3>
                <span className="text-[11px] text-emerald-600 font-medium">Quiz & test average</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-bullseye"></i>
              </div>
            </div>
          </div>

          {/* Printable Report Banner */}
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-indigo-900 text-sm">Need a printable official transcript?</h3>
              <p className="text-xs text-indigo-700 mt-0.5">
                Generate a formal PDF-ready student performance report with complete breakdown.
              </p>
            </div>
            <Link
              href="/progress-report"
              target="_blank"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              View Progress Report 📄
            </Link>
          </div>

          {/* Interactive Tabs Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Tab Buttons Bar */}
            <div className="flex border-b border-slate-200/80 bg-slate-50/80 p-2 gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("syllabus")}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  activeTab === "syllabus"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <i className="fa-solid fa-list-check"></i>
                <span>Syllabus Breakdown</span>
              </button>
              <button
                onClick={() => setActiveTab("completion")}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  activeTab === "completion"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <i className="fa-solid fa-circle-check"></i>
                <span>Completion Details</span>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                  activeTab === "history"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>Test History</span>
              </button>
            </div>

            {/* Tab Content 1: Syllabus Breakdown */}
            {activeTab === "syllabus" && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Class Syllabus & Unit-wise Status</h3>
                  <span className="text-xs text-slate-400 font-semibold">11th Standard CS</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Unit 1: Basics of Information Technology</h4>
                      <p className="text-[10px] text-slate-500">Hardware, Software, Memory & Operating Systems</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-xl text-[11px]">
                      Completed (100%)
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Unit 2: Computer Networks & Data Security</h4>
                      <p className="text-[10px] text-slate-500">Topologies, Protocols, TCP/IP & Encryption</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-xl text-[11px]">
                      Mastered (90%)
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Unit 3: Object-Oriented Programming in C++</h4>
                      <p className="text-[10px] text-slate-500">Classes, Objects, Inheritance & Polymorphism</p>
                    </div>
                    <span className="bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-xl text-[11px]">
                      In Progress (75%)
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Unit 4: Data Structures & File Handling</h4>
                      <p className="text-[10px] text-slate-500">Arrays, Stacks, Queues & Binary Files</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-xl text-[11px]">
                      Started (35%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 2: Completion Details */}
            {activeTab === "completion" && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Milestone Completion Details</h3>
                  <span className="text-xs text-slate-400 font-semibold">Verified Records</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-teal-600 block">Unit 1 Certification</span>
                    <h4 className="font-bold text-slate-900">Information Technology Basics</h4>
                    <p className="text-slate-500 text-[11px]">Completed on August 12, 2026 with 94% score in final quiz.</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-teal-600 block">Unit 2 Certification</span>
                    <h4 className="font-bold text-slate-900">Networks & Security</h4>
                    <p className="text-slate-500 text-[11px]">Completed on August 28, 2026 with 89% score in final quiz.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 3: Test History */}
            {activeTab === "history" && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Test & Quiz History</h3>
                  <span className="text-xs text-slate-400 font-semibold">Last 30 Days</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                        <th className="py-3 px-3 font-bold">Test Title</th>
                        <th className="py-3 px-3 font-bold">Date</th>
                        <th className="py-3 px-3 font-bold">Marks Obtained</th>
                        <th className="py-3 px-3 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-semibold text-slate-900">Unit 3 Quiz #2 (Polymorphism)</td>
                        <td className="py-3 px-3 text-slate-500">Sep 16, 2026</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">18 / 20</td>
                        <td className="py-3 px-3 text-right">
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            Passed
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-semibold text-slate-900">Full Mock Exam (Model 2026)</td>
                        <td className="py-3 px-3 text-slate-500">Sep 10, 2026</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">68 / 75</td>
                        <td className="py-3 px-3 text-right">
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            A+ Grade
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-semibold text-slate-900">Unit 2 Practice Test</td>
                        <td className="py-3 px-3 text-slate-500">Sep 04, 2026</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">27 / 30</td>
                        <td className="py-3 px-3 text-right">
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            Passed
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
