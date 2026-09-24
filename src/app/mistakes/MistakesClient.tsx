"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export interface SerializedMistakeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface SerializedMistakeItem {
  id: string;
  questionId: string;
  questionText: string;
  questionType: "MCQ" | "SHORT" | "LONG";
  chapterId?: string;
  chapterNumber: number;
  chapterTitle: string;
  topicId?: string;
  topicTitle: string;
  notes?: string | null;
  answer?: string | null;
  explanation?: string | null;
  marks?: number;
  resolved: boolean;
  createdAt: string;
  options: SerializedMistakeOption[];
  repeatCount?: number;
  incorrectCount?: number;
  topicMistakeCount?: number;
  isFrequent?: boolean;
}

export interface UnitMistakeStats {
  chapterNumber: number;
  chapterTitle: string;
  totalErrors: number;
  unresolvedErrors: number;
}

interface MistakesClientProps {
  initialMistakes: SerializedMistakeItem[];
  chapters: Array<{ id: string; chapterNumber: number; title: string }>;
}

export function MistakesClient({ initialMistakes, chapters }: MistakesClientProps) {
  const [mistakes, setMistakes] = useState<SerializedMistakeItem[]>(initialMistakes);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNRESOLVED" | "RESOLVED" | "REPEATED">("UNRESOLVED");
  const [selectedUnit, setSelectedUnit] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "MCQ" | "SHORT" | "LONG">("ALL");

  // Selected mistake for the Diagnostic Inspector Modal
  const [inspectingMistake, setInspectingMistake] = useState<SerializedMistakeItem | null>(null);
  const [selectedTestOptionId, setSelectedTestOptionId] = useState<string | null>(null);
  const [isTestAnswerSubmitted, setIsTestAnswerSubmitted] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Toggle Resolve / Unresolve Handler
  const handleToggleResolve = async (mistakeId: string, currentResolved: boolean) => {
    setUpdatingId(mistakeId);
    const newStatus = !currentResolved;

    // Optimistic UI update
    setMistakes((prev) =>
      prev.map((m) => (m.id === mistakeId ? { ...m, resolved: newStatus } : m))
    );

    if (inspectingMistake && inspectingMistake.id === mistakeId) {
      setInspectingMistake((prev) => (prev ? { ...prev, resolved: newStatus } : null));
    }

    try {
      const res = await fetch("/api/mistakes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mistakeId, resolved: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      showToast(
        newStatus
          ? "🎉 Concept marked as Mastered & Cleared!"
          : "⚠️ Mistake re-opened for targeted revision."
      );
    } catch (err) {
      console.error("Error updating mistake resolution:", err);
      // Revert optimistic update
      setMistakes((prev) =>
        prev.map((m) => (m.id === mistakeId ? { ...m, resolved: currentResolved } : m))
      );
      showToast("❌ Failed to update mistake status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Live KPI Calculations
  const totalCount = mistakes.length;
  const resolvedCount = mistakes.filter((m) => m.resolved).length;
  const unresolvedCount = totalCount - resolvedCount;
  const frequentCount = mistakes.filter((m) => (m.incorrectCount || 1) >= 2).length;
  const fixedRate = totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : "0.0";

  // Dynamic Unit Breakdown for Right Rail
  const unitStats = useMemo(() => {
    const statsMap: Record<number, { chapterNumber: number; chapterTitle: string; totalErrors: number; unresolvedErrors: number }> = {};

    chapters.forEach((c) => {
      statsMap[c.chapterNumber] = {
        chapterNumber: c.chapterNumber,
        chapterTitle: c.title,
        totalErrors: 0,
        unresolvedErrors: 0,
      };
    });

    mistakes.forEach((m) => {
      const cNum = m.chapterNumber || 1;
      if (!statsMap[cNum]) {
        statsMap[cNum] = {
          chapterNumber: cNum,
          chapterTitle: m.chapterTitle,
          totalErrors: 0,
          unresolvedErrors: 0,
        };
      }
      statsMap[cNum].totalErrors += 1;
      if (!m.resolved) {
        statsMap[cNum].unresolvedErrors += 1;
      }
    });

    return Object.values(statsMap).sort((a, b) => b.unresolvedErrors - a.unresolvedErrors);
  }, [mistakes, chapters]);

  // Filtered mistakes list
  const filteredMistakes = useMemo(() => {
    return mistakes.filter((item) => {
      // Status filter
      if (statusFilter === "UNRESOLVED" && item.resolved) return false;
      if (statusFilter === "RESOLVED" && !item.resolved) return false;
      if (statusFilter === "REPEATED" && (item.incorrectCount || 1) < 2) return false;

      // Unit filter
      if (selectedUnit !== "ALL" && String(item.chapterNumber) !== selectedUnit) return false;

      // Type filter
      if (typeFilter !== "ALL" && item.questionType !== typeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = item.questionText.toLowerCase().includes(query);
        const matchChapter = item.chapterTitle.toLowerCase().includes(query);
        const matchTopic = item.topicTitle.toLowerCase().includes(query);
        const matchNotes = item.notes?.toLowerCase().includes(query);
        return matchText || matchChapter || matchTopic || matchNotes;
      }

      return true;
    });
  }, [mistakes, statusFilter, selectedUnit, typeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center space-x-3 text-xs font-bold backdrop-blur-md animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Heading & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 via-amber-50/20 to-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/practice" className="hover:text-slate-600 transition">
              Assessment Hub
            </Link>
            <span>/</span>
            <span className="text-amber-600 font-bold">Mistakes Review Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Logged Mistakes &amp; Concept Recovery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnostic error logs generated automatically from your mock tests and practice quizzes.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {unresolvedCount > 0 && (
            <Link
              href="/mock-test?mode=drill"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-amber-600/20 flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <i className="fa-solid fa-bolt"></i>
              <span>Start Drill ({unresolvedCount} Errors) 🎯</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 KPI Summary Cards - Compact & Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Logged */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Total Logged
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</h3>
            <span className="text-[10px] text-slate-500 font-medium">Recorded test errors</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-base shadow-inner">
            <i className="fa-solid fa-folder-open"></i>
          </div>
        </div>

        {/* Card 2: Need Revision */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
              Need Revision
            </span>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl sm:text-2xl font-black text-amber-700">{unresolvedCount}</h3>
              {frequentCount > 0 && (
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md">
                  {frequentCount} Repeated
                </span>
              )}
            </div>
            <span className="text-[10px] text-amber-600 font-medium">Pending mastery</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base shadow-inner">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>

        {/* Card 3: Mastered Concepts */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">
              Mastered
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-700">{resolvedCount}</h3>
            <span className="text-[10px] text-emerald-600 font-medium">Cleared concepts</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base shadow-inner">
            <i className="fa-solid fa-circle-check"></i>
          </div>
        </div>

        {/* Card 4: Recovery Rate */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-indigo-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">
              Recovery Rate
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-indigo-700">{fixedRate}%</h3>
            <span className="text-[10px] text-indigo-600 font-medium">Cleared ratio</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base shadow-inner">
            <i className="fa-solid fa-chart-line"></i>
          </div>
        </div>
      </div>

      {/* Streamlined Filter & Search Toolbar (Zero Overflow Responsive Architecture) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        {/* Row 1: Status Navigation Tabs (Full Width Dedicated Row) */}
        <div className="flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter("UNRESOLVED")}
            className={`flex-1 min-w-[115px] px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap text-center ${
              statusFilter === "UNRESOLVED"
                ? "bg-amber-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <i className="fa-solid fa-triangle-exclamation mr-1 text-[10px]"></i>
            Need Revision ({unresolvedCount})
          </button>
          <button
            onClick={() => setStatusFilter("REPEATED")}
            className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap text-center ${
              statusFilter === "REPEATED"
                ? "bg-rose-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-rose-700"
            }`}
            title="Filter errors that occurred 2 or more times"
          >
            <i className="fa-solid fa-fire mr-1 text-[10px]"></i>
            Repeated ({frequentCount})
          </button>
          <button
            onClick={() => setStatusFilter("RESOLVED")}
            className={`flex-1 min-w-[105px] px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap text-center ${
              statusFilter === "RESOLVED"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <i className="fa-solid fa-circle-check mr-1 text-[10px]"></i>
            Mastered ({resolvedCount})
          </button>
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`flex-1 min-w-[65px] px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap text-center ${
              statusFilter === "ALL"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({totalCount})
          </button>
        </div>

        {/* Row 2: Search Input + Unit & Type Selectors */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mistakes by topic, keyword, or question..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Unit & Type Selectors */}
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="flex-1 md:w-44 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 truncate outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Units</option>
              {chapters.map((c) => (
                <option key={c.id} value={String(c.chapterNumber)}>
                  Unit {c.chapterNumber}: {c.title.replace(/^Unit\s*\d+:\s*/, "")}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-28 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 outline-none focus:border-amber-500 cursor-pointer shrink-0"
            >
              <option value="ALL">All Types</option>
              <option value="MCQ">MCQs</option>
              <option value="SHORT">Short</option>
              <option value="LONG">Long</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mistakes Table / List - Zero Overflow, Table-Fixed Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-2">
            <span>Mistakes Log Directory</span>
            <span className="text-xs text-slate-400 font-normal">({filteredMistakes.length} items)</span>
          </h3>
          {unresolvedCount > 0 && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-full">
              {unresolvedCount} Requiring Action
            </span>
          )}
        </div>

        {filteredMistakes.length === 0 ? (
          <div className="p-8 text-center space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">No Mistakes Matching Current View</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {statusFilter === "UNRESOLVED"
                ? "Zero pending errors in this filter! All items in this category have been mastered."
                : statusFilter === "REPEATED"
                ? "Zero repeated mistakes found in this category! You have no recurring failure questions here."
                : "No mistake logs found matching your filter or search query."}
            </p>
          </div>
        ) : (
          <table className="w-full table-fixed text-left border-collapse text-xs">
            <colgroup>
              <col className="w-[62%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="bg-slate-100/70 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/60">
                <th className="py-2.5 px-3.5 font-bold">Topic &amp; Curriculum Focus</th>
                <th className="py-2.5 px-2 font-bold text-center">Status</th>
                <th className="py-2.5 px-3.5 font-bold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMistakes.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/70 transition group cursor-pointer"
                  onClick={() => {
                    setInspectingMistake(row);
                    setSelectedTestOptionId(null);
                    setIsTestAnswerSubmitted(false);
                  }}
                >
                  {/* Column 1: Topic, Badges & Diagnostic Note (Clean & Compact Directory View) */}
                  <td className="py-2.5 px-3.5 align-middle">
                    {/* Primary Line: Topic Title + Repetitive Badge + Hover Inspect */}
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span
                        className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-sky-600 transition truncate max-w-[240px] sm:max-w-md"
                        title={row.topicTitle}
                      >
                        {row.topicTitle.replace(/^Topic\s*\d+\.\d+:\s*/, "")}
                      </span>

                      {/* Repetitive Mistake Alert Badge */}
                      {row.incorrectCount && row.incorrectCount >= 2 ? (
                        <span
                          className="inline-flex items-center space-x-1 text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full shadow-2xs shrink-0"
                          title={`Answered incorrectly ${row.incorrectCount} times across mock tests. High focus topic!`}
                        >
                          <i className="fa-solid fa-rotate-right text-rose-500 text-[9px]"></i>
                          <span>{row.incorrectCount}x Failed</span>
                          <span className="hidden sm:inline font-bold text-rose-600/90">• High Focus</span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/60 px-1.5 py-0.2 rounded shrink-0"
                          title="Failed 1 time in mock test"
                        >
                          1x Error
                        </span>
                      )}

                      <span className="hidden sm:inline-flex items-center text-[10px] text-slate-400 group-hover:text-sky-600 transition opacity-0 group-hover:opacity-100 shrink-0 font-medium">
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px] mr-1"></i>
                        Inspect
                      </span>
                    </div>

                    {/* Secondary Line: Unit & Type Badges + Diagnostic Error Note */}
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 mt-1 text-slate-600">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        Unit {row.chapterNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 ${
                          row.questionType === "LONG"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : row.questionType === "SHORT"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {row.questionType} ({row.marks || (row.questionType === "LONG" ? 5 : row.questionType === "SHORT" ? 2 : 1)}M)
                      </span>
                      {row.repeatCount && row.repeatCount > 0 ? (
                        <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1 py-0.5 rounded shrink-0">
                          {row.repeatCount}x Past Papers
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Column 2: Status */}
                  <td className="py-3 px-2 text-center align-middle whitespace-nowrap">
                    {row.resolved ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                        <i className="fa-solid fa-circle-check text-[10px]"></i>
                        <span>Mastered</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                        <i className="fa-solid fa-clock text-[10px]"></i>
                        <span>Pending</span>
                      </span>
                    )}
                  </td>

                  {/* Column 3: Quick Actions */}
                  <td
                    className="py-3 px-3.5 text-right align-middle whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => {
                          setInspectingMistake(row);
                          setSelectedTestOptionId(null);
                          setIsTestAnswerSubmitted(false);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center space-x-1"
                        title="Inspect full diagnostic and model answer"
                      >
                        <i className="fa-solid fa-eye text-[10px]"></i>
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleToggleResolve(row.id, row.resolved)}
                        disabled={updatingId === row.id}
                        className={`font-bold px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center space-x-1 border ${
                          row.resolved
                            ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 shadow-2xs"
                        }`}
                      >
                        <i className={`fa-solid ${row.resolved ? "fa-rotate-left" : "fa-check"} text-[10px]`}></i>
                        <span>{row.resolved ? "Re-open" : "Resolve"}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Diagnostic Inspector Modal */}
      {inspectingMistake && (
        <div className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                  <span>Unit {inspectingMistake.chapterNumber}: {inspectingMistake.chapterTitle}</span>
                  <span>•</span>
                  <span className="text-sky-700 font-bold">{inspectingMistake.topicTitle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {inspectingMistake.questionType} • {inspectingMistake.marks || 1} Marks
                  </span>
                  {inspectingMistake.resolved ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ Mastered
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      ⚠️ Needs Revision
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setInspectingMistake(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Repetitive Mistake High-Priority Focus Alert */}
            {inspectingMistake.incorrectCount && inspectingMistake.incorrectCount >= 2 ? (
              <div className="bg-gradient-to-r from-rose-50 via-rose-50/80 to-amber-50/60 border border-rose-200/90 p-3.5 rounded-2xl flex items-start space-x-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-sm">
                  <i className="fa-solid fa-fire"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-xs font-black text-rose-950">
                      Repetitive Error: Answered Incorrectly {inspectingMistake.incorrectCount}x in Tests
                    </span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 shrink-0">
                      High Focus Topic
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800/90 mt-1 leading-snug">
                    You have repeatedly answered this question incorrectly across mock tests (<strong>{inspectingMistake.topicMistakeCount || inspectingMistake.incorrectCount} total errors</strong> recorded in this topic). Dedicate focused revision time to this concept before your Punjab Board exam!
                  </p>
                </div>
              </div>
            ) : null}

            {/* Question Text */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Examination Question
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {inspectingMistake.questionText}
              </h3>
            </div>

            {/* MCQ Interactive Option Review or Subjective Model Answer */}
            {inspectingMistake.questionType === "MCQ" && inspectingMistake.options.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Re-Test &amp; Option Breakdown
                </span>
                <div className="space-y-2">
                  {inspectingMistake.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isCorrect = opt.isCorrect;
                    const isSelectedInTest = selectedTestOptionId === opt.id;

                    let optionBorder = "border-slate-200 hover:border-slate-300 bg-white";
                    if (isTestAnswerSubmitted) {
                      if (isCorrect) {
                        optionBorder = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                      } else if (isSelectedInTest && !isCorrect) {
                        optionBorder = "border-rose-400 bg-rose-50 text-rose-900";
                      }
                    } else if (isSelectedInTest) {
                      optionBorder = "border-amber-500 bg-amber-50 text-amber-900";
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          if (!isTestAnswerSubmitted) {
                            setSelectedTestOptionId(opt.id);
                          }
                        }}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${optionBorder}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {letter}
                          </span>
                          <span className="font-medium">{opt.text}</span>
                        </div>

                        {isTestAnswerSubmitted && isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
                            <i className="fa-solid fa-check text-[9px]"></i>
                            <span>Correct Answer</span>
                          </span>
                        )}

                        {isTestAnswerSubmitted && isSelectedInTest && !isCorrect && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
                            <i className="fa-solid fa-xmark text-[9px]"></i>
                            <span>Your Choice</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isTestAnswerSubmitted ? (
                  <button
                    onClick={() => {
                      if (selectedTestOptionId) {
                        setIsTestAnswerSubmitted(true);
                        const chosen = inspectingMistake.options.find((o) => o.id === selectedTestOptionId);
                        if (chosen?.isCorrect) {
                          showToast("🎉 Excellent! You got the right answer!");
                        }
                      }
                    }}
                    disabled={!selectedTestOptionId}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Check My Answer Now
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-800 flex items-center justify-between">
                    <span>Did this explanation clear up your confusion?</span>
                    <button
                      onClick={() => handleToggleResolve(inspectingMistake.id, inspectingMistake.resolved)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition"
                    >
                      {inspectingMistake.resolved ? "Already Mastered" : "Mark as Mastered ✓"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Subjective Model Answer & Examiner Breakdown */
              <div className="space-y-3">
                {inspectingMistake.notes && (
                  <div className="bg-rose-50/80 border border-rose-200/90 p-3 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-rose-800 block">Assessment Audit:</span>
                    <p className="text-rose-900 leading-relaxed font-mono text-[11px]">
                      {inspectingMistake.notes}
                    </p>
                  </div>
                )}

                {inspectingMistake.answer && (
                  <div className="bg-emerald-50/80 border border-emerald-200/90 p-3.5 rounded-xl text-xs space-y-1.5">
                    <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                      <i className="fa-solid fa-award text-emerald-600"></i>
                      <span>Official Punjab Board Model Answer:</span>
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-emerald-200/60">
                      {inspectingMistake.answer}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Official Explanation / Rubric Key Points */}
            {inspectingMistake.explanation && (
              <div className="bg-indigo-50/70 border border-indigo-200/80 p-3.5 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-indigo-900 flex items-center space-x-1.5">
                  <i className="fa-solid fa-lightbulb text-indigo-600"></i>
                  <span>Examiner Explanation &amp; Core Concept:</span>
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {inspectingMistake.explanation}
                </p>
              </div>
            )}

            {/* Footer Control Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <Link
                href={`/learn?topicId=${inspectingMistake.topicId || ""}`}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <i className="fa-solid fa-book-open text-[11px]"></i>
                <span>Open Lesson &amp; Visual Analogy</span>
              </Link>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => handleToggleResolve(inspectingMistake.id, inspectingMistake.resolved)}
                  className={`flex-1 sm:flex-none font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer text-white shadow-md ${
                    inspectingMistake.resolved
                      ? "bg-slate-600 hover:bg-slate-700"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  }`}
                >
                  {inspectingMistake.resolved ? "Re-open Mistake" : "Mark as Mastered ✓"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
