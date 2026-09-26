"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface BookmarkItem {
  id: string;
  category: "question" | "theory" | "paper" | "snippet";
  categoryBadge: string;
  unit: string;
  title: string;
  date: string;
  description: string;
  link: string;
  linkLabel: string;
  questionData?: {
    id: string;
    text: string;
    explanation?: string | null;
    options: { id: string; text: string; isCorrect: boolean }[];
  };
}

interface BookmarkClientProps {
  initialBookmarks: BookmarkItem[];
  studentName?: string;
}

export function BookmarkClient({ initialBookmarks, studentName = "Uzair Salman" }: BookmarkClientProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(initialBookmarks);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick Practice Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Persistent removal of bookmark
  const removeBookmark = async (id: string) => {
    setDeletingId(id);
    // Optimistic UI update
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    try {
      await fetch(`/api/bookmarks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const matchesCategory = selectedCategory === "all" || b.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [bookmarks, selectedCategory, searchQuery]);

  const countQuestion = bookmarks.filter((b) => b.category === "question").length;
  const countTheory = bookmarks.filter((b) => b.category === "theory").length;
  const countPaper = bookmarks.filter((b) => b.category === "paper").length;

  // Bookmarked questions available for self-test
  const practiceQuestions = useMemo(() => {
    return bookmarks.filter((b) => b.questionData && b.questionData.options && b.questionData.options.length > 0);
  }, [bookmarks]);

  const currentPracticeQ = practiceQuestions[reviewIndex] || practiceQuestions[0];

  const handleStartReview = () => {
    setReviewIndex(0);
    setSelectedOptionId(null);
    setShowExplanation(false);
    setReviewModalOpen(true);
  };

  const handleNextQuestion = () => {
    if (reviewIndex < practiceQuestions.length - 1) {
      setReviewIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    } else {
      setReviewModalOpen(false);
    }
  };

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Folder Categories</h3>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          Organized
        </span>
      </div>

      {/* Folder Breakdown Card */}
      <div className="bg-gradient-to-br from-amber-50/70 via-slate-50 to-white p-4 rounded-3xl border border-amber-200/80 space-y-2.5 text-xs shadow-2xs">
        <div
          onClick={() => setSelectedCategory("all")}
          className={`flex justify-between items-center py-2 px-2.5 rounded-xl cursor-pointer transition ${
            selectedCategory === "all" ? "bg-amber-100/80 font-bold text-amber-900" : "hover:bg-white/80 text-slate-700"
          }`}
        >
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-layer-group text-amber-600 w-4 text-center"></i>
            <span>All Bookmarks</span>
          </span>
          <span className="font-bold text-slate-900 bg-white/80 px-2 py-0.5 rounded-md text-[11px] border border-amber-200/60">
            {bookmarks.length}
          </span>
        </div>

        <div
          onClick={() => setSelectedCategory("question")}
          className={`flex justify-between items-center py-2 px-2.5 rounded-xl cursor-pointer transition ${
            selectedCategory === "question" ? "bg-amber-100/80 font-bold text-amber-900" : "hover:bg-white/80 text-slate-700"
          }`}
        >
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-circle-question text-sky-600 w-4 text-center"></i>
            <span>Important Questions</span>
          </span>
          <span className="font-bold text-slate-900 bg-white/80 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
            {countQuestion}
          </span>
        </div>

        <div
          onClick={() => setSelectedCategory("theory")}
          className={`flex justify-between items-center py-2 px-2.5 rounded-xl cursor-pointer transition ${
            selectedCategory === "theory" ? "bg-amber-100/80 font-bold text-amber-900" : "hover:bg-white/80 text-slate-700"
          }`}
        >
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-book-open text-emerald-600 w-4 text-center"></i>
            <span>Chapter &amp; Theory Notes</span>
          </span>
          <span className="font-bold text-slate-900 bg-white/80 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
            {countTheory}
          </span>
        </div>

        <div
          onClick={() => setSelectedCategory("paper")}
          className={`flex justify-between items-center py-2 px-2.5 rounded-xl cursor-pointer transition ${
            selectedCategory === "paper" ? "bg-amber-100/80 font-bold text-amber-900" : "hover:bg-white/80 text-slate-700"
          }`}
        >
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-file-lines text-teal-600 w-4 text-center"></i>
            <span>Board Past Papers</span>
          </span>
          <span className="font-bold text-slate-900 bg-white/80 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
            {countPaper}
          </span>
        </div>
      </div>

      {/* Revision Quick Action */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-3xl shadow-2xs space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <h4 className="font-bold text-slate-900 text-xs">Quick Bookmark Review</h4>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Test your memory on bookmarked questions with an instant self-check session.
        </p>
        <button
          type="button"
          onClick={handleStartReview}
          disabled={practiceQuestions.length === 0}
          className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <i className="fa-solid fa-play text-[10px]"></i>
          <span>Practice Saved Questions ({practiceQuestions.length})</span>
        </button>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-bookmark"
      rightPanelLabel="Folders"
      pageTitle="Computer Science"
      badge="11th Standard"
      studentName={studentName}
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Clean Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-50/70 via-slate-50 to-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Tools &amp; Tracking</span>
                <span>/</span>
                <span className="text-amber-600 font-bold">Saved Bookmarks</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Your Saved Study Bookmarks
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly access marked board questions, high-yield theory notes, and past examination papers.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-2xs">
                <i className="fa-solid fa-bookmark text-amber-600 text-[11px]"></i>
                <span>{bookmarks.length} Items Saved</span>
              </span>
            </div>
          </div>

          {/* Controls: Category Filter Pills + Search Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({bookmarks.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("question")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === "question"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Questions ({countQuestion})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("theory")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === "theory"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Theory Notes ({countTheory})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("paper")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === "paper"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Past Papers ({countPaper})
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved bookmarks..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Bookmarked Items List Container */}
          <div className="space-y-3">
            {filteredBookmarks.map((b) => {
              const iconClass =
                b.category === "question"
                  ? "fa-circle-question text-sky-700 bg-sky-100 border-sky-200"
                  : b.category === "theory"
                  ? "fa-book-open text-emerald-700 bg-emerald-100 border-emerald-200"
                  : "fa-file-lines text-teal-700 bg-teal-100 border-teal-200";

              return (
                <div
                  key={b.id}
                  className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-amber-300 hover:shadow-xs"
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm shrink-0 border ${iconClass}`}
                    >
                      <i className={`fa-solid ${iconClass.split(" ")[0]}`}></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/70 font-bold text-[10px] rounded-md">
                          {b.categoryBadge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{b.unit}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 leading-snug">{b.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Saved on {b.date} • {b.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={b.link}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>{b.linkLabel}</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeBookmark(b.id)}
                      disabled={deletingId === b.id}
                      title="Remove Bookmark"
                      className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 p-2 rounded-xl text-xs transition shadow-2xs cursor-pointer disabled:opacity-50"
                      aria-label="Remove Bookmark"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredBookmarks.length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200/80 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                  <i className="fa-solid fa-bookmark"></i>
                </div>
                <h4 className="text-sm font-bold text-slate-800">No bookmarks found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? "No saved items match your search query."
                    : "You haven't bookmarked any items in this category yet. Bookmark questions during tests or topics in Learn mode."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
        </footer>
      </main>

      {/* Interactive Quick Practice Review Modal */}
      {reviewModalOpen && currentPracticeQ && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold border border-amber-200">
                  <i className="fa-solid fa-circle-question"></i>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm leading-tight">
                    Question {reviewIndex + 1} of {practiceQuestions.length}
                  </h3>
                  <span className="text-[10px] font-semibold text-amber-600">Bookmarked Practice Review</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer p-1"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-sm leading-snug">
                {currentPracticeQ.questionData?.text || currentPracticeQ.title}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentPracticeQ.questionData?.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800";

                  if (showExplanation) {
                    if (opt.isCorrect) {
                      optStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = "bg-rose-50 border-rose-300 text-rose-900";
                    }
                  } else if (isSelected) {
                    optStyle = "bg-amber-50 border-amber-400 text-amber-900 font-bold";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        if (!showExplanation) {
                          setSelectedOptionId(opt.id);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition cursor-pointer flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      {showExplanation && opt.isCorrect && (
                        <i className="fa-solid fa-check text-emerald-600"></i>
                      )}
                      {showExplanation && isSelected && !opt.isCorrect && (
                        <i className="fa-solid fa-xmark text-rose-500"></i>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation box */}
              {showExplanation && currentPracticeQ.questionData?.explanation && (
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 text-amber-900 text-xs space-y-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider block text-amber-700">
                    Explanation
                  </span>
                  <p className="text-[11px] leading-relaxed">{currentPracticeQ.questionData.explanation}</p>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {!showExplanation ? (
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={() => setShowExplanation(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-2xs cursor-pointer flex items-center space-x-1.5"
                >
                  <span>{reviewIndex < practiceQuestions.length - 1 ? "Next Question" : "Finish Review"}</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              )}

              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentShell>
  );
}
