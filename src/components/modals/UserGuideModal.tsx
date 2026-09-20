"use client";

import React from "react";

interface UserGuideModalProps {
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ onClose }) => {
  return (
    <div
      id="lms-user-guide-modal"
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          id="close-guide-modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded-lg cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-lg font-bold">
            <i className="fa-solid fa-book-open-reader"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Student User Guide</h3>
            <p className="text-xs text-slate-500">11th Standard Computer Science LMS</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
              <i className="fa-solid fa-graduation-cap text-sky-600"></i>
              <span>1. Learn Hub & Interactive Cards</span>
            </h4>
            <p>
              Study chapter topics through bite-sized flashcards with code snippets, Urdu
              terminology, and exam rubrics.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
              <i className="fa-solid fa-pen-to-square text-rose-600"></i>
              <span>2. Practice & Mock Exams</span>
            </h4>
            <p>
              Generate timed or untimed practice sets by chapter, or launch the official Board
              Exam Simulation with live timer.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
              <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
              <span>3. Mistakes & Recovery</span>
            </h4>
            <p>
              Questions answered incorrectly in tests are automatically stored in the Mistakes
              Hub for targeted re-drilling.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
              <i className="fa-solid fa-chart-line text-teal-600"></i>
              <span>4. Progress & Official Reports</span>
            </h4>
            <p>
              Track accuracy, syllabus coverage, and export your official printable student
              report card anytime.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            id="got-it-guide-btn"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
