"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface BookmarkItem {
  id: string;
  category: "snippet" | "mcq" | "theory" | "paper";
  categoryBadge: string;
  unit: string;
  title: string;
  date: string;
  description: string;
  link: string;
  linkLabel: string;
}

interface BookmarkClientProps {
  initialBookmarks: BookmarkItem[];
}

export function BookmarkClient({ initialBookmarks }: BookmarkClientProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(initialBookmarks);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const filteredBookmarks = useMemo(() => {
    if (selectedCategory === "all") return bookmarks;
    return bookmarks.filter((b) => b.category === selectedCategory);
  }, [bookmarks, selectedCategory]);

  const countSnippet = bookmarks.filter((b) => b.category === "snippet").length;
  const countMcq = bookmarks.filter((b) => b.category === "mcq").length;
  const countTheory = bookmarks.filter((b) => b.category === "theory").length;
  const countPaper = bookmarks.filter((b) => b.category === "paper").length;

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Folder Categories</h3>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
          Organized
        </span>
      </div>

      {/* Folder Breakdown Card */}
      <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/30 p-4 rounded-3xl border border-amber-100 space-y-3 text-xs">
        <div
          onClick={() => setSelectedCategory("snippet")}
          className="flex justify-between items-center py-1.5 border-b border-amber-100/60 cursor-pointer hover:bg-white/40 px-1 rounded-lg transition"
        >
          <span className="text-slate-700 font-medium">
            <i className="fa-solid fa-code text-amber-600 mr-2"></i> C++ Code Snippets
          </span>
          <span className="font-bold text-slate-900">{countSnippet}</span>
        </div>
        <div
          onClick={() => setSelectedCategory("mcq")}
          className="flex justify-between items-center py-1.5 border-b border-amber-100/60 cursor-pointer hover:bg-white/40 px-1 rounded-lg transition"
        >
          <span className="text-slate-700 font-medium">
            <i className="fa-solid fa-circle-question text-sky-600 mr-2"></i> Important MCQs
          </span>
          <span className="font-bold text-slate-900">{countMcq}</span>
        </div>
        <div
          onClick={() => setSelectedCategory("theory")}
          className="flex justify-between items-center py-1.5 border-b border-amber-100/60 cursor-pointer hover:bg-white/40 px-1 rounded-lg transition"
        >
          <span className="text-slate-700 font-medium">
            <i className="fa-solid fa-book-open text-emerald-600 mr-2"></i> Theory Notes
          </span>
          <span className="font-bold text-slate-900">{countTheory}</span>
        </div>
        <div
          onClick={() => setSelectedCategory("paper")}
          className="flex justify-between items-center py-1.5 cursor-pointer hover:bg-white/40 px-1 rounded-lg transition"
        >
          <span className="text-slate-700 font-medium">
            <i className="fa-solid fa-file-lines text-purple-600 mr-2"></i> Past Papers
          </span>
          <span className="font-bold text-slate-900">{countPaper}</span>
        </div>
      </div>

      {/* Revision Quick Action */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-2 text-xs">
        <h4 className="font-bold text-slate-900">Quick Bookmark Revision</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Launch a flashcard-style quick review session using all your saved bookmarks.
        </p>
        <Link
          href="/mock-test"
          className="w-full mt-2 block text-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
        >
          Start Flashcard Review ⚡
        </Link>
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
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Clean Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Tools & Tracking</span>
                <span>/</span>
                <span className="text-amber-600">Saved Bookmarks</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Your Saved Study Bookmarks</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3.5 py-2 rounded-xl">
                {bookmarks.length} Items Saved
              </span>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shrink-0 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              All Bookmarks ({bookmarks.length})
            </button>
            <button
              onClick={() => setSelectedCategory("snippet")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedCategory === "snippet"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              C++ Code Snippets ({countSnippet})
            </button>
            <button
              onClick={() => setSelectedCategory("mcq")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedCategory === "mcq"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              Important MCQs ({countMcq})
            </button>
            <button
              onClick={() => setSelectedCategory("theory")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedCategory === "theory"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              Theory Notes ({countTheory})
            </button>
            <button
              onClick={() => setSelectedCategory("paper")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedCategory === "paper"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              Past Paper Questions ({countPaper})
            </button>
          </div>

          {/* Bookmarked Items List Container */}
          <div className="space-y-4">
            {filteredBookmarks.map((b) => {
              const iconClass =
                b.category === "snippet"
                  ? "fa-code text-amber-700 bg-amber-100"
                  : b.category === "mcq"
                  ? "fa-circle-question text-sky-700 bg-sky-100"
                  : b.category === "theory"
                  ? "fa-book-open text-emerald-700 bg-emerald-100"
                  : "fa-file-lines text-purple-700 bg-purple-100";

              return (
                <div
                  key={b.id}
                  className="bg-gradient-to-br from-slate-50 via-amber-50/20 to-white p-5 rounded-3xl border border-amber-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-md"
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0 shadow-inner ${iconClass}`}
                    >
                      <i className={`fa-solid ${iconClass.split(" ")[0]}`}></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-md">
                          {b.categoryBadge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{b.unit}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Saved on {b.date} • {b.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <Link
                      href={b.link}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm inline-block cursor-pointer"
                    >
                      {b.linkLabel}
                    </Link>
                    <button
                      onClick={() => removeBookmark(b.id)}
                      title="Remove Bookmark"
                      className="bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 p-2 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredBookmarks.length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200/80">
                <i className="fa-solid fa-bookmark text-3xl text-slate-300 mb-2"></i>
                <p className="text-sm font-bold text-slate-600">No bookmarks found in this category.</p>
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
