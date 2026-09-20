"use client";

import React from "react";
import Link from "next/link";

export default function ProgressReportPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-slate-100 text-slate-800 font-sans antialiased py-10 px-4 min-h-screen">
      {/* Top Action Bar for Print/Close */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/progress"
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Progress</span>
        </Link>
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md transition flex items-center space-x-2 cursor-pointer"
        >
          <i className="fa-solid fa-print"></i>
          <span>Print Official Report</span>
        </button>
      </div>

      {/* Official Report Card Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Header / Institution Info */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              CS
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 leading-tight">
                EduStack Learning Management System
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                11th Standard Computer Science Department
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
              Official Transcript
            </span>
            <p className="text-[10px] text-slate-400 mt-1">Date: September 20, 2026</p>
          </div>
        </div>

        {/* Student Profile Details */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Student Name</span>
            <span className="font-bold text-slate-900 text-sm">Uzair Salman</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Roll Number</span>
            <span className="font-bold text-slate-900 text-sm">CS-11-2026-04</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Academic Term</span>
            <span className="font-bold text-slate-900 text-sm">Annual 2026</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">Cumulative Grade</span>
            <span className="font-bold text-emerald-600 text-sm">A+ (88.5%)</span>
          </div>
        </div>

        {/* Unit-wise Performance Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Unit-wise Academic Assessment
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-bold">Unit / Chapter Name</th>
                  <th className="py-3 px-4 font-bold">Weightage</th>
                  <th className="py-3 px-4 font-bold">Quiz Score</th>
                  <th className="py-3 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Unit 1: Basics of IT</td>
                  <td className="py-3 px-4">20%</td>
                  <td className="py-3 px-4 font-mono">94%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-600 font-bold">Passed</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Unit 2: Computer Networks & Security</td>
                  <td className="py-3 px-4">25%</td>
                  <td className="py-3 px-4 font-mono">89%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-600 font-bold">Passed</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Unit 3: Object-Oriented Programming (C++)</td>
                  <td className="py-3 px-4">35%</td>
                  <td className="py-3 px-4 font-mono">85%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-600 font-bold">Passed</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Unit 4: Data Structures & Files</td>
                  <td className="py-3 px-4">20%</td>
                  <td className="py-3 px-4 font-mono">82%</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-600 font-bold">Passed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Remarks & Signatures */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="font-bold text-slate-900 block">Instructor Remarks:</span>
            <p className="text-slate-600 leading-relaxed">
              Uzair has shown exceptional consistency and problem-solving skills in C++ programming modules.
              Recommended for advanced board simulations.
            </p>
          </div>
          <div className="flex flex-col justify-end text-right space-y-8 pt-4">
            <div>
              <div className="w-48 ml-auto border-b border-slate-300 pb-1 font-bold text-slate-900">
                Dr. M. Arshad
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
                Head of Computer Science Department
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          <p>This is a system-generated official academic report from EduStack LMS. No signature required.</p>
        </div>
      </div>
    </div>
  );
}
