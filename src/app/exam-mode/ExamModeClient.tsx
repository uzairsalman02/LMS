"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentShell } from "@/components/layout/StudentShell";

export function ExamModeClient() {
  const router = useRouter();

  const [scope, setScope] = useState<"full" | "chapter">("full");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const handleStartExam = () => {
    const params = new URLSearchParams();
    params.set("mode", "formal");
    params.set("count", scope === "full" ? "20" : "15");
    params.set("time", "45");
    params.set("difficulty", difficulty);
    router.push(`/mock-test?${params.toString()}`);
  };

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Exam Readiness Score</h3>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          Pro Status
        </span>
      </div>

      {/* Readiness Gauge Widget */}
      <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/30 p-4 rounded-3xl border border-indigo-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Preparation Index</span>
          <span className="text-xs font-bold text-indigo-700">78% Ready</span>
        </div>
        <div className="w-full bg-indigo-100 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full" style={{ width: "78%" }}></div>
        </div>
        <p className="text-[11px] text-slate-500">
          You are fully prepared for objective papers. Focus more on subjective C++ code writing.
        </p>
      </div>

      {/* Formal Rules Card */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-2.5 text-xs">
        <h4 className="font-bold text-slate-900">Exam Mode Guidelines</h4>
        <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
          <li>Fullscreen mode will be enforced.</li>
          <li>Leaving the exam tab triggers warning logs.</li>
          <li>Automatic submission upon timer expiration.</li>
          <li>Detailed AI rubric evaluation after completion.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-shield-halved"
      rightPanelLabel="Readiness"
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
                <span className="text-indigo-600">Formal Exam Mode</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Official Board Exam Simulation Hub
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-100 text-indigo-700 font-bold text-xs px-3.5 py-2 rounded-xl">
                Secure Environment Active
              </span>
            </div>
          </div>

          {/* Simulation Scope Selector */}
          <div className="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <i className="fa-solid fa-sliders text-indigo-600"></i>
                <span>Simulation Scope & Type</span>
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600">Board Standard</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Syllabus Option */}
              <label
                onClick={() => setScope("full")}
                className={`flex items-center space-x-3 p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
                  scope === "full"
                    ? "border-2 border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="sim_scope"
                  checked={scope === "full"}
                  onChange={() => {}}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Full Syllabus Board Exam</span>
                  <span className="text-[10px] text-slate-500">75 Marks • Complete 11th Standard Course</span>
                </div>
              </label>

              {/* Chapter-wise Option */}
              <label
                onClick={() => setScope("chapter")}
                className={`flex items-center space-x-3 p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
                  scope === "chapter"
                    ? "border-2 border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="sim_scope"
                  checked={scope === "chapter"}
                  onChange={() => {}}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Chapter-wise Simulation</span>
                  <span className="text-[10px] text-slate-500">Select specific unit/chapter for exam test</span>
                </div>
              </label>
            </div>
          </div>

          {/* Difficulty Level Selector Option */}
          <div className="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <i className="fa-solid fa-gauge-high text-indigo-600"></i>
                <span>Select Difficulty Level</span>
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600">Adaptive</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setDifficulty("EASY")}
                className={`flex items-center space-x-3 p-3.5 rounded-2xl border cursor-pointer transition shadow-2xs ${
                  difficulty === "EASY"
                    ? "border-2 border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === "EASY"}
                  onChange={() => {}}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-800">Easy (Concept Check)</span>
              </label>
              <label
                onClick={() => setDifficulty("MEDIUM")}
                className={`flex items-center space-x-3 p-3.5 rounded-2xl border cursor-pointer transition shadow-2xs ${
                  difficulty === "MEDIUM"
                    ? "border-2 border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === "MEDIUM"}
                  onChange={() => {}}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-900">Board Standard (BISE)</span>
              </label>
              <label
                onClick={() => setDifficulty("HARD")}
                className={`flex items-center space-x-3 p-3.5 rounded-2xl border cursor-pointer transition shadow-2xs ${
                  difficulty === "HARD"
                    ? "border-2 border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 hover:border-indigo-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === "HARD"}
                  onChange={() => {}}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-800">Advanced / Analytical</span>
              </label>
            </div>
          </div>

          {/* Important Exam Tips & Guidelines Box */}
          <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-3xl space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
              <i className="fa-solid fa-lightbulb text-amber-500 text-sm"></i>
              <span>Important Exam Tips & Guidelines for Uzair</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
              <li className="flex items-center space-x-2 bg-white/60 p-2.5 rounded-xl border border-amber-100">
                <i className="fa-solid fa-check text-emerald-600 text-[10px]"></i>
                <span>Manage time wisely: Allocate 20 mins for objective section.</span>
              </li>
              <li className="flex items-center space-x-2 bg-white/60 p-2.5 rounded-xl border border-amber-100">
                <i className="fa-solid fa-check text-emerald-600 text-[10px]"></i>
                <span>Read C++ programming output snippets carefully before choosing.</span>
              </li>
              <li className="flex items-center space-x-2 bg-white/60 p-2.5 rounded-xl border border-amber-100">
                <i className="fa-solid fa-check text-emerald-600 text-[10px]"></i>
                <span>Use &quot;Mark for Review&quot; if stuck on complex definitions.</span>
              </li>
              <li className="flex items-center space-x-2 bg-white/60 p-2.5 rounded-xl border border-amber-100">
                <i className="fa-solid fa-check text-emerald-600 text-[10px]"></i>
                <span>Ensure stable internet connection to prevent session timeout.</span>
              </li>
            </ul>
          </div>

          {/* Start Exam Button Section */}
          <div className="pt-2">
            <button
              onClick={handleStartExam}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl text-sm transition shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <i className="fa-solid fa-play text-xs"></i>
              <span>Start Exam Now</span>
            </button>
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
