"use client";

import React, { useState } from "react";

export function DashboardCalendar() {
  // Base date initialized to September 2026 (or current active academic session)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 16)); // Month 8 = September
  const [selectedDay, setSelectedDay] = useState(16);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate days in month and starting day of week (Monday as day 0)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayRaw = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const startingCol = (firstDayRaw + 6) % 7; // Monday = 0, Sunday = 6

  // Previous month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  const leadingDays = Array.from({ length: startingCol }, (_, i) => prevMonthDays - startingCol + 1 + i);

  // Trailing days to complete grid of 35 or 42 cells
  const totalCells = Math.ceil((startingCol + daysInMonth) / 7) * 7;
  const trailingCount = totalCells - (startingCol + daysInMonth);
  const trailingDays = Array.from({ length: trailingCount }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50/40 to-white p-3.5 rounded-3xl border border-indigo-100/70 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-slate-800 text-xs">
          {monthNames[month]} {year}
        </h4>
        <div className="flex space-x-1">
          <button
            onClick={handlePrevMonth}
            title="Previous Month"
            className="w-6 h-6 rounded-lg hover:bg-indigo-100/60 flex items-center justify-center text-indigo-600 text-xs transition cursor-pointer"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            onClick={handleNextMonth}
            title="Next Month"
            className="w-6 h-6 rounded-lg hover:bg-indigo-100/60 flex items-center justify-center text-indigo-600 text-xs transition cursor-pointer"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-indigo-400 mb-1.5">
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
        <span>S</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {/* Leading days from previous month */}
        {leadingDays.map((d, i) => (
          <div key={`lead-${i}`} className="py-0.5 text-slate-300 font-medium">
            {d}
          </div>
        ))}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isSelected = selectedDay === day;
          return (
            <div
              key={`day-${day}`}
              onClick={() => setSelectedDay(day)}
              className={`py-0.5 rounded-lg cursor-pointer transition ${
                isSelected
                  ? "bg-indigo-600 text-white font-bold shadow-xs shadow-indigo-500/30 scale-105"
                  : "text-slate-700 hover:bg-indigo-50 font-medium"
              }`}
            >
              {day}
            </div>
          );
        })}

        {/* Trailing days from next month */}
        {trailingDays.map((d, i) => (
          <div key={`trail-${i}`} className="py-0.5 text-slate-300 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Selected Day Status */}
      <div className="mt-2.5 pt-2 border-t border-indigo-100/50 flex items-center justify-between text-[10px] text-slate-500">
        <span className="font-semibold text-indigo-700">
          Selected: {monthNames[month].slice(0, 3)} {selectedDay}, {year}
        </span>
        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
          Active Study Day
        </span>
      </div>
    </div>
  );
}
