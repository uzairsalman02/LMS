"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export function SettingsClient() {
  const [standard, setStandard] = useState("11th Standard (ICS / Pre-Engineering)");
  const [subjectGroup, setSubjectGroup] = useState("Computer Science (C++ / IT)");
  const [autoSync, setAutoSync] = useState(true);
  const [biometricLock, setBiometricLock] = useState(true);
  const [autoLogout, setAutoLogout] = useState(false);
  const [cacheSize, setCacheSize] = useState("124.5 MB");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleClearCache = () => {
    setCacheSize("0 KB");
    showNotice("Cache cleared successfully! 124.5 MB freed.");
  };

  const handleSave = () => {
    showNotice("Settings saved successfully!");
  };

  const rightRail = (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-white p-4 rounded-3xl flex flex-col items-center text-center relative group border border-slate-100/60 shadow-2xs">
        <div className="relative mb-2 mt-0.5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-md cursor-pointer">
            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden text-slate-600 font-bold text-lg">
              US
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm">Uzair Salman</h3>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">11th Computer Science • 2026</p>
      </div>

      {/* Achievements Card */}
      <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-purple-100/80 p-3.5 rounded-3xl shadow-xs backdrop-blur-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-md shadow-purple-500/30">
              🏆
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Achievements</h4>
              <p className="text-[10px] text-purple-700 font-semibold">3 Badges Unlocked</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-white/90 border border-purple-100/80 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm mb-1">
              💻
            </div>
            <span className="text-[9px] font-bold text-slate-800 leading-tight">Coding Ace</span>
          </div>
          <div className="bg-white/90 border border-purple-100/80 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm mb-1">
              💡
            </div>
            <span className="text-[9px] font-bold text-slate-800 leading-tight">Problem Solver</span>
          </div>
          <div className="bg-white/90 border border-purple-100/80 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm mb-1">
              🚀
            </div>
            <span className="text-[9px] font-bold text-slate-800 leading-tight">Fast Coder</span>
          </div>
        </div>
      </div>

      {/* Upcoming Deadline */}
      <div className="bg-gradient-to-br from-rose-50/60 to-pink-50/30 border border-rose-100 p-3.5 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs mb-1">
          <i className="fa-solid fa-clock"></i>
          <span>Upcoming Deadline</span>
        </div>
        <p className="text-xs text-slate-600 font-medium">OOP Practical Lab Assignment due tomorrow at 11:59 PM.</p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-gear"
      rightPanelLabel="Profile & Schedule"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400"></i>
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      <div className="space-y-6 max-w-4xl mx-auto w-full pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
              <span>Account</span>
              <span>/</span>
              <span className="text-slate-700">Settings Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Application Preferences & Controls</h1>
          </div>
          <span className="bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl">
            v2.4.0 Stable
          </span>
        </div>

        {/* 1. Profile Update Quick Access Card */}
        <Link
          href="/profile"
          className="bg-gradient-to-r from-slate-50 via-purple-50/20 to-white p-5 rounded-3xl border border-slate-200 hover:border-purple-300 shadow-2xs transition flex items-center justify-between group block"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-user-pen"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Profile & Personal Credentials</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click here to update your name, photo, birth date, and contact details.
              </p>
            </div>
          </div>
          <div className="text-purple-600 font-bold text-xs flex items-center space-x-1 pr-2">
            <span>Open Profile</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </div>
        </Link>

        {/* 2. Class & Academic Settings */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center space-x-2">
            <i className="fa-solid fa-graduation-cap text-emerald-600"></i>
            <span>Class & Academic Settings</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Standard / Grade</label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
              >
                <option value="11th Standard (ICS / Pre-Engineering)">11th Standard (ICS / Pre-Engineering)</option>
                <option value="12th Standard (ICS / Pre-Engineering)">12th Standard (ICS / Pre-Engineering)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Primary Subject Group</label>
              <select
                value={subjectGroup}
                onChange={(e) => setSubjectGroup(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
              >
                <option value="Computer Science (C++ / IT)">Computer Science (C++ / IT)</option>
                <option value="General Science">General Science</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Offline & Storage Management */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center space-x-2">
            <i className="fa-solid fa-database text-sky-600"></i>
            <span>Offline & Storage Management</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900">Downloaded Chapter Cache</h4>
                <p className="text-[11px] text-slate-500">
                  Local SQLite storage used for offline learning modules (Units 1-4).
                </p>
              </div>
              <span className="font-mono font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl">
                {cacheSize}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  Auto-sync offline quiz attempts upon internet connection
                </span>
              </label>
              <button
                onClick={handleClearCache}
                className="bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 font-bold px-4 py-2 rounded-xl transition shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>

        {/* 4. Session & Security Features */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-3 flex items-center space-x-2">
            <i className="fa-solid fa-shield-halved text-indigo-600"></i>
            <span>Session & Security Features</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900">Active Device Session</h4>
                <p className="text-[11px] text-slate-500">
                  Jauharabad, Punjab • Chrome on Windows (Current Session)
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
                Active Now
              </span>
            </div>
            <div className="pt-2 space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={biometricLock}
                  onChange={(e) => setBiometricLock(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  Enforce strict biometric / PIN lock on app startup
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLogout}
                  onChange={(e) => setAutoLogout(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  Log out automatically after 30 minutes of inactivity
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-floppy-disk text-xs"></i>
            <span>Save All Settings</span>
          </button>
        </div>

        {/* Borderless Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
        </footer>
      </div>
    </StudentShell>
  );
}
