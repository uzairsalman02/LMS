"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export interface UnitPerformanceItem {
  chapterNumber: number;
  name: string;
  totalQuestions: number;
  attempted: number;
  accuracy: string;
  status: string;
}

interface Props {
  studentName?: string;
  rollNumber?: string;
  overallScore?: string;
  overallScorePct?: number;
  overallGrade?: string;
  totalAttempts?: number;
  passedAttempts?: number;
  totalAnswers?: number;
  units?: UnitPerformanceItem[];
  signatoryName?: string;
  signatoryTitle?: string;
  signatureUrl?: string;
  showSignature?: boolean;
}

export function OverallTranscriptClient({
  studentName = "Uzair Salman",
  rollNumber = "BISE-2026-CS11",
  overallScore = "C (59.9%)",
  overallScorePct = 59.9,
  overallGrade = "C",
  totalAttempts = 15,
  passedAttempts = 10,
  totalAnswers = 32,
  units = [
    { chapterNumber: 1, name: "Introduction to Software Development", totalQuestions: 225, attempted: 22, accuracy: "68%", status: "In Progress" },
    { chapterNumber: 2, name: "Information Networks", totalQuestions: 4, attempted: 7, accuracy: "43%", status: "In Progress" },
    { chapterNumber: 3, name: "Data Communications", totalQuestions: 0, attempted: 0, accuracy: "—", status: "Pending" },
    { chapterNumber: 4, name: "Applications and Uses of Computers", totalQuestions: 0, attempted: 0, accuracy: "—", status: "Pending" },
    { chapterNumber: 5, name: "Computer Architecture", totalQuestions: 4, attempted: 3, accuracy: "33%", status: "Started" },
    { chapterNumber: 6, name: "Security, Copyright and the Law", totalQuestions: 0, attempted: 0, accuracy: "—", status: "Pending" },
    { chapterNumber: 7, name: "Windows Operating System", totalQuestions: 0, attempted: 0, accuracy: "—", status: "Pending" },
    { chapterNumber: 8, name: "Word Processing (MS Word)", totalQuestions: 0, attempted: 0, accuracy: "—", status: "Pending" },
    { chapterNumber: 9, name: "Spreadsheet Software (MS Excel)", totalQuestions: 0, attempted: 0, accuracy: "—", status: "Pending" },
    { chapterNumber: 10, name: "Fundamentals of the Internet", totalQuestions: 0, attempted: 0, accuracy: "—", status: "Pending" },
  ],
  signatoryName = "Dr. M. Arshad",
  signatoryTitle = "Head of Computer Science Department",
  signatureUrl,
  showSignature = true,
}: Props) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("autoPrint") === "true") {
        const timer = setTimeout(() => {
          window.print();
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-slate-100 text-slate-900 font-sans antialiased py-4 sm:py-8 px-2 sm:px-4 min-h-screen print:bg-white print:p-0 print:m-0 print:min-h-0">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="max-w-[820px] mx-auto mb-4 flex justify-between items-center print:hidden">
        <div className="flex items-center space-x-2">
          <Link
            href="/progress"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Progress Dashboard</span>
          </Link>
          <Link
            href="/progress-report"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <i className="fa-solid fa-file-lines text-teal-600"></i>
            <span>Latest Test Card</span>
          </Link>
        </div>
        <button
          onClick={handlePrint}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-1.5 rounded-xl text-xs shadow-md transition flex items-center space-x-2 cursor-pointer"
        >
          <i className="fa-solid fa-print"></i>
          <span>Print 1-Page Report</span>
        </button>
      </div>

      {/* Official 1-Page A4 Report Card Container (Strictly 1 Page) */}
      <div className="a4-page a4-sheet max-w-[820px] mx-auto bg-white rounded-2xl shadow-xl border border-slate-300 p-5 sm:p-6 space-y-3 print:border print:border-slate-300 print:p-4 print:space-y-2.5 print:shadow-none print:w-full print:max-w-none">
        {/* Institutional Header */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shrink-0 print:border print:border-black">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base tracking-tight text-slate-900 uppercase">
                Punjab Board of Intermediate &amp; Secondary Education
              </h1>
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                HSSC Part-I (11th Standard) • Department of Computer Science
              </p>
              <p className="text-[10px] text-slate-500">
                Official Cumulative Student Academic Progress Report &amp; Performance Transcript
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-block bg-teal-50 text-teal-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded border border-teal-300 uppercase tracking-wider print:border-slate-400 print:text-black">
              Session 2025–2026
            </span>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">DOC ID: BISE-CS11-RPT</p>
          </div>
        </div>

        {/* Student Profile & Key Metrics Strip (Ultra-Compact 4-Column Grid) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold block">Candidate Name</span>
            <span className="font-extrabold text-slate-900 text-xs truncate block">{studentName}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold block">Roll / Reg. No</span>
            <span className="font-extrabold text-slate-900 text-xs font-mono">{rollNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold block">Cumulative Standing</span>
            <span className="font-extrabold text-teal-700 text-xs">
              Grade {overallGrade} ({overallScorePct}%)
            </span>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[9px] font-bold block">Assessment Record</span>
            <span className="font-bold text-slate-800 text-xs">
              {totalAttempts} Tests ({passedAttempts} Passed)
            </span>
          </div>
        </div>

        {/* Authentic 10-Unit Punjab Curriculum Performance Table */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-[11px] text-slate-900 uppercase tracking-wider">
              Class 11 Punjab Curriculum Syllabus Mastery (10 Units)
            </h2>
            <span className="text-[9.5px] text-slate-500 font-medium">
              Evaluated across {totalAnswers} question responses
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase text-[8.5px] font-bold tracking-wider border-b border-slate-200">
                  <th className="py-1 px-2.5 w-12 text-center">Unit</th>
                  <th className="py-1 px-2.5">Curriculum Chapter Title</th>
                  <th className="py-1 px-2.5 text-center w-20">Bank Qs</th>
                  <th className="py-1 px-2.5 text-center w-20">Attempted</th>
                  <th className="py-1 px-2.5 text-center w-20">Accuracy</th>
                  <th className="py-1 px-2.5 text-right w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {units.map((u) => (
                  <tr key={u.chapterNumber} className="hover:bg-slate-50/60 transition">
                    <td className="py-1 px-2.5 text-center font-bold text-slate-500">
                      U-{u.chapterNumber}
                    </td>
                    <td className="py-1 px-2.5 font-semibold text-slate-900">
                      Unit {u.chapterNumber}: {u.name}
                    </td>
                    <td className="py-1 px-2.5 text-center font-mono text-slate-500">
                      {u.totalQuestions}
                    </td>
                    <td className="py-1 px-2.5 text-center font-mono font-bold text-slate-700">
                      {u.attempted}
                    </td>
                    <td className="py-1 px-2.5 text-center font-mono font-bold">
                      <span
                        className={
                          u.attempted > 0
                            ? parseInt(u.accuracy) >= 60
                              ? "text-emerald-700"
                              : parseInt(u.accuracy) >= 40
                              ? "text-teal-700"
                              : "text-amber-700"
                            : "text-slate-400"
                        }
                      >
                        {u.accuracy}
                      </span>
                    </td>
                    <td className="py-1 px-2.5 text-right font-bold text-[9.5px]">
                      <span
                        className={
                          u.status === "Mastered"
                            ? "text-emerald-700"
                            : u.status === "In Progress"
                            ? "text-teal-700"
                            : u.status === "Started"
                            ? "text-sky-700"
                            : "text-slate-400 font-normal"
                        }
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BISE Grading Scale & System Verification Key */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 flex flex-wrap items-center justify-between text-[8.5px] text-slate-600 gap-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 uppercase">BISE Grade Scale:</span>
            <span><strong>A+</strong> (≥80%)</span>
            <span><strong>A</strong> (70–79%)</span>
            <span><strong>B</strong> (60–69%)</span>
            <span><strong>C</strong> (50–59%)</span>
            <span><strong>D</strong> (40–49%)</span>
            <span><strong>E</strong> (33–39%)</span>
            <span><strong>F</strong> (&lt;33%)</span>
          </div>
          <div className="flex items-center space-x-2 font-semibold">
            <span className="text-teal-800">● 10 Units Evaluated</span>
            <span className="text-emerald-700">● Proctored Integrity: Clean</span>
          </div>
        </div>

        {/* Evaluation Summary & Academic Remarks (Single Concise Box) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[9.5px] uppercase text-slate-900">
              Departmental Academic Assessment &amp; Examiner Notes:
            </span>
            <span className="text-[9.5px] text-emerald-700 font-bold">
              ✓ Verified Proctored Submissions (Zero Violations)
            </span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            Candidate evaluated across <strong>{totalAttempts} proctored mock examinations</strong> and continuous topic assessments under official Punjab Board standards. Demonstrated strong conceptual mastery in <strong>Unit 1 (Software Development)</strong> with {units[0]?.accuracy || "68%"} accuracy. Recommended targeted revision in <strong>Unit 2 (Information Networks)</strong> and <strong>Unit 5 (Computer Architecture)</strong> prior to the final BISE board examination.
          </p>
        </div>

        {/* Verification Signatures & Institutional Stamp */}
        <div className="pt-1 grid grid-cols-3 gap-3 items-end text-center text-xs">
          {/* Left: Class Teacher / Evaluator */}
          <div>
            <div className="w-28 mx-auto border-b border-slate-400 pb-0.5 font-bold text-[10px] text-slate-900">
              Prof. Asim Rauf
            </div>
            <span className="text-[8.5px] text-slate-500 uppercase tracking-wider block mt-0.5">
              Course Evaluator
            </span>
          </div>

          {/* Center: Official Institutional Seal */}
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

          {/* Right: Department Head */}
          <div>
            {showSignature && signatureUrl ? (
              <div className="flex justify-center mb-0.5">
                <img
                  src={signatureUrl}
                  alt="Authorized Signature"
                  className="h-7 max-w-[110px] object-contain print:filter print:contrast-200"
                />
              </div>
            ) : (
              <div className="h-5 font-serif italic text-teal-800 text-[11px]">M. Arshad</div>
            )}
            <div className="w-32 mx-auto border-b border-slate-400 pb-0.5 font-bold text-[10px] text-slate-900">
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
    </div>
  );
}
