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

export function PastPapersClient({ papers }: PastPapersClientProps) {
  const [selectedBoard, setSelectedBoard] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSession, setSelectedSession] = useState("All");
  const [selectedGroup, setSelectedGroup] = useState("All");

  const resetFilters = () => {
    setSelectedBoard("All");
    setSelectedYear("All");
    setSelectedSession("All");
    setSelectedGroup("All");
  };

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      if (selectedBoard !== "All" && !paper.boardName.toLowerCase().includes(selectedBoard.toLowerCase())) {
        return false;
      }
      if (selectedYear !== "All" && paper.year.toString() !== selectedYear) {
        return false;
      }
      if (selectedSession !== "All" && !paper.paperType?.toLowerCase().includes(selectedSession.toLowerCase()) && !paper.session.toLowerCase().includes(selectedSession.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [papers, selectedBoard, selectedYear, selectedSession, selectedGroup]);

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
            <span>Unit 3: OOP in C++</span>
            <span className="text-purple-700">35% Weightage</span>
          </div>
          <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: "35%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Unit 4: Data Structures</span>
            <span className="text-sky-700">28% Weightage</span>
          </div>
          <div className="w-full bg-sky-100 h-2 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: "28%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
            <span>Unit 1 & 2: Basics & Control</span>
            <span className="text-emerald-700">37% Weightage</span>
          </div>
          <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "37%" }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs">
          <i className="fa-solid fa-lightbulb"></i>
          <span>Exam Tip for Uzair</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Past papers analysis shows that <strong>C++ programming output questions</strong> carry at least 15 marks in every annual paper. Practice Unit 3 examples thoroughly!
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-filter"
      rightPanelLabel="Filters"
      pageTitle="Computer Science"
      badge="11th Standard"
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
              <span className="bg-purple-100 text-purple-700 font-bold text-xs px-3.5 py-2 rounded-xl">
                {filteredPapers.length} {filteredPapers.length === 1 ? "Paper" : "Papers"} Available
              </span>
            </div>
          </div>

          {/* Advanced Filter Toolbar */}
          <div className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <i className="fa-solid fa-filter text-purple-600"></i>
                <span>Filter Past Papers</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Board Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Board</label>
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs"
                >
                  <option value="All">All BISE Boards</option>
                  <option value="Lahore">BISE Lahore</option>
                  <option value="Rawalpindi">BISE Rawalpindi</option>
                  <option value="Faisalabad">BISE Faisalabad</option>
                  <option value="Multan">BISE Multan</option>
                  <option value="Punjab">All Punjab Boards</option>
                </select>
              </div>

              {/* 2. Year Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs"
                >
                  <option value="All">All Years (2020 - 2025)</option>
                  <option value="2025">Annual 2025</option>
                  <option value="2024">Annual 2024</option>
                  <option value="2023">Annual 2023</option>
                  <option value="2022">Annual 2022</option>
                  <option value="2021">Annual 2021</option>
                </select>
              </div>

              {/* 3. Session Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Session</label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs"
                >
                  <option value="All">All Sessions</option>
                  <option value="Group 1">Morning / Group 1</option>
                  <option value="Group 2">Evening / Group 2</option>
                  <option value="Annual">Annual Session</option>
                </select>
              </div>

              {/* 4. Group Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Study Group</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-purple-500 shadow-2xs"
                >
                  <option value="All">Science Group (Pre-Eng / ICS)</option>
                  <option value="Computer">Computer Science Group</option>
                  <option value="Arts">General / Arts Group</option>
                </select>
              </div>
            </div>
          </div>

          {/* Past Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPapers.map((paper) => {
              const isMorning = paper.paperType?.toLowerCase().includes("group 1") || paper.paperType?.toLowerCase().includes("morning");
              return (
                <div
                  key={paper.id}
                  className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-white p-5 rounded-3xl border border-purple-100/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-lg">
                          {paper.session} {paper.year}
                        </span>
                        <span
                          className={`px-2 py-0.5 font-semibold text-[10px] rounded-md ${
                            isMorning ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {paper.paperType || (isMorning ? "Morning" : "Evening")}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Solved
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{paper.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Computer Science Paper I (Objective & Subjective with complete examiner marking scheme).
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-purple-100/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Total Marks: {paper.totalMarks}
                    </span>
                    <div className="flex space-x-2">
                      <a
                        href={paper.fileUrl || "#"}
                        download
                        title="Download PDF"
                        className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-2xs cursor-pointer inline-flex items-center"
                      >
                        <i className="fa-solid fa-download mr-1"></i> PDF
                      </a>
                      <Link
                        href={`/past-papers/${paper.id}`}
                        title="View Solved Questions"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm cursor-pointer inline-block"
                      >
                        View Paper
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPapers.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-slate-200/80">
                <i className="fa-solid fa-folder-open text-3xl text-slate-300 mb-2"></i>
                <p className="text-sm font-bold text-slate-600">No past papers found matching your filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-3 text-xs text-purple-600 font-bold hover:underline cursor-pointer"
                >
                  Clear all filters
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
