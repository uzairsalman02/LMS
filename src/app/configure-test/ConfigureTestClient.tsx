"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentShell } from "@/components/layout/StudentShell";

export interface ChapterOption {
  id: string;
  chapterNumber: number;
  title: string;
}

interface ConfigureTestClientProps {
  chapters: ChapterOption[];
}

export function ConfigureTestClient({ chapters }: ConfigureTestClientProps) {
  const router = useRouter();

  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(
    chapters.slice(0, 3).map((c) => c.id)
  );
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [timeLimit, setTimeLimit] = useState<number | null>(30); // minutes, null = no timer
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const toggleChapter = (id: string) => {
    if (selectedChapterIds.includes(id)) {
      if (selectedChapterIds.length > 1) {
        setSelectedChapterIds(selectedChapterIds.filter((chId) => chId !== id));
      }
    } else {
      setSelectedChapterIds([...selectedChapterIds, id]);
    }
  };

  const handleStart = () => {
    const params = new URLSearchParams();
    params.set("count", questionCount.toString());
    if (timeLimit) params.set("time", timeLimit.toString());
    params.set("difficulty", difficulty);
    params.set("chapters", selectedChapterIds.join(","));
    router.push(`/mock-test?${params.toString()}`);
  };

  // Selected chapters labels for blueprint
  const selectedUnitsText = chapters
    .filter((c) => selectedChapterIds.includes(c.id))
    .map((c) => `Unit ${c.chapterNumber}`)
    .join(", ");

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Test Blueprint</h3>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          Custom Setup
        </span>
      </div>

      <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/30 p-4 rounded-3xl border border-indigo-100 space-y-3 text-xs">
        <div className="flex justify-between pb-2 border-b border-indigo-100">
          <span className="text-slate-500 font-medium">Selected Units:</span>
          <span className="font-bold text-slate-800 text-right max-w-[150px] truncate">
            {selectedUnitsText || "Units 1, 2, 3"}
          </span>
        </div>
        <div className="flex justify-between pb-2 border-b border-indigo-100">
          <span className="text-slate-500 font-medium">Total Questions:</span>
          <span className="font-bold text-slate-800">{questionCount} MCQs</span>
        </div>
        <div className="flex justify-between pb-2 border-b border-indigo-100">
          <span className="text-slate-500 font-medium">Allocated Time:</span>
          <span className="font-bold text-slate-800">
            {timeLimit ? `${timeLimit} Minutes` : "Untimed"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 font-medium">Difficulty:</span>
          <span className="font-bold text-indigo-600">
            {difficulty === "EASY"
              ? "Concept Check"
              : difficulty === "MEDIUM"
              ? "Board Standard"
              : "Analytical (Hard)"}
          </span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl space-y-2">
        <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>Exam Instruction</span>
        </div>
        <p className="text-[11px] text-slate-700 leading-relaxed">
          Once you start the test, the timer cannot be paused. Make sure you have a stable connection.
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-list-check"
      rightPanelLabel="Blueprint"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <Link
                href="/practice"
                title="Back to Practice Hub"
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 mb-1 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
                <span>Back to Practice Hub</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Configure Custom Mock Exam</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-indigo-100">
                Setup Wizard
              </span>
            </div>
          </div>

          {/* Configuration Wizard Form */}
          <div className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            {/* Step 1: Chapters Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Select Chapters to Include
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chapters.map((ch) => {
                  const isChecked = selectedChapterIds.includes(ch.id);
                  return (
                    <label
                      key={ch.id}
                      onClick={() => toggleChapter(ch.id)}
                      className={`flex items-center space-x-3 p-3.5 rounded-2xl border bg-white cursor-pointer transition shadow-2xs ${
                        isChecked
                          ? "border-rose-400 bg-rose-50/20"
                          : "border-slate-200 hover:border-rose-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        {ch.title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Question Count */}
            <div className="space-y-3 pt-3 border-t border-slate-200/60">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 50].map((count) => {
                  const isSelected = questionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                        isSelected
                          ? "border-2 border-rose-500 bg-rose-50 text-rose-700"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-rose-500 hover:bg-rose-50"
                      }`}
                    >
                      {count} MCQs
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Time Limit */}
            <div className="space-y-3 pt-3 border-t border-slate-200/60">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Time Limit
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label
                  onClick={() => setTimeLimit(15)}
                  className={`flex items-center justify-center p-3 rounded-xl cursor-pointer text-xs font-semibold shadow-2xs ${
                    timeLimit === 15
                      ? "border-2 border-rose-500 bg-rose-50 font-bold text-rose-700"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="timer"
                    checked={timeLimit === 15}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  15 Minutes
                </label>
                <label
                  onClick={() => setTimeLimit(30)}
                  className={`flex items-center justify-center p-3 rounded-xl cursor-pointer text-xs font-semibold shadow-2xs ${
                    timeLimit === 30
                      ? "border-2 border-rose-500 bg-rose-50 font-bold text-rose-700"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="timer"
                    checked={timeLimit === 30}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  30 Minutes
                </label>
                <label
                  onClick={() => setTimeLimit(null)}
                  className={`flex items-center justify-center p-3 rounded-xl cursor-pointer text-xs font-semibold shadow-2xs ${
                    timeLimit === null
                      ? "border-2 border-rose-500 bg-rose-50 font-bold text-rose-700"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="timer"
                    checked={timeLimit === null}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  No Timer
                </label>
              </div>
            </div>

            {/* Step 4: Difficulty Level */}
            <div className="space-y-3 pt-3 border-t border-slate-200/60">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                4. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDifficulty("EASY")}
                  className={`p-3 rounded-xl text-xs font-bold shadow-2xs cursor-pointer ${
                    difficulty === "EASY"
                      ? "border-2 border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Easy (Concept check)
                </button>
                <button
                  type="button"
                  onClick={() => setDifficulty("MEDIUM")}
                  className={`p-3 rounded-xl text-xs font-bold shadow-2xs cursor-pointer ${
                    difficulty === "MEDIUM"
                      ? "border-2 border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Board Exam Standard
                </button>
                <button
                  type="button"
                  onClick={() => setDifficulty("HARD")}
                  className={`p-3 rounded-xl text-xs font-bold shadow-2xs cursor-pointer ${
                    difficulty === "HARD"
                      ? "border-2 border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Hard (Analytical)
                </button>
              </div>
            </div>

            {/* Launch CTA Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleStart}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition shadow-lg shadow-rose-600/20 cursor-pointer flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-play text-xs"></i>
                <span>Start Mock Exam Now</span>
              </button>
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
