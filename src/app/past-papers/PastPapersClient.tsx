"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface PastPaperItem {
  id: string;
  title: string;
  year: number;
  session: string;
  paperType: string | null;
  fileKey: string;
  fileUrl: string;
  totalMarks: number;
  durationMinutes: number;
  verificationStatus: string;
  boardName: string;
  boardCode: string;
}

interface PastPapersClientProps {
  papers: PastPaperItem[];
}

export function getPaperBoardInfo(paper: PastPaperItem) {
  const title = paper.title.toLowerCase();
  if (title.includes("lahore")) return { name: "BISE Lahore", short: "Lahore", key: "lahore", color: "purple" };
  if (title.includes("rawalpindi")) return { name: "BISE Rawalpindi", short: "Rawalpindi", key: "rawalpindi", color: "sky" };
  if (title.includes("faisalabad")) return { name: "BISE Faisalabad", short: "Faisalabad", key: "faisalabad", color: "indigo" };
  if (title.includes("multan")) return { name: "BISE Multan", short: "Multan", key: "multan", color: "emerald" };
  if (title.includes("gujranwala")) return { name: "BISE Gujranwala", short: "Gujranwala", key: "gujranwala", color: "amber" };
  if (title.includes("sahiwal")) return { name: "BISE Sahiwal", short: "Sahiwal", key: "sahiwal", color: "rose" };
  if (title.includes("federal") || title.includes("fbise")) return { name: "Federal Board (FBISE)", short: "FBISE", key: "fbise", color: "teal" };
  return { name: paper.boardName || "Punjab Board", short: "Punjab", key: "punjab", color: "purple" };
}

export function PastPapersClient({ papers }: PastPapersClientProps) {
  const [selectedBoard, setSelectedBoard] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedSession, setSelectedSession] = useState<string>("All");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const resetFilters = () => {
    setSelectedBoard("All");
    setSelectedYear("All");
    setSelectedSession("All");
    setSelectedGroup("All");
    setSearchQuery("");
  };

  // Extract unique available years dynamically from papers
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(papers.map((p) => p.year)));
    return years.sort((a, b) => b - a);
  }, [papers]);

  // Extract unique boards dynamically from papers
  const availableBoards = useMemo(() => {
    const boardMap = new Map<string, string>();
    papers.forEach((p) => {
      const info = getPaperBoardInfo(p);
      boardMap.set(info.key, info.name);
    });
    return Array.from(boardMap.entries()).map(([key, name]) => ({ key, name }));
  }, [papers]);

  // Filtered papers matching all active criteria
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const boardInfo = getPaperBoardInfo(paper);
      const titleLower = paper.title.toLowerCase();
      const paperTypeLower = (paper.paperType || "").toLowerCase();
      const sessionLower = (paper.session || "").toLowerCase();

      // 1. Board Filter
      if (selectedBoard !== "All") {
        const sel = selectedBoard.toLowerCase();
        const matchesBoard =
          boardInfo.key === sel ||
          boardInfo.name.toLowerCase().includes(sel) ||
          titleLower.includes(sel) ||
          (sel === "punjab" && (paper.boardName.toLowerCase().includes("punjab") || titleLower.includes("bise")));
        if (!matchesBoard) return false;
      }

      // 2. Year Filter
      if (selectedYear !== "All") {
        if (paper.year.toString() !== selectedYear) return false;
      }

      // 3. Session / Paper Type Filter
      if (selectedSession !== "All") {
        const sess = selectedSession.toLowerCase();
        if (sess.includes("group 1") || sess.includes("morning")) {
          const isG1 = paperTypeLower.includes("group 1") || titleLower.includes("group 1") || paperTypeLower.includes("morning");
          if (!isG1) return false;
        } else if (sess.includes("group 2") || sess.includes("evening")) {
          const isG2 = paperTypeLower.includes("group 2") || titleLower.includes("group 2") || paperTypeLower.includes("evening");
          if (!isG2) return false;
        } else if (sess.includes("annual")) {
          const isAnnual = sessionLower.includes("annual") || titleLower.includes("annual");
          if (!isAnnual) return false;
        }
      }

      // 4. Study Group / Stream Filter
      if (selectedGroup !== "All") {
        const grp = selectedGroup.toLowerCase();
        if (grp === "computer" || grp === "ics") {
          // All 11th Computer Science papers match
          if (!titleLower.includes("computer") && !titleLower.includes("ics")) return false;
        }
      }

      // 5. Search Query Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          titleLower.includes(q) ||
          boardInfo.name.toLowerCase().includes(q) ||
          paper.year.toString().includes(q) ||
          paperTypeLower.includes(q) ||
          sessionLower.includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [papers, selectedBoard, selectedYear, selectedSession, selectedGroup, searchQuery]);

  // Right Rail: Exam Weightage & Insights
  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Exam Weightage Trend</h3>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
          AI Insights
        </span>
      </div>

      <div className="bg-gradient-to-br from-purple-50/60 to-indigo-50/30 p-4 rounded-3xl border border-purple-100/80 space-y-3">
        <h4 className="text-xs font-bold text-slate-800">Most Repeated Units in Past 5 Years</h4>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Unit 3: Data Communications</span>
            <span className="text-purple-700 font-mono">35% Weightage</span>
          </div>
          <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: "35%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Unit 2: Computer Networks & OSI</span>
            <span className="text-sky-700 font-mono">28% Weightage</span>
          </div>
          <div className="w-full bg-sky-100 h-2 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: "28%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Unit 1 & 5: Hardware & Software</span>
            <span className="text-emerald-700 font-mono">37% Weightage</span>
          </div>
          <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "37%" }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs">
          <i className="fa-solid fa-lightbulb"></i>
          <span>Board Exam Tip</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Punjab Board past papers show that <strong>OSI Model 7 Layers and Network Topologies</strong> appear in both Morning & Evening papers as mandatory 8-mark long questions.
        </p>
      </div>

      {/* Quick Filter Summary Pill in Right Rail */}
      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-700 font-bold">
          <span>Active Archive</span>
          <span className="text-purple-700 font-mono">{filteredPapers.length} / {papers.length}</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Showing authentic Punjab Board & FBISE past papers with solved objective and subjective keys.
        </p>
      </div>
    </div>
  );

  const hasActiveFilters =
    selectedBoard !== "All" ||
    selectedYear !== "All" ||
    selectedSession !== "All" ||
    selectedGroup !== "All" ||
    searchQuery.trim() !== "";

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-filter"
      rightPanelLabel="Exam Insights"
      pageTitle="Past Papers"
      badge="11th Computer Science"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Exam Center</span>
                <span>/</span>
                <span className="text-purple-600">Past Papers Archive</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">11th Computer Science Past Papers</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-purple-200 shadow-2xs">
                {filteredPapers.length} {filteredPapers.length === 1 ? "Paper" : "Papers"} Available
              </span>
            </div>
          </div>

          {/* Advanced Filter Toolbar */}
          <div className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <i className="fa-solid fa-filter text-purple-600"></i>
                <span>Filter Past Papers Archive</span>
              </h3>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-72">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Search by Board, Year, Group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Board Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Target Board
                </label>
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  <option value="All">All Boards (Punjab & FBISE)</option>
                  <option value="lahore">BISE Lahore</option>
                  <option value="rawalpindi">BISE Rawalpindi</option>
                  <option value="faisalabad">BISE Faisalabad</option>
                  <option value="multan">BISE Multan</option>
                  <option value="gujranwala">BISE Gujranwala</option>
                  <option value="sahiwal">BISE Sahiwal</option>
                  <option value="fbise">Federal Board (FBISE)</option>
                  <option value="punjab">All Punjab Boards</option>
                </select>
              </div>

              {/* 2. Year Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Examination Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  <option value="All">All Years (2021 - 2025)</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr.toString()}>
                      Annual {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Session Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Exam Session / Group
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  <option value="All">All Sessions (Morning & Evening)</option>
                  <option value="Group 1">Morning (Group 1)</option>
                  <option value="Group 2">Evening (Group 2)</option>
                  <option value="Annual">Annual Papers</option>
                </select>
              </div>

              {/* 4. Stream / Group Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Academic Stream
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  <option value="All">All Academic Streams</option>
                  <option value="ICS">Computer Science (ICS)</option>
                  <option value="General">Science / General Group</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-400 font-semibold">Active Filters:</span>

                {selectedBoard !== "All" && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-semibold">
                    <span>Board: {availableBoards.find((b) => b.key === selectedBoard)?.name || selectedBoard}</span>
                    <button
                      onClick={() => setSelectedBoard("All")}
                      className="text-purple-600 hover:text-purple-900 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedYear !== "All" && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-semibold">
                    <span>Year: {selectedYear}</span>
                    <button
                      onClick={() => setSelectedYear("All")}
                      className="text-sky-600 hover:text-sky-900 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedSession !== "All" && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold">
                    <span>Session: {selectedSession}</span>
                    <button
                      onClick={() => setSelectedSession("All")}
                      className="text-amber-600 hover:text-amber-900 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedGroup !== "All" && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    <span>Stream: {selectedGroup}</span>
                    <button
                      onClick={() => setSelectedGroup("All")}
                      className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {searchQuery.trim() !== "" && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold">
                    <span>Keyword: &quot;{searchQuery}&quot;</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 underline ml-auto cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Past Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPapers.map((paper) => {
              const boardInfo = getPaperBoardInfo(paper);
              const isMorning =
                paper.paperType?.toLowerCase().includes("group 1") ||
                paper.paperType?.toLowerCase().includes("morning") ||
                paper.title.toLowerCase().includes("group 1");

              return (
                <div
                  key={paper.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Card Badges Row */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-lg border border-purple-100 flex items-center space-x-1">
                          <i className="fa-solid fa-landmark text-[10px]"></i>
                          <span>{boardInfo.name}</span>
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-md font-mono">
                          {paper.year}
                        </span>
                        <span
                          className={`px-2 py-0.5 font-semibold text-[10px] rounded-md ${
                            isMorning ? "bg-sky-50 text-sky-700 border border-sky-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {paper.paperType || (isMorning ? "Morning" : "Evening")}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <i className="fa-solid fa-check text-[9px]"></i>
                        <span>Solved</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {paper.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                      Complete board examination paper with MCQs, short answers, and official Punjab Board rubric scoring scheme.
                    </p>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                      <span>{paper.totalMarks} Marks</span>
                      <span>•</span>
                      <span>{paper.durationMinutes} Mins</span>
                    </div>

                    <div className="flex space-x-2">
                      <a
                        href={paper.fileUrl || "#"}
                        download
                        title="Download PDF Paper"
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-2xs cursor-pointer inline-flex items-center space-x-1"
                      >
                        <i className="fa-solid fa-download text-[10px]"></i>
                        <span>PDF</span>
                      </a>
                      <Link
                        href={`/past-papers/${paper.id}`}
                        title="View Solved Questions"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1"
                      >
                        <span>View Paper</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredPapers.length === 0 && (
              <div className="col-span-full py-14 text-center bg-slate-50/80 rounded-3xl border border-slate-200/80 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shadow-xs">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">No Past Papers Match Your Filter</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try changing your selected board, year, or search query to browse other Punjab Board and Federal papers.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
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
