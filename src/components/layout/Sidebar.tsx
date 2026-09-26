"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Global singleton in memory: persists across all Next.js client-side page navigations
let globalSidebarCollapsed: boolean = false;
let isInitialized = false;
let hasHydratedOnce = false;

function initGlobalState(): boolean {
  if (typeof window !== "undefined" && !isInitialized) {
    try {
      const saved = localStorage.getItem("lms_sidebar_collapsed");
      if (saved !== null) {
        globalSidebarCollapsed = saved === "true";
      }
    } catch {
      // ignore
    }
    isInitialized = true;
  }
  return globalSidebarCollapsed;
}

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

  // On initial SSR hydration, start with false to match server HTML exactly.
  // On all subsequent client-side page transitions, initialize directly with globalSidebarCollapsed.
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (hasHydratedOnce) {
      return globalSidebarCollapsed;
    }
    return false;
  });

  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  // Sync state on initial mount & handle cross-tab/window events
  useEffect(() => {
    if (!hasHydratedOnce) {
      hasHydratedOnce = true;
      const initial = initGlobalState();
      setIsCollapsed(initial);
    }

    const handleSync = () => {
      try {
        const saved = localStorage.getItem("lms_sidebar_collapsed");
        if (saved !== null) {
          const val = saved === "true";
          globalSidebarCollapsed = val;
          setIsCollapsed(val);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("lms-sidebar-sync", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("lms-sidebar-sync", handleSync);
    };
  }, []);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    globalSidebarCollapsed = next;
    setIsCollapsed(next);
    try {
      localStorage.setItem("lms_sidebar_collapsed", String(next));
      window.dispatchEvent(new Event("lms-sidebar-sync"));
    } catch {
      // ignore
    }
  };

  const renderNavLink = (
    href: string,
    icon: string,
    label: string,
    activeBg = "bg-emerald-50 text-emerald-700"
  ) => {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

    if (isCollapsed) {
      return (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          onMouseEnter={() => setHoveredTitle(label)}
          onMouseLeave={() => setHoveredTitle(null)}
          title={label}
          className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-colors relative group cursor-pointer ${
            isActive
              ? `${activeBg} font-bold shadow-2xs`
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <i className={`${icon} text-base`}></i>

          {/* Clean, simple title directly above the icon */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-800 text-white text-[11px] font-medium rounded-md shadow-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {label}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
          </span>
        </Link>
      );
    }

    return (
      <Link
        key={href}
        href={href}
        onClick={onClose}
        title={label}
        className={`flex items-center space-x-3 px-3 py-2 rounded-xl font-medium text-sm transition relative group cursor-pointer ${
          isActive
            ? `${activeBg} font-bold shadow-2xs`
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <i className={`${icon} w-4 text-center`}></i>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <aside
        id="sidebar"
        suppressHydrationWarning
        className={`fixed inset-y-0 left-0 z-40 bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] transition-all duration-200 ease-in-out flex flex-col justify-between overflow-y-auto no-scrollbar border-none shadow-none ${
          isCollapsed ? "w-64 md:w-16" : "w-64 md:w-60"
        }`}
      >
        <div className={`space-y-3 pt-2 ${isCollapsed ? "px-1" : "px-3"}`}>
          {/* Sleek Minimal Toggle */}
          {isCollapsed ? (
            <div className="hidden md:flex flex-col items-center pt-1 pb-0.5">
              <button
                onClick={toggleCollapsed}
                title="Expand Sidebar"
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 flex items-center justify-center text-xs transition cursor-pointer"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
              {/* Dynamic top text indicator for hovered icon */}
              <div className="h-3.5 mt-0.5 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[56px]">
                {hoveredTitle || ""}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-end px-1 pt-1 pb-0.5">
              <button
                onClick={toggleCollapsed}
                title="Collapse Sidebar"
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs transition cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>
          )}

          {/* Section 1: Main */}
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Main
              </p>
            )}
            <div className="space-y-1">
              {renderNavLink("/dashboard", "fa-solid fa-house", "Overview", "bg-emerald-50 text-emerald-700")}
              {renderNavLink("/learn", "fa-solid fa-book-open", "Learn", "bg-sky-50 text-sky-700")}
            </div>
          </div>

          {/* Section 2: Assessment & Practice */}
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Practice & Test
              </p>
            )}
            <div className="space-y-1">
              {renderNavLink("/past-papers", "fa-solid fa-file-lines", "Past Papers", "bg-purple-50 text-purple-700")}
              {renderNavLink("/practice", "fa-solid fa-pen-to-square", "Practice", "bg-rose-50 text-rose-700")}
              {renderNavLink("/exam-mode", "fa-solid fa-laptop-code", "Exam Mode", "bg-indigo-50 text-indigo-700")}
              {renderNavLink("/mistakes", "fa-solid fa-triangle-exclamation", "Mistakes", "bg-amber-50 text-amber-700")}
            </div>
          </div>

          {/* Section 3: Analytics & Study Tools */}
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Tools & Tracking
              </p>
            )}
            <div className="space-y-1">
              {renderNavLink("/progress", "fa-solid fa-chart-line", "Progress", "bg-teal-50 text-teal-700")}
              {renderNavLink("/revision", "fa-solid fa-rotate-right", "Revision", "bg-sky-50 text-sky-700")}
              {renderNavLink("/bookmark", "fa-solid fa-bookmark", "Bookmark", "bg-amber-50 text-amber-700")}
              {renderNavLink("/ai-tutor", "fa-solid fa-graduation-cap", "AI Tutor", "bg-emerald-50 text-emerald-700")}
            </div>
          </div>

          {/* Section 4: Account Preferences */}
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Account
              </p>
            )}
            <div className="space-y-1">
              {renderNavLink("/profile", "fa-solid fa-user", "Profile", "bg-emerald-50 text-emerald-700")}
              {renderNavLink("/settings", "fa-solid fa-gear", "Settings", "bg-slate-100 text-slate-800")}
              {renderNavLink("/admin/settings", "fa-solid fa-user-shield", "Admin Settings", "bg-amber-50 text-amber-700")}
            </div>
          </div>
        </div>

        {/* Seamless Sidebar Footer */}
        <div className={`hidden md:block ${isCollapsed ? "p-1 text-center" : "p-3"}`}>
          {!isCollapsed ? (
            <div
              className="bg-slate-50 p-2.5 rounded-2xl"
              title="Capacitor 8.0 Cross-Platform Runtime"
            >
              <p className="text-[11px] text-slate-700 font-bold flex items-center space-x-1.5">
                <i className="fa-solid fa-mobile-screen-button text-sky-600"></i>
                <span>Capacitor Native Ready</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">iOS & Android Build Support</p>
            </div>
          ) : (
            <div
              onMouseEnter={() => setHoveredTitle("Native Ready")}
              onMouseLeave={() => setHoveredTitle(null)}
              className="w-8 h-8 mx-auto rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center text-xs group relative cursor-help"
            >
              <i className="fa-solid fa-mobile-screen-button"></i>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-800 text-white text-[11px] font-medium rounded-md shadow-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Native Ready
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
              </span>
            </div>
          )}
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
