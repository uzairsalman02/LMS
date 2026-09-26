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
  boardDescription?: string;
}

export interface BoardItem {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface PastPapersClientProps {
  papers: PastPaperItem[];
  boards?: BoardItem[];
}

export function getPaperBoardDetails(paper: PastPaperItem, boards: BoardItem[] = []) {
  const title = paper.title.toLowerCase();
  const boardName = paper.boardName.toLowerCase();

  // Match against known boards
  for (const b of boards) {
    const bNameLower = b.name.toLowerCase();
    const city = b.name.replace("BISE ", "").toLowerCase();
    if (boardName.includes(bNameLower) || title.includes(bNameLower) || title.includes(city)) {
      return {
        name: b.name,
        code: b.code,
        description: b.description,
      };
    }
  }

  // Fallback pattern matching for the 9 Punjab BISE boards
  if (title.includes("lahore")) {
    return { name: "BISE Lahore", code: "BISE_LHR", description: "Serves Lahore, Kasur, Sheikhupura, and Nankana Sahib." };
  }
  if (title.includes("rawalpindi")) {
    return { name: "BISE Rawalpindi", code: "BISE_RWP", description: "Serves Rawalpindi, Attock, Chakwal, Jhelum, and Murree." };
  }
  if (title.includes("faisalabad")) {
    return { name: "BISE Faisalabad", code: "BISE_FSD", description: "Serves Faisalabad, Jhang, Toba Tek Singh, and Chiniot." };
  }
  if (title.includes("gujranwala")) {
    return { name: "BISE Gujranwala", code: "BISE_GRW", description: "Serves Gujranwala, Gujrat, Sialkot, Narowal, Hafizabad, and Mandi Bahauddin." };
  }
  if (title.includes("multan")) {
    return { name: "BISE Multan", code: "BISE_MUL", description: "Serves Multan, Khanewal, Vehari, and Lodhran." };
  }
  if (title.includes("bahawalpur")) {
    return { name: "BISE Bahawalpur", code: "BISE_BWP", description: "Serves the Bahawalpur division." };
  }
  if (title.includes("d.g. khan") || title.includes("dg khan")) {
    return { name: "BISE D.G. Khan", code: "BISE_DGK", description: "Serves Dera Ghazi Khan and surrounding districts." };
  }
  if (title.includes("sahiwal")) {
    return { name: "BISE Sahiwal", code: "BISE_SHW", description: "Serves Sahiwal, Okara, and Pakpattan." };
  }
  if (title.includes("sargodha")) {
    return { name: "BISE Sargodha", code: "BISE_SGD", description: "Serves the Sargodha division." };
  }

  return {
    name: paper.boardName || "Punjab Board",
    code: paper.boardCode || "BISE",
    description: paper.boardDescription || "Official Intermediate Computer Science Curriculum for Punjab BISE boards.",
  };
}

export function PastPapersClient({ papers, boards = [] }: PastPapersClientProps) {
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

  // Selected board description / coverage details
  const activeBoardMeta = useMemo(() => {
    if (selectedBoard === "All") return null;
    return boards.find((b) => b.name === selectedBoard) || null;
  }, [selectedBoard, boards]);

  // Filter papers strictly matching all active filters
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const details = getPaperBoardDetails(paper, boards);
      const titleLower = paper.title.toLowerCase();
      const paperTypeLower = (paper.paperType || "").toLowerCase();
      const sessionLower = (paper.session || "").toLowerCase();

      // 1. Board Filter
      if (selectedBoard !== "All") {
        const selLower = selectedBoard.toLowerCase();
        const cityLower = selectedBoard.replace("BISE ", "").toLowerCase();
        const matchesBoard =
          details.name.toLowerCase() === selLower ||
          paper.boardName.toLowerCase() === selLower ||
          titleLower.includes(cityLower) ||
          titleLower.includes(selLower);
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

      // 4. Academic Stream Filter
      if (selectedGroup !== "All") {
        const grp = selectedGroup.toLowerCase();
        if (grp === "computer" || grp === "ics") {
          if (!titleLower.includes("computer") && !titleLower.includes("ics")) return false;
        }
      }

      // 5. Keyword Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          titleLower.includes(q) ||
          details.name.toLowerCase().includes(q) ||
          details.description.toLowerCase().includes(q) ||
          paper.year.toString().includes(q) ||
          paperTypeLower.includes(q) ||
          sessionLower.includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [papers, boards, selectedBoard, selectedYear, selectedSession, selectedGroup, searchQuery]);

  // Right Rail: Punjab Board Examination Guide & Coverage
  const rightRail = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Punjab Boards Coverage</h3>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
          PCTB Curriculum
        </span>
      </div>

      {/* District Coverage Info Box */}
      <div className="bg-gradient-to-br from-purple-50/60 to-indigo-50/30 p-4 rounded-3xl border border-purple-100/80 space-y-3">
        <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs">
          <i className="fa-solid fa-map-location-dot text-purple-600"></i>
          <span>Official 9 Punjab BISE Boards</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          All 9 education boards in Punjab share the identical Punjab Curriculum and Textbook Board (PCTB) Computer Science syllabus and paper pattern.
        </p>

        {/* Board List with Jurisdiction (Compact Scrollable) */}
        <div className="space-y-2 pt-1 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
          {boards.map((b) => {
            const isCurrentSelected = selectedBoard === b.name;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBoard(isCurrentSelected ? "All" : b.name)}
                className={`p-2.5 rounded-2xl text-[11px] transition cursor-pointer border ${
                  isCurrentSelected
                    ? "bg-purple-600 text-white border-purple-600 font-bold shadow-2xs"
                    : "bg-white/85 text-slate-700 hover:bg-white hover:border-purple-200 border-slate-100 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{b.name}</span>
                  <span className={`text-[10px] font-mono ${isCurrentSelected ? "text-purple-200" : "text-slate-400"}`}>
                    {b.code}
                  </span>
                </div>
                <p className={`text-[10px] mt-0.5 line-clamp-1 ${isCurrentSelected ? "text-purple-100" : "text-slate-500"}`}>
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlighted Punjab Board Paper Pattern Card */}
      <div className="bg-gradient-to-br from-amber-50 via-amber-100/30 to-orange-50/40 border border-amber-200/90 p-4 rounded-3xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-amber-200/70">
          <div className="flex items-center space-x-2 text-amber-950 font-bold text-xs">
            <div className="w-6 h-6 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs shadow-2xs">
              <i className="fa-solid fa-file-lines"></i>
            </div>
            <span>Board Paper Pattern</span>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200/80 px-2.5 py-0.5 rounded-full font-mono">
            Total 75 Marks
          </span>
        </div>

        {/* Simple Sections Breakdown */}
        <div className="space-y-2.5 text-xs">
          {/* Section A */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-slate-900 block text-[11px]">Section A: Objective (MCQs)</span>
              <span className="text-[10px] text-slate-600">15 Questions • Time: 20 Mins</span>
            </div>
            <span className="font-bold text-amber-900 bg-amber-100/80 border border-amber-200/60 px-2 py-0.5 rounded-lg font-mono text-[10px]">
              15 Marks
            </span>
          </div>

          {/* Section B */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-slate-900 block text-[11px]">Section B: Short Questions</span>
              <span className="text-[10px] text-slate-600">Attempt 24 out of 37 questions</span>
            </div>
            <span className="font-bold text-sky-900 bg-sky-100/80 border border-sky-200/60 px-2 py-0.5 rounded-lg font-mono text-[10px]">
              36 Marks
            </span>
          </div>

          {/* Section C */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-bold text-slate-900 block text-[11px]">Section C: Long Questions</span>
              <span className="text-[10px] text-slate-600">Attempt 3 out of 5 questions</span>
            </div>
            <span className="font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-200/60 px-2 py-0.5 rounded-lg font-mono text-[10px]">
              24 Marks
            </span>
          </div>
        </div>

        {/* Footer: Time & Passing Marks */}
        <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between text-[10px] text-slate-600">
          <span>Passing Marks: <strong className="text-slate-900 font-bold">25 (33%)</strong></span>
          <span>Time: <strong className="text-slate-900 font-bold">2h 30m</strong></span>
        </div>
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
      rightPanelLabel="Board Coverage"
      pageTitle="Past Papers"
      badge="Punjab Boards"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Exam Center</span>
                <span>/</span>
                <span className="text-purple-600">Punjab Boards Archive</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                11th Computer Science Past Papers
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Official Punjab Board (PCTB) examination papers for all 9 education divisions.
              </p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
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
                <span>Filter by Punjab Board & Year</span>
              </h3>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-72">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Search city, year, group..."
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
              {/* 1. Punjab Board Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Punjab Board (9 Divisions)
                </label>
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs cursor-pointer"
                >
                  <option value="All">All Punjab Boards (All 9 Divisions)</option>
                  {boards.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
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
                  Session / Group
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

              {/* 4. Stream Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Study Stream
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

            {/* Jurisdiction / Districts Info Banner when a board is selected */}
            {activeBoardMeta && (
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200/80 flex items-center space-x-2 text-xs text-purple-900">
                <i className="fa-solid fa-circle-info text-purple-600 shrink-0"></i>
                <span>
                  <strong>{activeBoardMeta.name}:</strong> {activeBoardMeta.description}
                </span>
              </div>
            )}

            {/* Active Filter Pills Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-400 font-semibold">Active Filters:</span>

                {selectedBoard !== "All" && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-semibold">
                    <span>Board: {selectedBoard}</span>
                    <button
                      onClick={() => setSelectedBoard("All")}
                      className="text-purple-600 hover:text-purple-900 cursor-pointer ml-1"
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
                      className="text-sky-600 hover:text-sky-900 cursor-pointer ml-1"
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
                      className="text-amber-600 hover:text-amber-900 cursor-pointer ml-1"
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
                      className="text-emerald-600 hover:text-emerald-900 cursor-pointer ml-1"
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
                      className="text-slate-600 hover:text-slate-900 cursor-pointer ml-1"
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
              const details = getPaperBoardDetails(paper, boards);
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
                    {/* Badges Row */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-lg border border-purple-100 flex items-center space-x-1">
                          <i className="fa-solid fa-landmark text-[10px]"></i>
                          <span>{details.name}</span>
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

                    {/* District coverage hint */}
                    {details.description && (
                      <p className="text-[11px] text-purple-700/80 font-medium mt-1 flex items-center">
                        <i className="fa-solid fa-location-dot text-purple-600 text-[10px] mr-1.5"></i>
                        <span>{details.description}</span>
                      </p>
                    )}

                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      Official Punjab Board paper: Section A (MCQs 15 Marks) and Section B & C (Subjective with rubric guidelines).
                    </p>
                  </div>

                  {/* Bottom Meta & Action Buttons */}
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
                        title="Download PDF"
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
                  <h4 className="text-sm font-bold text-slate-800">No Past Papers Found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    No papers match the selected Punjab board or year. Click below to clear all filters.
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

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed for all 9 Punjab Boards (BISE).</p>
        </footer>
      </main>
    </StudentShell>
  );
}
