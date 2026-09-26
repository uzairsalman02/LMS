"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface SerializedOccurrence {
  boardName: string;
  boardCode: string;
  year: number;
  session?: string | null;
  paperType?: string;
}

export interface SerializedOption {
  id: string;
  text: string;
  order: number;
  isCorrect: boolean;
}

export interface SerializedAnswerItem {
  id: string;
  questionId: string;
  questionText: string;
  questionType?: "MCQ" | "SHORT" | "LONG";
  chapterTitle: string;
  marksObtained: number;
  maxMarks: number;
  isCorrect: boolean;
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  correctOptionText: string | null;
  typedAnswer?: string | null;
  modelAnswer?: string | null;
  aiFeedback?: {
    marksObtained?: number;
    maxMarks?: number;
    isCorrect?: boolean;
    scorePercentage?: number;
    matchedConcepts?: string[];
    missingConcepts?: string[];
    feedbackText?: string;
  } | null;
  explanation: string | null;
  pastPaperOccurrences: SerializedOccurrence[];
  repeatCount: number;
  options: SerializedOption[];
}

export interface SerializedAttemptReport {
  id: string;
  testTitle: string;
  studentName: string;
  rollNumber: string;
  dateFormatted: string;
  durationFormatted: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  gradeBadgeClass: string;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalQuestions: number;
  answers: SerializedAnswerItem[];
  proctoring?: {
    violationsCount: number;
    violationLogs: Array<{ time: string; type: string }>;
    terminationReason?: string | null;
    integrityStatus: "CLEAN" | "WARNINGS_RECORDED" | "DISQUALIFIED_AUTO_SUBMIT" | string;
  };
}

interface Props {
  report: SerializedAttemptReport;
  overallTranscriptAvailable?: boolean;
  signatoryName?: string;
  signatoryTitle?: string;
  signatureUrl?: string;
  showSignature?: boolean;
}

export function CurrentTestReportClient({
  report,
  signatoryName = "Dr. M. Arshad",
  signatoryTitle = "Head of Computer Science Examination Cell",
  signatureUrl,
  showSignature = true,
}: Props) {
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "correct" | "incorrect" | "skipped">("all");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Group questions by chapter for the A4-friendly Unit Breakdown Table
  const chapterMap: Record<
    string,
    { total: number; correct: number; marks: number; maxMarks: number }
  > = {};

  report.answers.forEach((ans) => {
    const chap = ans.chapterTitle || "Computer Science (11th Standard)";
    if (!chapterMap[chap]) {
      chapterMap[chap] = { total: 0, correct: 0, marks: 0, maxMarks: 0 };
    }
    chapterMap[chap].total += 1;
    if (ans.isCorrect) chapterMap[chap].correct += 1;
    chapterMap[chap].marks += ans.marksObtained;
    chapterMap[chap].maxMarks += ans.maxMarks;
  });

  const chapterStats = Object.entries(chapterMap).map(([title, s]) => ({
    title,
    total: s.total,
    correct: s.correct,
    percentage: Math.round((s.correct / (s.total || 1)) * 100),
    status:
      s.correct / s.total >= 0.8
        ? "Mastered"
        : s.correct / s.total >= 0.5
        ? "Passed"
        : "Needs Review",
  }));

  const filteredAnswers = report.answers.filter((ans) => {
    if (filterMode === "correct") return ans.isCorrect;
    if (filterMode === "incorrect") return !ans.isCorrect && ans.selectedOptionId !== null;
    if (filterMode === "skipped") return ans.selectedOptionId === null;
    return true;
  });

  return (
    <div className="bg-slate-100 text-slate-800 font-sans antialiased py-6 sm:py-8 px-3 sm:px-6 min-h-screen print:bg-white print:p-0 print:m-0 print:min-h-0">
      {/* Top Action Bar (Strictly Hidden during Print) */}
      <div className="max-w-[820px] mx-auto mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
        <div className="flex items-center space-x-2">
          <Link
            href="/exam-mode"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Exam Mode</span>
          </Link>
          <Link
            href="/progress"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-chart-line text-emerald-600"></i>
            <span>Progress Hub</span>
          </Link>
          <Link
            href="/progress-report?type=overall"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-graduation-cap text-teal-600"></i>
            <span>Overall Transcript</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowDetailedReview(!showDetailedReview)}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <i className={`fa-solid fa-eye${showDetailedReview ? "-slash" : ""}`}></i>
            <span>{showDetailedReview ? "Hide Screen Review" : "Screen Detailed Review"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs shadow-md transition flex items-center space-x-2 cursor-pointer"
          >
            <i className="fa-solid fa-print"></i>
            <span>Print 1-Page Report</span>
          </button>
        </div>
      </div>

      {/* SINGLE A4 PAGE CONTAINER: Optimized strictly for 210mm x 297mm sheet */}
      <div className="a4-page a4-sheet max-w-[820px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-300 p-5 sm:p-6 space-y-3 print:border print:border-slate-300 print:p-4 print:space-y-2.5 print:shadow-none print:w-full print:max-w-none">
        {/* 1. Header: Institution & Assessment Title */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shrink-0 print:border print:border-black">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                {report.testTitle}
              </h1>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                HSSC Part-I (11th Standard) • Department of Computer Science
              </p>
              <p className="text-[10px] text-slate-500">
                Official Punjab Examination Board Assessment Record &amp; Performance Sheet
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-block bg-teal-50 text-teal-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded border border-teal-300 uppercase tracking-wider print:border-slate-400 print:text-black">
              Official Assessment
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5 font-medium">{report.dateFormatted}</p>
          </div>
        </div>

        {/* 2. Student & Session Information Bar */}
        <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200/80 grid grid-cols-4 gap-2 text-[11px]">
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[9px]">Student Name</span>
            <span className="font-bold text-slate-900 text-xs truncate block">{report.studentName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[9px]">Roll Number</span>
            <span className="font-bold text-slate-900 text-xs block">{report.rollNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[9px]">Duration Taken</span>
            <span className="font-bold text-slate-900 text-xs block">{report.durationFormatted}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[9px]">Exam Integrity</span>
            {report.proctoring?.violationsCount === undefined || report.proctoring?.violationsCount === 0 ? (
              <span className="font-bold text-emerald-700 text-xs flex items-center space-x-1">
                <i className="fa-solid fa-shield-halved text-[10px] text-emerald-600"></i>
                <span>Clean (0 Warnings)</span>
              </span>
            ) : report.proctoring.violationsCount < 3 ? (
              <span className="font-bold text-amber-700 text-xs flex items-center space-x-1">
                <i className="fa-solid fa-triangle-exclamation text-[10px] text-amber-600"></i>
                <span>{report.proctoring.violationsCount} Warnings</span>
              </span>
            ) : (
              <span className="font-bold text-rose-700 text-xs flex items-center space-x-1">
                <i className="fa-solid fa-ban text-[10px] text-rose-600"></i>
                <span>Disqualified</span>
              </span>
            )}
          </div>
        </div>

        {/* Proctoring Audit Alert (if violations occurred) */}
        {report.proctoring && report.proctoring.violationsCount > 0 && (
          <div
            className={`border rounded-xl p-2.5 flex items-start space-x-2 text-[11px] print:border-black print:bg-white print:text-black ${
              report.proctoring.violationsCount >= 3
                ? "bg-rose-50/80 border-rose-200 text-rose-900"
                : "bg-amber-50/80 border-amber-200 text-amber-900"
            }`}
          >
            <i
              className={`fa-solid ${
                report.proctoring.violationsCount >= 3
                  ? "fa-ban text-rose-600"
                  : "fa-triangle-exclamation text-amber-600"
              } mt-0.5 text-xs print:hidden`}
            ></i>
            <div>
              <span className="font-bold">Proctoring Audit:</span>{" "}
              {report.proctoring.violationsCount >= 3
                ? "Session was forcibly locked and submitted because candidate exceeded the maximum 3 window/tab switch threshold."
                : `${report.proctoring.violationsCount} external window/tab switch event(s) logged during examination.`}
            </div>
          </div>
        )}

        {/* 3. Compact 4 KPI Performance Cards */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="bg-gradient-to-br from-slate-50 to-white p-2.5 rounded-xl border border-slate-200 text-center space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Score Obtained</span>
            <div className="text-lg font-black text-slate-900">
              {report.score} <span className="text-[11px] font-normal text-slate-400">/ {report.maxScore}</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 block">{report.percentage}% Marks</span>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white p-2.5 rounded-xl border border-slate-200 text-center space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Grade</span>
            <div className="text-lg font-black text-emerald-600">{report.grade.split(" ")[0]}</div>
            <span className="text-[10px] font-medium text-slate-500 block">
              {report.percentage >= 80 ? "Distinction" : report.percentage >= 50 ? "Passed" : "Needs Work"}
            </span>
          </div>

          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 text-center space-y-0.5">
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Accuracy Rate</span>
            <div className="text-lg font-black text-emerald-700">
              {Math.round((report.correctCount / (report.totalQuestions || 1)) * 100)}%
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 block">
              {report.correctCount} / {report.totalQuestions} Correct
            </span>
          </div>

          <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200 text-center space-y-0.5">
            <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">Errors & Skipped</span>
            <div className="text-lg font-black text-rose-700">{report.incorrectCount}</div>
            <span className="text-[10px] font-medium text-rose-600 block">
              {report.skippedCount > 0 ? `${report.skippedCount} Skipped` : "0 Skipped"}
            </span>
          </div>
        </div>

        {/* 4. Unit / Chapter-wise Academic Assessment Table */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Curriculum Unit Performance Summary
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">
              Evaluated across {chapterStats.length} syllabus modules
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[9px] tracking-wider border-b border-slate-200">
                  <th className="py-2 px-3 font-bold">Chapter / Unit</th>
                  <th className="py-2 px-3 font-bold text-center">Questions</th>
                  <th className="py-2 px-3 font-bold text-center">Correct</th>
                  <th className="py-2 px-3 font-bold text-center">Accuracy</th>
                  <th className="py-2 px-3 font-bold text-right">Academic Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {chapterStats.map((ch, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-3 font-semibold text-slate-900">{ch.title}</td>
                    <td className="py-1.5 px-3 text-center font-mono">{ch.total}</td>
                    <td className="py-1.5 px-3 text-center font-mono font-bold text-emerald-600">
                      {ch.correct}
                    </td>
                    <td className="py-1.5 px-3 text-center font-mono font-semibold">{ch.percentage}%</td>
                    <td className="py-1.5 px-3 text-right">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                          ch.percentage >= 80
                            ? "text-emerald-700 bg-emerald-50"
                            : ch.percentage >= 50
                            ? "text-amber-700 bg-amber-50"
                            : "text-rose-700 bg-rose-50"
                        }`}
                      >
                        {ch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Minimal Compact Question Response Key (Fits on A4 without 10-page overflow) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Question-by-Question Response Matrix
            </h3>
            <div className="flex items-center space-x-2 text-[9px] font-semibold text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Correct</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                <span>Incorrect</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                <span>Skipped</span>
              </span>
            </div>
          </div>

          {/* Minimal 10-column or responsive Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80">
            {report.answers.map((ans, idx) => {
              const isUnattempted =
                ans.questionType === "SHORT" || ans.questionType === "LONG"
                  ? !ans.typedAnswer || ans.typedAnswer.trim().length === 0
                  : ans.selectedOptionId === null;
              const hasPastPaper = ans.pastPaperOccurrences && ans.pastPaperOccurrences.length > 0;

              let badgeColor = "bg-white border-emerald-300 text-emerald-700";
              let icon = "✓";

              if (isUnattempted) {
                badgeColor = "bg-white border-slate-300 text-slate-400";
                icon = "-";
              } else if (!ans.isCorrect) {
                badgeColor = "bg-white border-rose-300 text-rose-700";
                icon = "✗";
              }

              return (
                <div
                  key={ans.id}
                  className={`p-1.5 rounded-lg border text-center text-[10px] shadow-2xs ${badgeColor}`}
                  title={`Q${idx + 1}: ${ans.isCorrect ? "Correct" : isUnattempted ? "Skipped" : "Incorrect"}${
                    hasPastPaper ? " (Punjab Board Past Paper)" : ""
                  }`}
                >
                  <div className="font-bold">Q{idx + 1}</div>
                  <div className="font-black text-xs">{icon}</div>
                  {hasPastPaper && (
                    <div className="text-[8px] text-amber-700 font-bold truncate flex items-center justify-center space-x-0.5">
                      <i className="fa-solid fa-building-columns text-[7px]"></i>
                      <span>BISE</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Remarks, Seal & Official Signatures */}
        <div className="pt-1 border-t border-slate-200 grid grid-cols-3 gap-3 items-end text-center text-xs">
          {/* Left: Remarks Box */}
          <div className="text-left bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-0.5 col-span-1">
            <span className="font-extrabold text-[9px] uppercase text-slate-900 block">Evaluator Remarks:</span>
            <p className="text-slate-600 text-[9.5px] leading-tight">
              {report.percentage >= 80
                ? "Excellent mastery aligned with Punjab Board standards. Ready for board exams."
                : report.percentage >= 50
                ? "Satisfactory performance. Recommended to review incorrect responses in Mistakes tracker."
                : "Needs focused conceptual revision. Complete chapter drills before re-attempting."}
            </p>
          </div>

          {/* Center: Official Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-teal-600 flex flex-col items-center justify-center text-[6.5px] font-black text-teal-800 uppercase leading-none tracking-tighter print:border-black print:text-black">
              <span>★ BISE ★</span>
              <span className="my-0.5 text-[7.5px] font-bold">VERIFIED</span>
              <span>2026</span>
            </div>
            <span className="text-[7.5px] text-slate-400 uppercase tracking-widest mt-0.5">
              Official Stamp
            </span>
          </div>

          {/* Right: Department Head Signature */}
          <div className="text-right">
            {showSignature && signatureUrl ? (
              <div className="flex justify-end mb-0.5">
                <img
                  src={signatureUrl}
                  alt="Authorized Signature"
                  className="h-7 max-w-[110px] object-contain print:filter print:contrast-200"
                />
              </div>
            ) : (
              <div className="h-5 font-serif italic text-teal-800 text-[11px]">M. Arshad</div>
            )}
            <div className="w-32 ml-auto border-b border-slate-400 pb-0.5 font-bold text-[10px] text-slate-900">
              {signatoryName}
            </div>
            <span className="text-[8.5px] text-slate-500 uppercase tracking-wider block mt-0.5">
              {signatoryTitle}
            </span>
          </div>
        </div>

        {/* Bottom Micro Print Footer */}
        <div className="pt-0.5 border-t border-slate-100 flex justify-between text-[7.5px] text-slate-400">
          <span>Generated via EduStack LMS • 11th Standard Punjab Board Computer Science</span>
          <span>Printed on {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • Valid Transcript Document • Page 1 of 1</span>
        </div>
      </div>

      {/* OPTIONAL ON-SCREEN DETAILED QUESTION REVIEW (Hidden during print to prevent A4 overflow) */}
      <div className="max-w-4xl mx-auto mt-6 print:hidden">
        {!showDetailedReview ? (
          <div className="text-center py-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-600 mb-2">
              Want to review individual questions, answer keys, and solution explanations on screen?
            </p>
            <button
              onClick={() => setShowDetailedReview(true)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-xl text-xs transition border border-indigo-200 cursor-pointer inline-flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-list-check"></i>
              <span>Open Detailed Question Review (Screen Mode)</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Interactive On-Screen Question Review
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed breakdown of choices and textbook explanations. (Hidden during print).
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    filterMode === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All ({report.totalQuestions})
                </button>
                <button
                  onClick={() => setFilterMode("correct")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    filterMode === "correct" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Correct ({report.correctCount})
                </button>
                <button
                  onClick={() => setFilterMode("incorrect")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    filterMode === "incorrect" ? "bg-rose-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Incorrect ({report.incorrectCount})
                </button>
                {report.skippedCount > 0 && (
                  <button
                    onClick={() => setFilterMode("skipped")}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      filterMode === "skipped" ? "bg-slate-700 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Skipped ({report.skippedCount})
                  </button>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredAnswers.map((ans, idx) => {
                const isSubjective = ans.questionType === "SHORT" || ans.questionType === "LONG";
                const isUnattempted = isSubjective
                  ? !ans.typedAnswer || ans.typedAnswer.trim().length === 0
                  : ans.selectedOptionId === null;

                return (
                  <div
                    key={ans.id}
                    className={`p-4 rounded-2xl border transition ${
                      ans.isCorrect
                        ? "bg-white border-emerald-200/90 shadow-2xs"
                        : isUnattempted
                        ? "bg-slate-50/70 border-slate-200"
                        : "bg-white border-rose-200/90 shadow-2xs"
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded-md">
                          Q{idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">{ans.chapterTitle}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {ans.isCorrect ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            <i className="fa-solid fa-check"></i>
                            <span>Correct (+{ans.marksObtained})</span>
                          </span>
                        ) : isUnattempted ? (
                          <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 border border-slate-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            <i className="fa-solid fa-minus"></i>
                            <span>Skipped</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-rose-700 bg-rose-50 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            <i className="fa-solid fa-xmark"></i>
                            <span>Incorrect</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Past Paper Note */}
                    {ans.pastPaperOccurrences && ans.pastPaperOccurrences.length > 0 && (
                      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 inline-flex items-center space-x-1">
                          <i className="fa-solid fa-building-columns text-[8px] mr-1"></i>
                          <span>{ans.pastPaperOccurrences.map((occ) => `${occ.boardName} (${occ.year})`).join(", ")}</span>
                        </span>
                        {ans.repeatCount > 1 && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/70">
                            Repeated {ans.repeatCount}x
                          </span>
                        )}
                      </div>
                    )}

                    {/* Question text */}
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-relaxed mb-2.5">
                      {ans.questionText}
                    </h4>

                    {/* Conditional: Subjective (Short/Long) vs Objective (MCQ) */}
                    {isSubjective ? (
                      <div className="space-y-3 pt-1">
                        {/* Student Written Response */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                            <i className="fa-solid fa-pen-to-square text-indigo-600"></i>
                            <span>Your Written Submission:</span>
                          </span>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                            {ans.typedAnswer || (
                              <span className="italic text-slate-400">No response provided (Unattempted).</span>
                            )}
                          </div>
                        </div>

                        {/* Automated Evaluation & Concept Breakdown */}
                        {ans.aiFeedback && (
                          <div className="bg-indigo-50/60 border border-indigo-200/80 p-3.5 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-950 flex items-center space-x-1.5">
                                <i className="fa-solid fa-calculator text-indigo-600"></i>
                                <span>Automated Concept-Matching Evaluation</span>
                              </span>
                              <span className="font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                                Marks: {ans.marksObtained} / {ans.maxMarks}
                              </span>
                            </div>

                            {/* Matched Concepts */}
                            {ans.aiFeedback.matchedConcepts && ans.aiFeedback.matchedConcepts.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                                  ✓ Concepts Detected in Your Answer:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {ans.aiFeedback.matchedConcepts.map((c, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold border border-emerald-200"
                                    >
                                      ✓ {c}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Missing Concepts */}
                            {ans.aiFeedback.missingConcepts && ans.aiFeedback.missingConcepts.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                                  ⚠️ Key Examiner Concepts Missing / Incomplete:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {ans.aiFeedback.missingConcepts.map((c, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold border border-amber-200"
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Feedback Text */}
                            {ans.aiFeedback.feedbackText && (
                              <p className="text-[11px] text-slate-700 bg-white/80 p-2 rounded-lg border border-indigo-100 italic leading-relaxed">
                                &ldquo;{ans.aiFeedback.feedbackText}&rdquo;
                              </p>
                            )}
                          </div>
                        )}

                        {/* Official BISE Model Answer */}
                        {ans.modelAnswer && (
                          <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl space-y-1.5 text-xs">
                            <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                              <i className="fa-solid fa-graduation-cap text-emerald-600"></i>
                              <span>Official Punjab Board Model Answer:</span>
                            </span>
                            <div className="text-slate-800 leading-relaxed font-sans whitespace-pre-wrap text-[11px] sm:text-xs">
                              {ans.modelAnswer}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Options for MCQs */
                      <div className="space-y-1.5 mb-2.5">
                        {ans.options.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isSelected = ans.selectedOptionId === opt.id;
                          const isCorrect = opt.isCorrect;

                          let optClass = "border-slate-200 bg-white text-slate-700";
                          let badge = null;

                          if (isCorrect) {
                            optClass = "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold";
                            badge = (
                              <span className="text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                                ✓ Correct Answer
                              </span>
                            );
                          } else if (isSelected) {
                            optClass = "border-rose-500 bg-rose-50/80 text-rose-950 font-semibold";
                            badge = (
                              <span className="text-[9px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full">
                                ✗ Your Choice
                              </span>
                            );
                          }

                          return (
                            <div
                              key={opt.id}
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${optClass}`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-700">
                                  {letter}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                              {badge}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation */}
                    {ans.explanation && !isSubjective && (
                      <div className="mt-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-700 block">Explanation:</span>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{ans.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
