"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface MockQuestion {
  id: string;
  text: string;
  chapterTitle?: string;
  options: {
    id: string;
    text: string;
    order: number;
    isCorrect?: boolean;
  }[];
}

interface MockTestClientProps {
  questions: MockQuestion[];
  initialMinutes?: number;
  testTitle?: string;
}

export function MockTestClient({
  questions,
  initialMinutes = 30,
  testTitle = "Mock Exam Room",
}: MockTestClientProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [reviewFlags, setReviewFlags] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleMarkReviewAndNext = () => {
    if (currentQ) {
      setReviewFlags((prev) => ({ ...prev, [currentQ.id]: true }));
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      confirm("Are you sure you want to submit the exam and generate your official report?")
    ) {
      setIsSubmitting(true);
      try {
        await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: selectedAnswers,
            timeSpentSeconds: initialMinutes * 60 - secondsRemaining,
          }),
        });
      } catch (err) {
        console.warn("Failed to persist attempt:", err);
      }
      router.push("/progress-report");
    }
  };

  // Stats calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
  const unattemptedCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <div className="bg-white text-slate-800 font-sans antialiased flex flex-col min-h-screen relative">
      {/* Top Navigation Header Bar */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Corner */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-700 md:hidden focus:outline-none"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <div className="w-9 h-9 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-rose-500/20">
              CS
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                {testTitle}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Unit 1, 2, 3 Practice Test
              </span>
            </div>
          </div>

          {/* Center: Live Running Timer */}
          <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl text-rose-700 shadow-2xs">
            <i className="fa-solid fa-clock animate-pulse"></i>
            <span className="text-xs font-bold font-mono">
              Time Remaining: <span className="text-sm">{formatTimer(secondsRemaining)}</span>
            </span>
          </div>

          {/* Right Side: Submit Exam Button */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-check"></i>
              <span>Submit Exam</span>
            </button>
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-semibold text-slate-700 text-xs shadow-sm lg:hidden ml-1"
            >
              <i className="fa-solid fa-list-check"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out flex flex-col justify-between overflow-y-auto no-scrollbar border-r border-slate-100`}
        >
          <div className="p-4 space-y-5 pt-6">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Exam Navigation
              </p>
              <div className="space-y-1">
                <Link
                  href="/practice"
                  title="Exit Exam"
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium text-sm transition"
                >
                  <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
                  <span>Exit Exam Mode</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats inside Sidebar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Exam Status
              </p>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Answered:</span>
                <span className="font-bold text-emerald-600">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Marked for Review:</span>
                <span className="font-bold text-amber-600">{reviewCount}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Unattempted:</span>
                <span className="font-bold text-slate-500">{unattemptedCount}</span>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 hidden md:block">
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 p-3 rounded-2xl border border-indigo-100/60 shadow-sm">
              <p className="text-[11px] text-indigo-900 font-bold">Secure Test Environment</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Board Standard Compliance</p>
            </div>
          </div>
        </aside>

        {/* Mobile Left Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 z-30 md:hidden"
          ></div>
        )}

        {/* Main Content Area: Active Question Box */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
          {currentQ ? (
            <div className="max-w-3xl mx-auto space-y-6 w-full">
              {/* Question Progress Bar Header */}
              <div className="flex items-center justify-between bg-slate-50/80 p-4 rounded-3xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  {currentQ.chapterTitle || "Unit 1: Basics of IT"}
                </span>
              </div>

              {/* Active Question Container */}
              <div className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  Q{currentIndex + 1}: {currentQ.text}
                </h2>

                {/* Options Grid */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isChecked = selectedAnswers[currentQ.id] === opt.id;
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`flex items-center space-x-3 p-4 rounded-2xl border cursor-pointer transition shadow-2xs ${
                          isChecked
                            ? "border-2 border-rose-500 bg-rose-50/60"
                            : "border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQ.id}`}
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-rose-600 border-slate-300 focus:ring-rose-500"
                        />
                        <span
                          className={`text-xs sm:text-sm ${
                            isChecked
                              ? "font-bold text-rose-900"
                              : "font-semibold text-slate-700"
                          }`}
                        >
                          {letter}) {opt.text}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Question Bottom Control Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleMarkReviewAndNext}
                    className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-4 py-2.5 rounded-xl text-xs transition border border-amber-200 cursor-pointer"
                  >
                    <i className="fa-solid fa-flag mr-1"></i> Mark for Review & Next
                  </button>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="flex-1 sm:flex-none bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md shadow-rose-600/20 cursor-pointer"
                    >
                      {currentIndex === questions.length - 1 ? "Save" : "Save & Next"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-sm font-bold text-slate-500">No questions loaded for this test.</p>
            </div>
          )}

          {/* Center Copyright Footer */}
          <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
            <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
          </footer>
        </main>

        {/* Right Side Panel: Question Palette */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-80 bg-white transform ${
            isPaletteOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out px-5 pt-4 pb-5 overflow-y-auto no-scrollbar flex flex-col space-y-4 shadow-xl lg:shadow-none border-l border-slate-100`}
        >
          <div className="flex justify-between items-center lg:hidden pb-1">
            <span className="font-bold text-slate-800 text-sm">Question Palette</span>
            <button
              onClick={() => setIsPaletteOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Question Palette</h3>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
              {totalQuestions} MCQs
            </span>
          </div>

          {/* Palette Status Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 inline-block"></span>
              <span>Unattempted ({unattemptedCount})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span>Review ({reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
              <span>Current (Q{currentIndex + 1})</span>
            </div>
          </div>

          {/* Question Number Grid */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = !!selectedAnswers[q.id];
              const isReview = !!reviewFlags[q.id];

              let bgClass = "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200";
              if (isCurrent) {
                bgClass = "bg-rose-600 text-white font-bold shadow-md ring-2 ring-rose-300";
              } else if (isReview) {
                bgClass = "bg-amber-500 text-white font-bold shadow-2xs hover:opacity-90";
              } else if (isAnswered) {
                bgClass = "bg-emerald-500 text-white font-bold shadow-2xs hover:opacity-90";
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPaletteOpen(false);
                  }}
                  className={`w-11 h-11 rounded-xl text-xs flex items-center justify-center cursor-pointer transition ${bgClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Right Palette Backdrop */}
        {isPaletteOpen && (
          <div
            onClick={() => setIsPaletteOpen(false)}
            className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden"
          ></div>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40 flex justify-around py-3 px-2 shadow-lg">
        <Link href="/practice" title="Exit" className="flex flex-col items-center text-rose-600">
          <i className="fa-solid fa-right-from-bracket text-lg"></i>
          <span className="text-[10px] font-medium mt-1">Exit</span>
        </Link>
        <button onClick={handleSubmit} className="flex flex-col items-center text-emerald-600">
          <i className="fa-solid fa-check text-lg"></i>
          <span className="text-[10px] font-medium mt-1">Submit</span>
        </button>
        <button
          onClick={() => setIsPaletteOpen(true)}
          title="Palette"
          className="flex flex-col items-center text-slate-400"
        >
          <i className="fa-solid fa-list-check text-lg"></i>
          <span className="text-[10px] font-medium mt-1">Palette</span>
        </button>
      </nav>
    </div>
  );
}
