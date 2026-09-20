"use client";

import React from "react";
import Link from "next/link";

export default function StudentCardPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Top Action Bar for Print/Back */}
      <div className="w-full max-w-sm mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/profile"
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Profile</span>
        </Link>
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md transition flex items-center space-x-2 cursor-pointer"
        >
          <i className="fa-solid fa-print"></i>
          <span>Print Card Now</span>
        </button>
      </div>

      {/* Official ID Card Layout */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative print:border-2 print:border-slate-300 print:shadow-none">
        {/* Card Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-5 text-white text-center relative">
          <div className="absolute top-3 left-3 w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-xs font-bold">
            CS
          </div>
          <h2 className="font-extrabold text-sm tracking-wide uppercase">EduStack LMS College</h2>
          <p className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">
            Official Student Identity Card
          </p>
        </div>

        {/* Card Body Content */}
        <div className="p-6 text-center space-y-4">
          {/* Student Avatar / Initials */}
          <div className="relative -mt-12 mb-3 inline-block">
            <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md mx-auto">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-2xl flex items-center justify-center shadow-inner">
                US
              </div>
            </div>
            <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">Uzair Salman</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">11th Standard • Computer Science</p>
          </div>

          {/* Details Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Roll Number:</span>
              <span className="font-bold font-mono text-slate-800">CS-11-2026-04</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Date of Birth:</span>
              <span className="font-bold text-slate-800">24 Oct 1989</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Valid Academic Term:</span>
              <span className="font-bold text-slate-800">Annual 2026 - 2027</span>
            </div>
          </div>

          {/* Barcode & Authority Signature */}
          <div className="pt-2 space-y-3">
            <div className="bg-white p-2 rounded-xl border border-slate-200 text-center font-mono font-bold text-slate-800 tracking-widest text-sm shadow-inner">
              ||| | | |||| || | ||||| | ||
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Authorized Signature</span>
              <span className="font-bold text-slate-700">Principal, EduStack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
