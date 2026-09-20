"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAITutor?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  onOpenAITutor,
}) => {
  const pathname = usePathname();

  const getLinkClasses = (href: string, activeBg = "bg-emerald-50 text-emerald-700") => {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    if (isActive) {
      return `flex items-center space-x-3 px-3 py-2 rounded-xl font-medium text-sm transition relative group ${activeBg}`;
    }
    return "flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition relative group";
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out flex flex-col justify-between overflow-y-auto no-scrollbar border-r border-slate-100 md:border-none`}
      >
        <div className="p-4 space-y-5 pt-6">
          {/* Section 1: Main */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Main
            </p>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                onClick={onClose}
                title="Overview"
                className={getLinkClasses("/dashboard", "bg-emerald-50 text-emerald-700")}
              >
                <i className="fa-solid fa-house w-4 text-center"></i>
                <span>Overview</span>
              </Link>
              <Link
                href="/learn"
                onClick={onClose}
                title="Learn"
                className={getLinkClasses("/learn", "bg-sky-50 text-sky-700")}
              >
                <i className="fa-solid fa-book-open w-4 text-center"></i>
                <span>Learn</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Assessment & Practice */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Practice & Test
            </p>
            <div className="space-y-1">
              <Link
                href="/past-papers"
                onClick={onClose}
                title="Past Papers"
                className={getLinkClasses("/past-papers", "bg-purple-50 text-purple-700")}
              >
                <i className="fa-solid fa-file-lines w-4 text-center"></i>
                <span>Past Papers</span>
              </Link>
              <Link
                href="/practice"
                onClick={onClose}
                title="Practice"
                className={getLinkClasses("/practice", "bg-rose-50 text-rose-700")}
              >
                <i className="fa-solid fa-pen-to-square w-4 text-center"></i>
                <span>Practice</span>
              </Link>
              <Link
                href="/exam-mode"
                onClick={onClose}
                title="Exam Mode"
                className={getLinkClasses("/exam-mode", "bg-indigo-50 text-indigo-700")}
              >
                <i className="fa-solid fa-laptop-code w-4 text-center"></i>
                <span>Exam Mode</span>
              </Link>
              <Link
                href="/mistakes"
                onClick={onClose}
                title="Mistakes"
                className={getLinkClasses("/mistakes", "bg-amber-50 text-amber-700")}
              >
                <i className="fa-solid fa-triangle-exclamation w-4 text-center"></i>
                <span>Mistakes</span>
              </Link>
            </div>
          </div>

          {/* Section 3: Analytics & Study Tools */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Tools & Tracking
            </p>
            <div className="space-y-1">
              <Link
                href="/progress"
                onClick={onClose}
                title="Progress"
                className={getLinkClasses("/progress", "bg-teal-50 text-teal-700")}
              >
                <i className="fa-solid fa-chart-line w-4 text-center"></i>
                <span>Progress</span>
              </Link>
              <Link
                href="/revision"
                onClick={onClose}
                title="Revision"
                className={getLinkClasses("/revision", "bg-sky-50 text-sky-700")}
              >
                <i className="fa-solid fa-rotate-right w-4 text-center"></i>
                <span>Revision</span>
              </Link>
              <Link
                href="/bookmark"
                onClick={onClose}
                title="Bookmark"
                className={getLinkClasses("/bookmark", "bg-amber-50 text-amber-700")}
              >
                <i className="fa-solid fa-bookmark w-4 text-center"></i>
                <span>Bookmark</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  if (onOpenAITutor) onOpenAITutor();
                }}
                title="AI Tutor"
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-purple-50 hover:text-purple-700 font-medium text-sm transition cursor-pointer text-left"
              >
                <i className="fa-solid fa-robot w-4 text-center"></i>
                <span>AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Section 4: Account Preferences */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Account
            </p>
            <div className="space-y-1">
              <Link
                href="/profile"
                onClick={onClose}
                title="Profile"
                className={getLinkClasses("/profile", "bg-emerald-50 text-emerald-700")}
              >
                <i className="fa-solid fa-user w-4 text-center"></i>
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={onClose}
                title="Settings"
                className={getLinkClasses("/settings", "bg-slate-100 text-slate-800")}
              >
                <i className="fa-solid fa-gear w-4 text-center"></i>
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 hidden md:block">
          <div
            className="bg-gradient-to-r from-slate-50 to-indigo-50/50 p-3 rounded-2xl border border-indigo-100/60 shadow-sm"
            title="Capacitor 8.0 Cross-Platform Runtime"
          >
            <p className="text-[11px] text-indigo-900 font-bold">Capacitor Native Ready</p>
            <p className="text-[10px] text-slate-500 mt-0.5">iOS & Android Build Support</p>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Left Sidebar */}
      {isOpen && (
        <div
          id="backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};
