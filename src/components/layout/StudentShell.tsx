"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { AITutorModal } from "../modals/AITutorModal";

interface StudentShellProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  rightPanelIcon?: string;
  rightPanelLabel?: string;
  pageTitle?: string;
  badge?: string;
  studentName?: string;
}

export const StudentShell: React.FC<StudentShellProps> = ({
  children,
  rightPanel,
  rightPanelIcon = "fa-user",
  rightPanelLabel = "Profile",
  pageTitle = "Computer Science",
  badge = "11th Standard",
  studentName = "Uzair",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);

  return (
    <div className="bg-white text-slate-800 font-sans antialiased flex flex-col min-h-screen relative">
      {/* Top Sticky Header */}
      <Header
        onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        onOpenAITutor={() => setAiTutorOpen(true)}
        title={pageTitle}
        badge={badge}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenAITutor={() => setAiTutorOpen(true)}
        />

        {/* Main Content Area */}
        {children}

        {/* Optional Right Panel */}
        {rightPanel && (
          <>
            <aside
              id="right-panel"
              className={`fixed inset-y-0 right-0 z-40 w-80 bg-white transform ${
                rightPanelOpen ? "translate-x-0" : "translate-x-full"
              } lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out px-5 pt-3 pb-5 overflow-y-auto no-scrollbar flex flex-col space-y-4 shadow-xl lg:shadow-none border-l border-slate-100 lg:border-none`}
            >
              <div className="flex justify-between items-center lg:hidden pb-1 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-sm">{rightPanelLabel}</span>
                <button
                  onClick={() => setRightPanelOpen(false)}
                  id="close-right-panel"
                  title="Close Panel"
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
              {rightPanel}
            </aside>

            {/* Backdrop for Mobile Right Panel */}
            {rightPanelOpen && (
              <div
                id="right-backdrop"
                onClick={() => setRightPanelOpen(false)}
                className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden"
              ></div>
            )}
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        rightPanelIcon={rightPanelIcon}
        rightPanelLabel={rightPanelLabel}
      />

      {/* AI Tutor Modal */}
      {aiTutorOpen && (
        <AITutorModal onClose={() => setAiTutorOpen(false)} studentName={studentName} />
      )}
    </div>
  );
};
