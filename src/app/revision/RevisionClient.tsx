"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface RevisionTopic {
  id: string;
  unit: string;
  badge: string;
  title: string;
  description: string;
  notes: string;
}

export function RevisionClient() {
  const [activeNotesTopic, setActiveNotesTopic] = useState<RevisionTopic | null>(null);

  const [checklist, setChecklist] = useState([
    { id: 1, text: "Pointers vs References", checked: true },
    { id: 2, text: "Class Constructors/Destructors", checked: true },
    { id: 3, text: "IPv4 vs IPv6 Addressing", checked: true },
    { id: 4, text: "Primary Key vs Foreign Key", checked: true },
    { id: 5, text: "Polymorphism Code Questions", checked: false },
    { id: 6, text: "Stack vs Queue LIFO/FIFO", checked: false },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const topics: RevisionTopic[] = [
    {
      id: "t1",
      unit: "Unit 3: OOP in C++",
      badge: "15 Marks Guaranteed",
      title: "Virtual Functions & Polymorphism",
      description:
        "Review how base class pointers bind with derived class objects dynamically using the virtual keyword. Frequently asked as code output tracing questions.",
      notes:
        "• Virtual functions provide dynamic binding at runtime.\n• Declared in base class using keyword `virtual`.\n• Resolved via VTABLE (Virtual Method Table).\n• If a base class has at least one pure virtual function (`= 0`), it becomes an Abstract Class.\n• Past paper tip: Always override in derived class with matching signature!",
    },
    {
      id: "t2",
      unit: "Unit 2: Networks",
      badge: "10 Marks Objective",
      title: "OSI Model Layers & TCP/IP Protocols",
      description:
        "Go through the functions of Data Link, Transport, and Application layers. Memorize port numbers and difference between connection-oriented vs connectionless protocols.",
      notes:
        "• OSI has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application (Please Do Not Throw Sausage Pizza Away).\n• Transport Layer handles end-to-end delivery (TCP: reliable/connection-oriented, UDP: fast/connectionless).\n• Routers operate at Layer 3 (Network Layer, IP packets).\n• Switches operate at Layer 2 (Data Link Layer, MAC frames).",
    },
    {
      id: "t3",
      unit: "Unit 4: File Handling",
      badge: "Long Question Favorite",
      title: "Binary File Operations & Struct Read/Write",
      description:
        "Practice syntax of read() and write() functions using ios::binary mode. Essential for programming subjective part.",
      notes:
        "• Syntax: `file.write((char*)&student, sizeof(student));`\n• Syntax: `file.read((char*)&student, sizeof(student));`\n• File modes: `ios::in`, `ios::out`, `ios::app`, `ios::binary`.\n• Remember to close file stream: `file.close();` to flush buffers.",
    },
    {
      id: "t4",
      unit: "Unit 1: Basics",
      badge: "Short Notes Core",
      title: "Memory Hierarchy & Bus Interconnection",
      description:
        "Quick review of Cache memory vs Primary memory access speed, and how system bus coordinates data flow between CPU, RAM, and I/O devices.",
      notes:
        "• Registers > Cache (L1, L2, L3) > RAM > Secondary Storage (SSD/HDD).\n• System Bus consists of:\n  1. Control Bus (coordinates signals)\n  2. Address Bus (unidirectional, determines addressable memory)\n  3. Data Bus (bidirectional, width defines data transfer per cycle).",
    },
  ];

  const checkedCount = checklist.filter((c) => c.checked).length;

  const rightRail = (
    <div className="space-y-6">
      {/* Essential Board Exam Checklist Box */}
      <div className="bg-gradient-to-br from-slate-50 to-sky-50/20 p-4 rounded-3xl border border-sky-100/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Exam Checklist
          </span>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full">
            {checkedCount} / {checklist.length} Done
          </span>
        </div>
        <div className="space-y-2 text-xs text-slate-600">
          {checklist.map((item) => (
            <label
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-white/60 transition cursor-pointer"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="rounded text-sky-600 focus:ring-0 cursor-pointer"
              />
              <span className={item.checked ? "line-through text-slate-400" : "text-slate-700 font-medium"}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-2 text-xs">
        <h4 className="font-bold text-slate-900">Flashcard Active Recall</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Test your memory on these essential topics right now.
        </p>
        <Link
          href="/mock-test"
          className="w-full mt-2 block text-center bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
        >
          Start Flashcards ⚡
        </Link>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-list-check"
      rightPanelLabel="Checklist"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Tools & Tracking</span>
                <span>/</span>
                <span className="text-sky-600">Board Exams Revision</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Board Exams Essential Topics & Quick Review
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-sky-100 text-sky-700 font-bold text-xs px-3.5 py-2 rounded-xl">
                High-Yield Past Papers Focus
              </span>
            </div>
          </div>

          {/* 4 Info Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Topics */}
            <div className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Topics
                </span>
                <h3 className="text-2xl font-bold text-slate-900">24</h3>
                <span className="text-[11px] text-slate-500 font-medium">High-yield units</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-book"></i>
              </div>
            </div>

            {/* Card 2: Cards Mastered */}
            <div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Mastered
                </span>
                <h3 className="text-2xl font-bold text-emerald-700">18</h3>
                <span className="text-[11px] text-emerald-600 font-medium">Fully reviewed</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>

            {/* Card 3: Overall Mastery % */}
            <div className="bg-gradient-to-br from-slate-50 via-sky-50/30 to-white p-5 rounded-3xl border border-sky-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-1">
                  Overall Mastery
                </span>
                <h3 className="text-2xl font-bold text-sky-700">75%</h3>
                <span className="text-[11px] text-sky-600 font-medium">Retention score</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-chart-pie"></i>
              </div>
            </div>

            {/* Card 4: Topics Ready */}
            <div className="bg-gradient-to-br from-slate-50 via-sky-50/60 to-white p-5 rounded-3xl border border-sky-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-1">
                  Topics Ready
                </span>
                <h3 className="text-2xl font-bold text-sky-700">20 / 24</h3>
                <span className="text-[11px] text-sky-600 font-medium">Exam prepared</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>
          </div>

          {/* Section Description & Purpose Card */}
          <div className="bg-gradient-to-br from-slate-50 via-sky-50/30 to-white p-6 rounded-3xl border border-sky-200/80 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
              <i className="fa-solid fa-bolt text-sky-600"></i>
              <span>Last-Minute Exam Go-Through Guide</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Master high-yield concepts, review essential exam takeaways, and test active recall using
              syllabus-aligned flashcards before your board examinations. These topics carry maximum weightage in
              BISE past papers.
            </p>
          </div>

          {/* Essential High-Yield Topics Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Essential Topics (Most Repeated in Past Papers)
              </h3>
              <span className="text-xs text-slate-400 font-semibold">4 Units Directory</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((t) => (
                <div
                  key={t.id}
                  className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-lg">
                        {t.unit}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {t.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{t.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{t.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-200/60">
                    <Link
                      href="/learn"
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <i className="fa-solid fa-book-open text-[10px]"></i>
                      <span>Review / Read</span>
                    </Link>
                    <button
                      onClick={() => setActiveNotesTopic(t)}
                      className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-3 rounded-xl text-xs transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <i className="fa-solid fa-note-sticky text-[10px] text-amber-500"></i>
                      <span>Notes</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
        </footer>
      </main>

      {/* Quick Revision Notes Modal */}
      {activeNotesTopic && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-note-sticky"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{activeNotesTopic.title}</h3>
                  <span className="text-[10px] font-semibold text-slate-400">{activeNotesTopic.unit}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveNotesTopic(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
              {activeNotesTopic.notes}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveNotesTopic(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentShell>
  );
}
