"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserGuideModal } from "../modals/UserGuideModal";

interface HeaderProps {
  onToggleMenu?: () => void;
  onToggleRightPanel?: () => void;
  onOpenAITutor?: () => void;
  title?: string;
  badge?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMenu,
  onToggleRightPanel,
  title = "Computer Science",
  badge = "11th Standard",
}) => {
  const [showSupport, setShowSupport] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <header className="bg-white sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Corner: App Logo & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <button
              id="menu-btn"
              onClick={onToggleMenu}
              title="Toggle Navigation Menu"
              className="text-slate-500 hover:text-slate-700 md:hidden focus:outline-none relative group cursor-pointer"
            >
              <i className="fa-solid fa-bars text-xl"></i>
              <span className="absolute top-full left-0 mt-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
                Menu
              </span>
            </button>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20">
                CS
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                  {title}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {badge}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <i className="fa-solid fa-search"></i>
              </span>
              <input
                type="text"
                title="Search chapters, topics, or past papers..."
                placeholder="Search chapters, topics, or past papers..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-sm focus:bg-white focus:border-brand-500 focus:outline-none shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Right Side: Support Modal Trigger & Logout */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 relative">
            {/* Support Button with Caption */}
            <button
              id="support-btn"
              onClick={() => setShowSupport(!showSupport)}
              title="Support & Developer Info"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold transition relative group cursor-pointer"
            >
              <i className="fa-solid fa-circle-question text-slate-500"></i>
              <span className="hidden sm:inline">Support</span>
            </button>

            {/* Support Popover Modal Box */}
            {showSupport && (
              <div
                id="support-modal"
                className="absolute top-full right-0 sm:right-16 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      <i className="fa-solid fa-headset"></i>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Developer & Support
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowSupport(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="py-3 space-y-2.5 text-xs text-slate-600">
                  <p>
                    <strong className="text-slate-800">Developer:</strong> Uzair Salman
                  </p>
                  <p>
                    <strong className="text-slate-800">Support Email:</strong> support@edustack.edu.pk
                  </p>
                  <p>
                    <strong className="text-slate-800">Contact Number:</strong> +92 300 1234567
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setShowSupport(false);
                      setShowGuide(true);
                    }}
                    title="Open Student User Guide"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <i className="fa-solid fa-book text-[10px]"></i>
                    <span>User Guide</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-medium">v2.4.0 Stable</span>
                </div>
              </div>
            )}

            {/* Logout Button with Caption */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to log out of your student session?")) {
                  window.location.href = "/dashboard";
                }
              }}
              title="Logout Account"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs font-semibold transition relative group cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Right Panel Trigger */}
            <button
              id="right-panel-btn"
              onClick={onToggleRightPanel}
              title="View Profile & Schedule"
              className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-semibold text-slate-700 text-xs shadow-sm lg:hidden ml-1 relative group cursor-pointer"
            >
              US
              <span className="absolute top-full right-0 mt-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
                Profile
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* User Guide Modal */}
      {showGuide && <UserGuideModal onClose={() => setShowGuide(false)} />}
    </>
  );
};
