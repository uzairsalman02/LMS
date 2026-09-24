"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface PastPaperOccurrence {
  boardName: string;
  boardCode: string;
  year: number;
  session?: string | null;
  paperType?: string;
  questionNumber?: string | number | null;
}

export interface MockQuestion {
  id: string;
  text: string;
  type?: "MCQ" | "SHORT" | "LONG";
  marks?: number;
  answer?: string | null;
  explanation?: string | null;
  chapterTitle?: string;
  pastPaperOccurrences?: PastPaperOccurrence[];
  repeatCount?: number;
  options: {
    id: string;
    text: string;
    order: number;
    isCorrect?: boolean;
  }[];
}

interface MockTestClientProps {
  questions: MockQuestion[];
  initialMinutes?: number;
  testTitle?: string;
  testSubtitle?: string;
  isFormal?: boolean;
  returnUrl?: string;
}

export function MockTestClient({
  questions,
  initialMinutes = 30,
  testTitle = "Mock Exam Room",
  testSubtitle = "Official Punjab Board (BISE) Standard",
  isFormal = true,
  returnUrl = "/exam-mode",
}: MockTestClientProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [typedAnswers, setTypedAnswers] = useState<Record<string, string>>({});
  const [reviewFlags, setReviewFlags] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<"OMR" | "PALETTE">("OMR");
  const [isFullOmrModalOpen, setIsFullOmrModalOpen] = useState(false);
  const [isPhysicalSampleOpen, setIsPhysicalSampleOpen] = useState(false);
  const [samplePageIndex, setSamplePageIndex] = useState<1 | 2>(1);
  const [paletteFilter, setPaletteFilter] = useState<"ALL" | "MCQ" | "SHORT" | "LONG">("ALL");

  // Security & Proctoring State
  const [examStarted, setExamStarted] = useState(!isFormal);
  const [violationsCount, setViolationsCount] = useState(0);
  const [violationLogs, setViolationLogs] = useState<Array<{ time: string; type: string }>>([]);
  const [activeViolationModal, setActiveViolationModal] = useState<{
    strike: number;
    reason: string;
  } | null>(null);
  const [isFullscreenExited, setIsFullscreenExited] = useState(false);
  const [securityToast, setSecurityToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTabAwayRef = React.useRef(false);
  const violationsRef = React.useRef(0);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showSecurityToast = (msg: string) => {
    setSecurityToast(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setSecurityToast(null);
    }, 2800);
  };

  const enterFullscreen = () => {
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
      setIsFullscreenExited(false);
    } catch (e) {
      console.warn("Fullscreen request error:", e);
    }
  };

  const isDocFullscreen = () => {
    const doc = document as any;
    return Boolean(
      doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
    );
  };

  const exitFullscreen = () => {
    try {
      const doc = document as any;
      if (
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ) {
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
      setIsFullscreenExited(false);
    } catch (e) {
      console.warn("Fullscreen exit error:", e);
    }
  };

  // Ensure fullscreen is immediately exited when leaving the exam room or on component unmount
  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);

  const handleStartExam = () => {
    enterFullscreen();
    setExamStarted(true);
  };

  const handleViolationStrike = (reason: string) => {
    violationsRef.current += 1;
    const currentStrike = violationsRef.current;
    setViolationsCount(currentStrike);

    const now = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());

    setViolationLogs((prev) => [...prev, { time: now, type: reason }]);

    if (currentStrike === 1) {
      setActiveViolationModal({
        strike: 1,
        reason:
          "First tab switch or external window focus loss detected. Official Punjab Board regulations require uninterrupted focus.",
      });
    } else if (currentStrike === 2) {
      setActiveViolationModal({
        strike: 2,
        reason:
          "CRITICAL FINAL WARNING: Second tab switch detected! A 3rd violation will automatically terminate and submit your paper.",
      });
    } else if (currentStrike >= 3) {
      setActiveViolationModal({
        strike: 3,
        reason:
          "Maximum 3 violations exceeded. Your examination has been automatically locked and submitted for integrity assessment.",
      });
      setTimeout(() => {
        handleSubmit(true, "AUTO_TERMINATED_TAB_SWITCH_VIOLATION");
      }, 2000);
    }
  };

  // Security Restrictions: Tab switch detection, fullscreen change, copy/paste prevention
  useEffect(() => {
    if (!examStarted || isSubmitting) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabAwayRef.current = true;
      } else {
        if (isTabAwayRef.current) {
          isTabAwayRef.current = false;
          handleViolationStrike("Tab switch / browser minimization detected.");
        }
      }
    };

    const handleWindowBlur = () => {
      setTimeout(() => {
        if (!document.hasFocus() && !isSubmitting && examStarted) {
          isTabAwayRef.current = true;
        }
      }, 350);
    };

    const handleWindowFocus = () => {
      if (isTabAwayRef.current) {
        isTabAwayRef.current = false;
        handleViolationStrike("Application focus lost to an external window.");
      }
    };

    const handleFullscreenChange = () => {
      if (!isDocFullscreen()) {
        setIsFullscreenExited(true);
      } else {
        setIsFullscreenExited(false);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (
        (isCmdOrCtrl && (e.key === "c" || e.key === "C")) ||
        (isCmdOrCtrl && (e.key === "v" || e.key === "V")) ||
        (isCmdOrCtrl && (e.key === "u" || e.key === "U")) ||
        (isCmdOrCtrl && (e.key === "a" || e.key === "A") && !(e.target instanceof HTMLTextAreaElement))
      ) {
        e.preventDefault();
        showSecurityToast("⚠️ Copy, paste, and view-source shortcuts are disabled in Exam Mode.");
      }
      if (
        e.key === "F12" ||
        (isCmdOrCtrl && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j"))
      ) {
        e.preventDefault();
        showSecurityToast("⚠️ Developer inspection tools are disabled.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [examStarted, isSubmitting]);

  // Timer countdown (only counts down when exam is actively started)
  useEffect(() => {
    if (!examStarted || isSubmitting) return;

    if (secondsRemaining <= 0) {
      handleSubmit(true, "TIME_EXPIRED");
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, examStarted, isSubmitting]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleClearOption = (questionId: string) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleMarkReviewAndNext = () => {
    if (currentQ) {
      setReviewFlags((prev) => ({ ...prev, [currentQ.id]: true }));
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleExitExam = () => {
    if (confirm("Are you sure you want to exit the exam? Your current progress will not be saved.")) {
      exitFullscreen();
      router.push(returnUrl);
    }
  };

  const handleSubmit = async (forceSubmit = false, terminationReason?: string) => {
    if (
      forceSubmit ||
      confirm("Are you sure you want to submit the exam and generate your official report?")
    ) {
      setIsSubmitting(true);
      // Immediately release fullscreen lock when exam is submitted or completed
      exitFullscreen();

      try {
        const res = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testTitle: terminationReason ? `${testTitle} [Flagged]` : testTitle,
            questionIds: questions.map((q) => q.id),
            answers: selectedAnswers,
            typedAnswers: typedAnswers,
            timeSpentSeconds: initialMinutes * 60 - secondsRemaining,
            violationsCount: violationsRef.current,
            violationLogs: violationLogs,
            terminationReason: terminationReason || null,
          }),
        });
        const data = await res.json();
        exitFullscreen();
        if (data?.attemptId) {
          router.push(`/progress-report?attemptId=${data.attemptId}`);
          return;
        }
      } catch (err) {
        console.warn("Failed to persist attempt:", err);
      }
      exitFullscreen();
      router.push("/progress-report");
    }
  };

  // Stats calculation
  const totalQuestions = questions.length;
  const answeredMcqs = Object.keys(selectedAnswers).length;
  const answeredSubjectives = Object.values(typedAnswers).filter(
    (t) => t && t.trim().length > 0
  ).length;
  const answeredCount = answeredMcqs + answeredSubjectives;
  const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
  const unattemptedCount = Math.max(0, totalQuestions - answeredCount);

  const mcqQuestions = questions.filter((q) => !q.type || q.type === "MCQ");
  const shortQuestions = questions.filter((q) => q.type === "SHORT");
  const longQuestions = questions.filter((q) => q.type === "LONG");
  const hasSubjective = shortQuestions.length > 0 || longQuestions.length > 0;

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        showSecurityToast("Right-click context menu is restricted in Exam Mode.");
      }}
      className="bg-white text-slate-800 font-sans antialiased flex flex-col min-h-screen relative select-none"
    >
      {/* Top Navigation Header Bar */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Corner */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-700 md:hidden focus:outline-none"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <div className="w-9 h-9 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-rose-500/20">
              CS
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
                {testTitle}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {testSubtitle}
              </span>
            </div>
          </div>

          {/* Center: Live Running Timer & Proctoring Status */}
          <div className="flex items-center space-x-3">
            {/* Live Timer */}
            <div className="flex items-center space-x-2 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-2xl text-rose-700 shadow-2xs">
              <i className="fa-solid fa-clock animate-pulse"></i>
              <span className="text-xs font-bold font-mono">
                {examStarted ? (
                  <>Time: <span className="text-sm">{formatTimer(secondsRemaining)}</span></>
                ) : (
                  <span className="text-slate-500">Security Gate</span>
                )}
              </span>
            </div>

            {/* Proctoring & Integrity Shield */}
            <div className="hidden sm:flex items-center">
              {violationsCount === 0 ? (
                <div
                  title="Automated Proctoring Active: Tab switching & external applications monitored."
                  className="flex items-center space-x-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200/90 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs cursor-help"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Proctored • 0 Strikes</span>
                </div>
              ) : violationsCount < 3 ? (
                <div
                  title="Integrity Warning: Focus loss or tab switch recorded."
                  className="flex items-center space-x-1.5 text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs animate-pulse cursor-help"
                >
                  <i className="fa-solid fa-triangle-exclamation text-amber-600 text-xs"></i>
                  <span>Warning: {violationsCount}/3 Strikes</span>
                </div>
              ) : (
                <div
                  title="Disqualified: Maximum allowed tab switch violations exceeded."
                  className="flex items-center space-x-1.5 text-rose-800 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs animate-bounce cursor-help"
                >
                  <i className="fa-solid fa-ban text-rose-600 text-xs"></i>
                  <span>Auto-Submitting</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: OMR Quick Toggle & Submit Exam Button */}
          <div className="flex items-center space-x-2.5">
            {mcqQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRightPanelTab("OMR");
                  setIsPaletteOpen(true);
                }}
                className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  isPaletteOpen && rightPanelTab === "OMR"
                    ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
                title="Toggle BISE OMR Bubble Sheet"
              >
                <i className="fa-solid fa-circle-dot text-teal-600"></i>
                <span>OMR Sheet</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isPaletteOpen && rightPanelTab === "OMR"
                      ? "bg-teal-800 text-white"
                      : "bg-teal-100 text-teal-800"
                  }`}
                >
                  {answeredMcqs}/{mcqQuestions.length}
                </span>
              </button>
            )}
            <button
              onClick={() => handleSubmit(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center space-x-1.5"
            >
              <i className="fa-solid fa-check"></i>
              <span>Submit Exam</span>
            </button>
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-semibold text-slate-700 text-xs shadow-sm lg:hidden ml-1"
            >
              <i className="fa-solid fa-list-check"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto relative">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out flex flex-col justify-between overflow-y-auto no-scrollbar border-r border-slate-100`}
        >
          <div className="p-4 space-y-5 pt-6">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Exam Navigation
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={handleExitExam}
                  title="Exit Exam"
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium text-sm transition text-left cursor-pointer"
                >
                  <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
                  <span>Exit Exam Mode</span>
                </button>
              </div>
            </div>

            {/* Quick Stats inside Sidebar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Exam Status
              </p>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Answered:</span>
                <span className="font-bold text-emerald-600">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Marked for Review:</span>
                <span className="font-bold text-amber-600">{reviewCount}</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Unattempted:</span>
                <span className="font-bold text-slate-500">{unattemptedCount}</span>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 hidden md:block">
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 p-3 rounded-2xl border border-indigo-100/60 shadow-sm">
              <p className="text-[11px] text-indigo-900 font-bold">Secure Test Environment</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Board Standard Compliance</p>
            </div>
          </div>
        </aside>

        {/* Mobile Left Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 z-30 md:hidden"
          ></div>
        )}

        {/* Main Content Area: Active Question Box */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
          {currentQ ? (
            <div className="max-w-3xl mx-auto space-y-6 w-full">
              {/* Question Progress Bar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/80 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  {currentQ.type === "SHORT" && (
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Short Question • {currentQ.marks || 2} Marks
                    </span>
                  )}
                  {currentQ.type === "LONG" && (
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Long Question • {currentQ.marks || 5} Marks
                    </span>
                  )}
                  {(!currentQ.type || currentQ.type === "MCQ") && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Objective MCQ • 1 Mark
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-auto truncate max-w-xs">
                  {currentQ.chapterTitle || "Computer Science"}
                </span>
              </div>

              {/* Active Question Container */}
              <div className="bg-gradient-to-br from-slate-50 via-slate-50/40 to-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                {/* Basic Past Paper Mention */}
                {currentQ.pastPaperOccurrences && currentQ.pastPaperOccurrences.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/80 flex items-center">
                      <i className="fa-solid fa-landmark text-amber-700 mr-1.5 text-[10px]"></i>
                      <span>{currentQ.pastPaperOccurrences.map((occ) => `${occ.boardName} (${occ.year})`).join(", ")}</span>
                    </span>
                    {(currentQ.repeatCount ?? currentQ.pastPaperOccurrences.length) > 1 && (
                      <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/70">
                        Repeated {currentQ.repeatCount ?? currentQ.pastPaperOccurrences.length}x
                      </span>
                    )}
                  </div>
                )}

                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  Q{currentIndex + 1}: {currentQ.text}
                </h2>

                {/* Conditional Rendering: Subjective (SHORT/LONG) vs Objective (MCQ) */}
                {currentQ.type === "SHORT" || currentQ.type === "LONG" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <i className="fa-solid fa-pen-nib text-indigo-600"></i>
                        <span>Your Formal Written Answer</span>
                      </span>
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                        {((typedAnswers[currentQ.id] || "").trim().split(/\s+/).filter(Boolean).length)} Words • {(typedAnswers[currentQ.id] || "").length} Chars
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        value={typedAnswers[currentQ.id] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTypedAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          showSecurityToast("⚠️ Pasting from clipboard is restricted. Please type your answer manually.");
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          showSecurityToast("⚠️ Copying exam content is disabled.");
                        }}
                        onCut={(e) => {
                          e.preventDefault();
                          showSecurityToast("⚠️ Cutting exam content is disabled.");
                        }}
                        placeholder={
                          currentQ.type === "LONG"
                            ? "Type your detailed answer here. Structure your response with headings, definitions, characteristics, or code blocks where applicable..."
                            : "Type your concise answer here. State the standard definition, key function, and 2 key points..."
                        }
                        rows={currentQ.type === "LONG" ? 10 : 5}
                        className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-xs sm:text-sm text-slate-900 leading-relaxed outline-none transition resize-y font-sans bg-white shadow-2xs placeholder:text-slate-400"
                      ></textarea>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-start space-x-2 text-[11px] text-amber-900">
                      <i className="fa-solid fa-lightbulb text-amber-600 mt-0.5 text-xs"></i>
                      <div>
                        <span className="font-bold">Automated Rubric Tip:</span>{" "}
                        {currentQ.type === "LONG"
                          ? "Include standard academic terminology and structured points. The auto-grader checks for key concepts, vocabulary, and depth."
                          : "Focus on exact technical keywords and clear distinction. Complete sentences are recommended."}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Options Grid for MCQs with OMR-style circular bubbles */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                      <span className="font-semibold flex items-center space-x-1.5 text-slate-700">
                        <i className="fa-solid fa-circle-dot text-teal-600 text-xs"></i>
                        <span>Select option to mark OMR bubble</span>
                      </span>
                      {selectedAnswers[currentQ.id] && (
                        <button
                          type="button"
                          onClick={() => handleClearOption(currentQ.id)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition flex items-center space-x-1 cursor-pointer"
                        >
                          <i className="fa-solid fa-eraser text-[10px]"></i>
                          <span>Clear Selection</span>
                        </button>
                      )}
                    </div>

                    {currentQ.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isChecked = selectedAnswers[currentQ.id] === opt.id;
                      return (
                        <label
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQ.id, opt.id)}
                          className={`flex items-center space-x-3.5 p-4 rounded-2xl border cursor-pointer transition shadow-2xs group ${
                            isChecked
                              ? "border-2 border-slate-900 bg-slate-50/90 shadow-xs"
                              : "border-slate-200 hover:border-slate-400 hover:bg-slate-50/50 bg-white"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition-all select-none ${
                              isChecked
                                ? "bg-slate-950 border-slate-950 text-white scale-105 shadow-inner ring-2 ring-slate-400/40"
                                : "border-slate-300 text-slate-700 bg-white group-hover:border-slate-700 group-hover:bg-slate-100"
                            }`}
                          >
                            {letter}
                          </div>
                          <span
                            className={`text-xs sm:text-sm leading-relaxed ${
                              isChecked
                                ? "font-bold text-slate-950"
                                : "font-medium text-slate-700 group-hover:text-slate-900"
                            }`}
                          >
                            {opt.text}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Question Bottom Control Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleMarkReviewAndNext}
                    className="w-full sm:w-auto bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-4 py-2.5 rounded-xl text-xs transition border border-amber-200 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <i className="fa-solid fa-flag text-[11px]"></i>
                    <span>{currentIndex === questions.length - 1 ? "Mark for Review" : "Mark for Review & Next"}</span>
                  </button>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="flex-1 sm:flex-none bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                    >
                      Previous
                    </button>
                    {currentIndex === questions.length - 1 ? (
                      <button
                        onClick={() => handleSubmit(false)}
                        className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <i className="fa-solid fa-check"></i>
                        <span>Submit Exam</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <span>Save &amp; Next</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-16">
              <p className="text-sm font-bold text-slate-500">No questions loaded for this test.</p>
            </div>
          )}

          {/* Center Copyright Footer */}
          <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
            <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
          </footer>
        </main>

        {/* Right Side Panel: OMR Bubble Sheet & Question Palette */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-84 sm:w-92 bg-white transform ${
            isPaletteOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] transition-transform duration-200 ease-in-out px-4 sm:px-5 pt-4 pb-5 overflow-y-auto no-scrollbar flex flex-col space-y-3.5 shadow-xl lg:shadow-none border-l border-slate-100`}
        >
          {/* Panel Top Switcher */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold flex-1">
              <button
                type="button"
                onClick={() => setRightPanelTab("OMR")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  rightPanelTab === "OMR"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <i className="fa-solid fa-circle-dot text-teal-600 text-xs"></i>
                <span>OMR Sheet</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-teal-100 text-teal-800 ml-1">
                  {answeredMcqs}/{mcqQuestions.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRightPanelTab("PALETTE")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  rightPanelTab === "PALETTE"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <i className="fa-solid fa-table-cells text-slate-600 text-xs"></i>
                <span>Palette</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-200 text-slate-700 ml-1">
                  {totalQuestions}
                </span>
              </button>
            </div>
            <div className="flex items-center space-x-1 pl-2">
              {mcqQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsFullOmrModalOpen(true)}
                  title="Expand Full Board OMR Sheet"
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-500 hover:text-teal-700 flex items-center justify-center transition cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-expand"></i>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsPaletteOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer text-xs lg:hidden"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Tab 1: Interactive BISE OMR Bubble Sheet */}
          {rightPanelTab === "OMR" ? (
            <div className="flex-1 flex flex-col space-y-3">
              {/* Official Punjab Board Header Strip */}
              <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-3.5 rounded-2xl shadow-sm border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 text-xs">
                      <i className="fa-solid fa-certificate"></i>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block leading-tight">
                        BISE Punjab Examination
                      </span>
                      <span className="text-xs font-bold text-white block">
                        Objective Response Sheet (OMR)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">
                    Code: 4123
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-[10px] text-slate-300 font-medium mb-1">
                    <span>
                      Filled: <strong className="text-white font-bold">{answeredMcqs}</strong> of {mcqQuestions.length}
                    </span>
                    <span>{Math.round((answeredMcqs / (mcqQuestions.length || 1)) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(answeredMcqs / (mcqQuestions.length || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* OMR Instructions & Ballpoint Guide */}
              <div className="bg-amber-50/80 border border-amber-200/90 p-2.5 rounded-xl text-[10px] text-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <i className="fa-solid fa-pen-nib text-amber-700 text-xs"></i>
                  <span>Fill 1 bubble completely per question.</span>
                </div>
                <div className="flex items-center space-x-2 font-mono font-bold text-[9px]">
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full bg-slate-950 inline-block"></span>
                    <span>Valid</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-500">
                    <span className="w-3 h-3 rounded-full border border-slate-400 inline-block"></span>
                    <span>Empty</span>
                  </span>
                </div>
              </div>

              {/* OMR Response Grid: Question Rows */}
              <div className="flex-1 space-y-1.5 overflow-y-auto pr-0.5">
                {questions.map((q, idx) => {
                  if (q.type && q.type !== "MCQ") return null;

                  const isCurrent = idx === currentIndex;
                  const selectedOptId = selectedAnswers[q.id];
                  const isAnswered = Boolean(selectedOptId);
                  const isReview = Boolean(reviewFlags[q.id]);

                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? "bg-teal-50/90 border-teal-400 ring-2 ring-teal-200/70 shadow-2xs"
                          : isAnswered
                          ? "bg-slate-50/70 border-slate-200/90 hover:bg-slate-100/80"
                          : "bg-white border-slate-200/70 hover:bg-slate-50"
                      }`}
                    >
                      {/* Question Label */}
                      <div className="flex items-center space-x-1.5 min-w-[50px]">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent ? "text-teal-900 font-extrabold" : "text-slate-700"
                          }`}
                        >
                          Q.{String(idx + 1).padStart(2, "0")}
                        </span>
                        {isReview && (
                          <i
                            className="fa-solid fa-flag text-amber-500 text-[10px]"
                            title="Marked for review"
                          ></i>
                        )}
                      </div>

                      {/* Bubble Options: A, B, C, D */}
                      <div className="flex items-center space-x-2">
                        {q.options.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isSelected = selectedOptId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectOption(q.id, opt.id);
                                setCurrentIndex(idx);
                              }}
                              title={`Q${idx + 1} - Option ${letter}: ${opt.text}`}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer select-none ${
                                isSelected
                                  ? "bg-slate-950 text-white border-2 border-slate-950 shadow-inner scale-105 ring-2 ring-slate-400/40"
                                  : "border-2 border-slate-300 text-slate-700 bg-white hover:border-slate-800 hover:bg-slate-100 active:scale-95"
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>

                      {/* Clear button if answered, or blank placeholder */}
                      <div className="w-5 flex items-center justify-end">
                        {isAnswered ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearOption(q.id);
                            }}
                            title="Erase / Clear bubble"
                            className="w-5 h-5 rounded hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition flex items-center justify-center text-[10px]"
                          >
                            <i className="fa-solid fa-eraser"></i>
                          </button>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Note for Subjective Questions if they exist */}
              {hasSubjective && (
                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200/80 text-[10px] text-slate-600 flex items-start space-x-2">
                  <i className="fa-solid fa-circle-info text-indigo-600 mt-0.5"></i>
                  <span>
                    <strong>{shortQuestions.length + longQuestions.length} Subjective Questions:</strong> Answered in the written answer book (switch to <em>Palette</em> tab to jump).
                  </span>
                </div>
              )}

              {/* OMR Bottom Action Buttons */}
              <div className="flex items-center space-x-2 mt-auto pt-2">
                <button
                  type="button"
                  onClick={() => setIsFullOmrModalOpen(true)}
                  className="flex-1 py-2.5 px-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <i className="fa-solid fa-expand text-xs"></i>
                  <span>Digital OMR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPhysicalSampleOpen(true)}
                  className="flex-1 py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                  title="View authentic Punjab Board physical OMR sheet scan"
                >
                  <i className="fa-solid fa-file-lines text-xs text-teal-700"></i>
                  <span>Physical Scan</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tab 2: Standard Question Palette View */
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Question Palette</h3>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {totalQuestions} Total Questions
                </span>
              </div>

              {/* Section Filter Pills when subjective questions exist */}
              {hasSubjective && (
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-[10px] font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("ALL")}
                    className={`flex-1 py-1 rounded-lg transition ${
                      paletteFilter === "ALL" ? "bg-white text-slate-900 font-bold shadow-2xs" : "hover:text-slate-900"
                    }`}
                  >
                    All ({questions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("MCQ")}
                    className={`flex-1 py-1 rounded-lg transition ${
                      paletteFilter === "MCQ" ? "bg-white text-rose-700 font-bold shadow-2xs" : "hover:text-slate-900"
                    }`}
                  >
                    MCQ ({mcqQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("SHORT")}
                    className={`flex-1 py-1 rounded-lg transition ${
                      paletteFilter === "SHORT" ? "bg-white text-indigo-700 font-bold shadow-2xs" : "hover:text-slate-900"
                    }`}
                  >
                    Short ({shortQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("LONG")}
                    className={`flex-1 py-1 rounded-lg transition ${
                      paletteFilter === "LONG" ? "bg-white text-purple-700 font-bold shadow-2xs" : "hover:text-slate-900"
                    }`}
                  >
                    Long ({longQuestions.length})
                  </button>
                </div>
              )}

              {/* Palette Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200 inline-block"></span>
                  <span>Unattempted ({unattemptedCount})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  <span>Review ({reviewCount})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
                  <span>Current (Q{currentIndex + 1})</span>
                </div>
              </div>

              {/* Question Number Grid */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {questions.map((q, idx) => {
                  if (paletteFilter === "MCQ" && q.type && q.type !== "MCQ") return null;
                  if (paletteFilter === "SHORT" && q.type !== "SHORT") return null;
                  if (paletteFilter === "LONG" && q.type !== "LONG") return null;

                  const isCurrent = idx === currentIndex;
                  const isAnswered =
                    q.type === "SHORT" || q.type === "LONG"
                      ? Boolean(typedAnswers[q.id]?.trim())
                      : Boolean(selectedAnswers[q.id]);
                  const isReview = Boolean(reviewFlags[q.id]);

                  let bgClass = "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200";
                  if (isCurrent) {
                    bgClass = "bg-rose-600 text-white font-bold shadow-md ring-2 ring-rose-300";
                  } else if (isReview) {
                    bgClass = "bg-amber-500 text-white font-bold shadow-2xs hover:opacity-90";
                  } else if (isAnswered) {
                    bgClass = "bg-emerald-500 text-white font-bold shadow-2xs hover:opacity-90";
                  }

                  const typeBadge = q.type === "SHORT" ? "S" : q.type === "LONG" ? "L" : "";

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPaletteOpen(false);
                      }}
                      className={`w-11 h-11 rounded-xl text-xs flex flex-col items-center justify-center cursor-pointer transition relative ${bgClass}`}
                    >
                      <span className="leading-none">{idx + 1}</span>
                      {typeBadge && (
                        <span className="text-[8px] opacity-80 uppercase tracking-tighter leading-none mt-0.5">
                          {typeBadge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Right Palette Backdrop */}
        {isPaletteOpen && (
          <div
            onClick={() => setIsPaletteOpen(false)}
            className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden"
          ></div>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40 flex justify-around py-2.5 px-2 shadow-lg">
        <button
          type="button"
          onClick={handleExitExam}
          title="Exit"
          className="flex flex-col items-center text-rose-600 cursor-pointer"
        >
          <i className="fa-solid fa-right-from-bracket text-base"></i>
          <span className="text-[10px] font-medium mt-1">Exit</span>
        </button>
        <button onClick={() => handleSubmit(false)} className="flex flex-col items-center text-emerald-600">
          <i className="fa-solid fa-check text-base"></i>
          <span className="text-[10px] font-medium mt-1">Submit</span>
        </button>
        {mcqQuestions.length > 0 && (
          <button
            onClick={() => {
              setRightPanelTab("OMR");
              setIsPaletteOpen(true);
            }}
            title="OMR Sheet"
            className="flex flex-col items-center text-teal-600"
          >
            <i className="fa-solid fa-circle-dot text-base"></i>
            <span className="text-[10px] font-bold mt-1">OMR ({answeredMcqs}/{mcqQuestions.length})</span>
          </button>
        )}
        <button
          onClick={() => {
            setRightPanelTab("PALETTE");
            setIsPaletteOpen(true);
          }}
          title="Palette"
          className="flex flex-col items-center text-slate-500"
        >
          <i className="fa-solid fa-table-cells text-base"></i>
          <span className="text-[10px] font-medium mt-1">Palette</span>
        </button>
      </nav>

      {/* Authentic BISE Punjab Full OMR Sheet Modal */}
      {isFullOmrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 text-lg">
                  <i className="fa-solid fa-certificate"></i>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-300">
                    Board of Intermediate & Secondary Education, Punjab
                  </h3>
                  <p className="text-sm sm:text-base font-extrabold text-white">
                    Objective Response Sheet (OMR) • HSSC-I Annual Examination
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFullOmrModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Candidate & Board Paper Credentials Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Roll No</span>
                <span className="font-mono font-bold text-slate-900">849201</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Paper Code</span>
                <span className="font-mono font-bold text-teal-700">4123</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject & Part</span>
                <span className="font-bold text-slate-800">Computer Science (Part-I)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="font-bold text-emerald-700">{answeredMcqs} of {mcqQuestions.length} Bubbles Filled</span>
              </div>
            </div>

            {/* Instruction Warning Banner */}
            <div className="bg-amber-50/90 border-b border-amber-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] text-amber-900">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-pen-nib text-amber-700"></i>
                <span>Use Blue/Black Ballpoint only. Fill circles completely. Incomplete fills or multiple selections will score 0.</span>
              </div>
              <div className="hidden sm:flex items-center space-x-3 font-mono font-bold text-[10px]">
                <span className="flex items-center space-x-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-950 inline-block"></span>
                  <span>Correct</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-500">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-400 inline-block"></span>
                  <span>Empty</span>
                </span>
              </div>
            </div>

            {/* Full OMR Matrix - Responsive Columns */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {questions.map((q, idx) => {
                  if (q.type && q.type !== "MCQ") return null;
                  const isCurrent = idx === currentIndex;
                  const selectedOptId = selectedAnswers[q.id];
                  const isAnswered = Boolean(selectedOptId);

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-teal-50/70 border-teal-400 ring-2 ring-teal-200/70 shadow-xs"
                          : isAnswered
                          ? "bg-slate-50/70 border-slate-200"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentIndex(idx);
                              setIsFullOmrModalOpen(false);
                            }}
                            className="text-xs font-black text-slate-800 hover:text-teal-700 cursor-pointer"
                            title="Jump to this question in exam room"
                          >
                            Q.{String(idx + 1).padStart(2, "0")}
                          </button>
                          {isCurrent && (
                            <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                          {reviewFlags[q.id] && (
                            <i className="fa-solid fa-flag text-amber-500 text-[10px]" title="Marked for review"></i>
                          )}
                        </div>
                        {isAnswered && (
                          <button
                            type="button"
                            onClick={() => handleClearOption(q.id)}
                            className="text-[10px] text-slate-400 hover:text-rose-600 transition flex items-center space-x-1 cursor-pointer"
                            title="Erase bubble"
                          >
                            <i className="fa-solid fa-eraser"></i>
                            <span>Clear</span>
                          </button>
                        )}
                      </div>

                      {/* Bubble Row */}
                      <div className="flex items-center justify-around py-1 bg-white rounded-xl border border-slate-100 p-1">
                        {q.options.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isSelected = selectedOptId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                handleSelectOption(q.id, opt.id);
                                setCurrentIndex(idx);
                              }}
                              title={`Option ${letter}: ${opt.text}`}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer select-none ${
                                isSelected
                                  ? "bg-slate-950 text-white border-2 border-slate-950 shadow-inner scale-105 ring-2 ring-slate-400/50"
                                  : "border-2 border-slate-300 text-slate-700 bg-white hover:border-slate-800 hover:bg-slate-50 active:scale-95"
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>

                      {/* Preview Question Snippet */}
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-2 font-medium">
                        {q.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Official Punjab Board Seal Box */}
              <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Candidate Verification
                  </span>
                  <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-xs">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Digital OMR Integrity Checksum Validated</span>
                  </div>
                </div>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Superintendent Centre Seal
                  </span>
                  <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs">
                    <i className="fa-solid fa-stamp text-slate-500"></i>
                    <span>BISE Examination Centre # 104 • Official Scan Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600">
                {answeredMcqs === mcqQuestions.length ? (
                  <span className="text-emerald-700 font-bold flex items-center space-x-1.5">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>All {mcqQuestions.length} Objective Bubbles Filled!</span>
                  </span>
                ) : (
                  <span>
                    <strong className="text-amber-700 font-bold">{mcqQuestions.length - answeredMcqs}</strong> bubbles remaining unattempted.
                  </span>
                )}
              </span>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsFullOmrModalOpen(false)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Return to Question View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFullOmrModalOpen(false);
                    handleSubmit(false);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Submit Exam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentic Physical Punjab Board OMR Sheet Scan Modal */}
      {isPhysicalSampleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 text-lg">
                  <i className="fa-solid fa-certificate"></i>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-teal-300">
                    Punjab Board Style OMR Sheet (Sample Reference)
                  </h3>
                  <p className="text-sm font-extrabold text-white">
                    {samplePageIndex === 1
                      ? "Side 1: MCQs Response Part (Q1–Q24) & Award Sheet"
                      : "Side 2: Candidate Roll Number Sheet & Board Instructions"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhysicalSampleOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Switcher Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-slate-200 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSamplePageIndex(1)}
                  className={`py-1.5 px-3 rounded-lg transition ${
                    samplePageIndex === 1
                      ? "bg-white text-teal-900 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Side 1: MCQs &amp; Award
                </button>
                <button
                  type="button"
                  onClick={() => setSamplePageIndex(2)}
                  className={`py-1.5 px-3 rounded-lg transition ${
                    samplePageIndex === 2
                      ? "bg-white text-indigo-900 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Side 2: Roll No &amp; Rules
                </button>
              </div>

              <a
                href="/bise-omr-sample.pdf"
                download="BISE-Punjab-OMR-Sample.pdf"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1.5 bg-white border border-teal-200 px-3 py-1.5 rounded-lg shadow-2xs"
              >
                <i className="fa-solid fa-download"></i>
                <span>Download Sample PDF</span>
              </a>
            </div>

            {/* Document Image */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/60 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-300 max-w-2xl w-full p-2">
                <img
                  src={`/images/omr/bise-omr-page-${samplePageIndex}.webp`}
                  alt={`BISE OMR Sample Page ${samplePageIndex}`}
                  className="w-full h-auto rounded-xl object-contain mx-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Sample physical sheet provided for candidate orientation and practice (Reference Only).
              </span>
              <button
                type="button"
                onClick={() => setIsPhysicalSampleOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Security Toast */}
      {securityToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center space-x-2.5 text-xs font-bold backdrop-blur-md transition-all duration-200">
          <i className="fa-solid fa-shield-halved text-amber-400 text-sm"></i>
          <span>{securityToast}</span>
        </div>
      )}

      {/* 1. Pre-Exam Security Verification Gate Modal */}
      {!examStarted && (
        <div className="fixed inset-0 z-[90] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-rose-500/20">
                CS
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">
                  Punjab Board (BISE) Digital Examination Hall
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Assessment Security Protocol
                </h2>
              </div>
            </div>

            {/* Test Context */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{testTitle}</span>
                <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {initialMinutes} Minutes
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{testSubtitle}</p>
            </div>

            {/* 4 Security Directives */}
            <div className="space-y-2.5 text-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Mandatory Examination Regulations
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <i className="fa-solid fa-expand text-indigo-600"></i>
                    <span>Fullscreen Lockdown</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Exam operates exclusively in full-screen. Exiting fullscreen triggers a violation notice.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <i className="fa-solid fa-eye text-rose-600"></i>
                    <span>Tab Switch Detection</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Navigating away or opening external windows is monitored. 3 strikes will auto-submit.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <i className="fa-solid fa-ban text-amber-600"></i>
                    <span>Anti-Clipboard Guard</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Right-click, text copying, and external paste are disabled to enforce genuine recall.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                    <span>Integrity Certificate</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Your official transcript records proctoring compliance and strikes count.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist / Readiness Bar */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-xl flex items-center justify-between text-[11px] text-emerald-900">
              <span className="flex items-center space-x-1.5 font-semibold">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>Browser &amp; Security Shield Verified</span>
              </span>
              <span className="font-bold">{totalQuestions} Questions Ready</span>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={handleStartExam}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm transition shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-shield-halved"></i>
                <span>I Agree &amp; Begin Proctored Exam (Enter Fullscreen)</span>
              </button>
              <div className="text-center mt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    exitFullscreen();
                    router.push(returnUrl);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium transition cursor-pointer"
                >
                  Cancel and Return to Exam Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Fullscreen Exited Alert Overlay */}
      {isFullscreenExited && examStarted && !isSubmitting && !activeViolationModal && (
        <div className="fixed inset-0 z-[85] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-300 max-w-md w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 text-2xl">
              <i className="fa-solid fa-expand"></i>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Fullscreen Mode Required</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Official Punjab Board examination standards require a full-screen environment. Please return to fullscreen mode to continue answering questions.
              </p>
            </div>
            <button
              onClick={enterFullscreen}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-amber-600/20 cursor-pointer flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-maximize"></i>
              <span>Re-enter Fullscreen Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Strike 1 & Strike 2 Violation Warning Modal */}
      {activeViolationModal && activeViolationModal.strike < 3 && (
        <div className="fixed inset-0 z-[95] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center space-y-5 animate-in fade-in zoom-in-95 border-2 ${
              activeViolationModal.strike === 1 ? "border-amber-400" : "border-rose-500"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl ${
                activeViolationModal.strike === 1
                  ? "bg-amber-100 text-amber-600"
                  : "bg-rose-100 text-rose-600 animate-pulse"
              }`}
            >
              <i
                className={`fa-solid ${
                  activeViolationModal.strike === 1 ? "fa-triangle-exclamation" : "fa-shield-halved"
                }`}
              ></i>
            </div>

            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  activeViolationModal.strike === 1
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {activeViolationModal.strike === 1 ? "Strike 1 of 3" : "CRITICAL: Strike 2 of 3 (Final Warning)"}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                {activeViolationModal.strike === 1
                  ? "Tab Switch / Focus Loss Detected"
                  : "Final Warning: Prohibited Action"}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {activeViolationModal.reason}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              {activeViolationModal.strike === 1 ? (
                <span>You have 2 remaining warnings before automatic paper disqualification.</span>
              ) : (
                <span className="text-rose-700 font-bold">
                  ⚠️ One more violation will immediately submit and terminate your examination!
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setActiveViolationModal(null);
                enterFullscreen();
              }}
              className={`w-full font-bold py-3 rounded-xl text-xs transition cursor-pointer text-white shadow-md ${
                activeViolationModal.strike === 1
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              }`}
            >
              I Understand &amp; Resume Examination
            </button>
          </div>
        </div>
      )}

      {/* 4. Strike 3 Disqualification & Auto-Submit Modal */}
      {activeViolationModal && activeViolationModal.strike >= 3 && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-rose-600 max-w-md w-full p-7 text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 text-3xl animate-bounce">
              <i className="fa-solid fa-ban"></i>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                Examination Terminated
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Violation Limit Exceeded (3/3)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Candidate has repeatedly switched browser tabs or minimized the examination window. As per Punjab Board regulations, your paper has been locked and automatically submitted for review.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-rose-600 text-xs font-bold">
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <span>Generating official report...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
