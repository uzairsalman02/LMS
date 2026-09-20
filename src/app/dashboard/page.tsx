import React from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // Query student from MySQL
  let studentName = "Uzair Salman";
  let studentId = "";

  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });

  if (student) {
    studentName = student.name || "Uzair Salman";
    studentId = student.id;
  }

  // Real database dynamic metrics
  const totalTopics = await prisma.topic.count({
    where: { Chapter: { Subject: { classId: "class-11" } } },
  });

  const coveredTopics = await prisma.progress.count({
    where: { userId: studentId, completed: true },
  });

  const totalMistakes = await prisma.mistake.count({
    where: { userId: studentId, resolved: false },
  });

  const totalTests = await prisma.attempt.count({
    where: { userId: studentId },
  });

  const topicPercentage = totalTopics > 0 ? Math.round((coveredTopics / totalTopics) * 100) : 0;
  const remainingTopics = Math.max(0, totalTopics - coveredTopics);

  // 1. Level Calculation: 5 Total Levels based on course completion
  let currentLevel = 1;
  let levelTitle = "Foundation";
  if (topicPercentage >= 80) {
    currentLevel = 5;
    levelTitle = "Board Ready Master";
  } else if (topicPercentage >= 60) {
    currentLevel = 4;
    levelTitle = "Advanced Scholar";
  } else if (topicPercentage >= 40) {
    currentLevel = 3;
    levelTitle = "Intermediate Scholar";
  } else if (topicPercentage >= 20) {
    currentLevel = 2;
    levelTitle = "Active Learner";
  } else {
    currentLevel = 1;
    levelTitle = "Foundation";
  }

  // 2. Mistake Error Ratio Calculation
  const totalQuestionsEvaluated = Math.max(1, (totalTests * 15) + (coveredTopics * 4));
  const errorRatio = Math.min(100, Math.round((totalMistakes / totalQuestionsEvaluated) * 100));

  // 3. Achievements Formula (5 Progressive Tougher Badges)
  // Total curriculum: 35 topics and 25 practice tests goal
  const isQuickStarterUnlocked = coveredTopics >= 3; // 3+ Topics Completed
  const isConceptChampUnlocked = coveredTopics >= 10; // 10+ Topics Mastered
  const isQuizPioneerUnlocked = totalTests >= 5; // 5+ Practice Tests Attempted
  const isSyllabusTitanUnlocked = coveredTopics >= 20; // 20+ Topics Mastered (>57% of syllabus)
  const isBoardProdigyUnlocked = coveredTopics >= 30 && totalTests >= 10; // 30+ Topics & 10+ Tests (Ultimate Mastery)

  const badgesList = [
    {
      id: "quick-starter",
      name: "Starter",
      fullName: "Quick Starter",
      icon: "🚀",
      bgIcon: "bg-amber-50 text-amber-500",
      unlocked: isQuickStarterUnlocked,
      condition: "3+ Topics Completed",
    },
    {
      id: "concept-champ",
      name: "Champ",
      fullName: "Concept Champ",
      icon: "💡",
      bgIcon: "bg-purple-50 text-purple-600",
      unlocked: isConceptChampUnlocked,
      condition: "10+ Topics Mastered",
    },
    {
      id: "quiz-pioneer",
      name: "Pioneer",
      fullName: "Quiz Pioneer",
      icon: "✍️",
      bgIcon: "bg-sky-50 text-sky-600",
      unlocked: isQuizPioneerUnlocked,
      condition: "5+ Tests Attempted",
    },
    {
      id: "syllabus-titan",
      name: "Titan",
      fullName: "Syllabus Titan",
      icon: "🛡️",
      bgIcon: "bg-rose-50 text-rose-600",
      unlocked: isSyllabusTitanUnlocked,
      condition: "20+ Topics Mastered",
    },
    {
      id: "board-prodigy",
      name: "Prodigy",
      fullName: "Board Prodigy",
      icon: "🏆",
      bgIcon: "bg-emerald-50 text-emerald-600",
      unlocked: isBoardProdigyUnlocked,
      condition: "30+ Topics & 10 Tests",
    },
  ];

  const unlockedBadgesCount = badgesList.filter((b) => b.unlocked).length;

  // 4. Final Board Exam Days Left Calculation
  const examTargetDate = new Date(2027, 4, 10); // Target: May 10, 2027 Annual Board Exam
  const today = new Date();
  const diffTime = examTargetDate.getTime() - today.getTime();
  const daysLeftInFinalExams = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Find next incomplete topic or last accessed topic to resume learning
  const lastProgress = await prisma.progress.findFirst({
    where: { userId: studentId },
    orderBy: { lastAccessedAt: "desc" },
    include: { Topic: { include: { Chapter: true } } },
  });

  const nextIncompleteTopic = await prisma.topic.findFirst({
    where: {
      Chapter: { Subject: { classId: "class-11" } },
      Progress: {
        none: {
          userId: studentId,
          completed: true,
        },
      },
    },
    include: { Chapter: true },
    orderBy: [{ Chapter: { chapterNumber: "asc" } }, { topicNumber: "asc" }],
  });

  const activeResumeTopic = nextIncompleteTopic || lastProgress?.Topic;

  // Real Chapters with live progress (All chapters for Class 11)
  const allChapters = await prisma.chapter.findMany({
    where: { Subject: { classId: "class-11" } },
    include: {
      Topic: {
        include: {
          Progress: {
            where: { userId: studentId, completed: true },
          },
        },
      },
    },
    orderBy: { chapterNumber: "asc" },
  });

  // Right Panel for Dashboard
  const rightPanel = (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-white p-4 rounded-3xl flex flex-col items-center text-center relative group border border-slate-100/60 shadow-2xs">
        <div className="absolute top-2 right-2">
          <Link
            href="/profile"
            title="Edit Student Profile"
            className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-[11px] transition border border-slate-100 cursor-pointer"
          >
            <i className="fa-solid fa-pen"></i>
          </Link>
        </div>
        <div className="relative mb-2 mt-0.5">
          <Link
            href="/profile"
            title={`${studentName} - Active Student Profile`}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-md cursor-pointer block"
          >
            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden text-slate-600 font-bold text-lg">
              US
            </div>
          </Link>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm">{studentName}</h3>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
          11th Computer Science • 2026
        </p>
      </div>

      {/* Progress-Based Achievements Widget (5 Badges Compact Grid) */}
      <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-purple-100/80 p-3 rounded-3xl shadow-2xs backdrop-blur-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-md shadow-purple-500/30">
              🏆
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Achievements</h4>
              <p className="text-[10px] text-purple-700 font-semibold">
                {unlockedBadgesCount} of 5 Badges Unlocked
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            title="View all student achievements"
            className="text-[10px] font-bold text-purple-600 hover:text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-xl transition"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              title={`${badge.fullName} (${badge.condition}): ${badge.unlocked ? "Unlocked ✓" : "Locked 🔒"}`}
              className={`p-1.5 rounded-xl flex flex-col items-center text-center transition-all cursor-pointer group ${
                badge.unlocked
                  ? "bg-white border border-purple-200/90 shadow-2xs hover:scale-105"
                  : "bg-slate-100/70 border border-dashed border-slate-300/80 grayscale opacity-55 hover:opacity-75"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs mb-0.5 shadow-2xs ${
                  badge.unlocked ? badge.bgIcon : "bg-slate-200 text-slate-500 grayscale"
                }`}
              >
                {badge.icon}
              </div>
              <span
                className={`text-[8px] font-bold leading-tight truncate w-full text-center ${
                  badge.unlocked ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {badge.name}
              </span>
              <span
                className={`text-[7px] mt-0.5 font-bold ${
                  badge.unlocked ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {badge.unlocked ? "✓" : "🔒"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Perpetual Dynamic Calendar Widget */}
      <DashboardCalendar />

      {/* Expected Days Left in Board Final Exams */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-rose-500/10 border border-amber-200/80 p-4 rounded-3xl shadow-2xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
            <i className="fa-solid fa-hourglass-half text-amber-600"></i>
            <span>Final Board Exams</span>
          </div>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            BISE Punjab
          </span>
        </div>
        <div className="my-2">
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {daysLeftInFinalExams} Days Left
          </div>
          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
            Target: Annual Class 11 Examinations
          </p>
        </div>
        <div className="pt-2 border-t border-amber-100 text-[10px] text-amber-900 font-medium flex items-center space-x-1.5">
          <i className="fa-solid fa-circle-check text-amber-600"></i>
          <span>Target: 1-2 topics daily to finish on schedule.</span>
        </div>
      </div>

      {/* Admin Broadcast Notice & Reminders */}
      <div className="bg-gradient-to-br from-rose-50/70 to-pink-50/40 border border-rose-100 p-3.5 rounded-3xl shadow-2xs">
        <div className="flex items-center justify-between text-rose-700 font-bold text-xs mb-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Important Reminder</span>
          </div>
          <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            Admin Notice
          </span>
        </div>
        <p className="text-xs text-slate-800 font-semibold mt-1">
          OOP Practical Lab Assignment
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
          Submission due tomorrow at 11:59 PM. Ensure all code outputs are verified.
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightPanel}
      rightPanelIcon="fa-calendar-days"
      rightPanelLabel="Profile & Schedule"
      pageTitle="Computer Science"
      badge="11th Standard"
      studentName={studentName}
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div>
          {/* Header Mobile Search Bar */}
          <div className="md:hidden mb-4">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <i className="fa-solid fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search topics, questions, chapters..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Welcome Banner - Responsive Layout & Exact Copy */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-5 sm:p-7 md:p-8 text-white shadow-xl shadow-emerald-500/10 mb-6 relative overflow-hidden w-full">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none hidden sm:block">
              <i className="fa-solid fa-laptop-code text-9xl"></i>
            </div>
            <div className="relative z-10 max-w-full sm:max-w-xl flex flex-col items-start">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  11th Computer Science
                </span>
                <span className="text-emerald-50 text-xs font-medium">
                  • {coveredTopics} of {totalTopics} Topics Mastered
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 break-words">
                Welcome back, {studentName.split(" ")[0] || "Uzair"}! Ready to study?
              </h1>
              <p className="text-emerald-50 text-xs sm:text-sm mt-2 leading-relaxed break-words">
                {activeResumeTopic ? (
                  <>
                    Current Topic:{" "}
                    <strong className="text-white font-semibold">
                      Unit {activeResumeTopic.Chapter.chapterNumber}: {activeResumeTopic.title}
                    </strong>
                  </>
                ) : (
                  <>All topics completed in the curriculum! Ready for mock examinations.</>
                )}
              </p>
              <Link
                href={activeResumeTopic ? `/learn?topicId=${activeResumeTopic.id}` : "/learn"}
                title="Resume Learning"
                className="mt-4 sm:mt-5 inline-flex items-center space-x-2 bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-black/5 transition cursor-pointer"
              >
                <span>
                  {activeResumeTopic
                    ? `Resume: Unit ${activeResumeTopic.Chapter.chapterNumber} (${activeResumeTopic.title})`
                    : "Review Lessons"}
                </span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>

          {/* Dual Widgets Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            {/* Widget 1: Course Activities (Live Donut Chart) */}
            <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Course Activities</h3>
              </div>
              <div className="my-5 flex flex-col items-center justify-center">
                <div
                  className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center shadow-sm transition-all"
                  style={{
                    background: `conic-gradient(#3b82f6 0% ${topicPercentage}%, #f1f5f9 ${topicPercentage}% 100%)`,
                  }}
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-xl sm:text-2xl font-extrabold text-blue-600">
                      {topicPercentage}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-around pt-3 border-t border-slate-100 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-sm shrink-0"></span>
                  <span className="text-xs font-bold text-slate-700">
                    {coveredTopics} Completed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300 shrink-0"></span>
                  <span className="text-xs font-semibold text-slate-500">
                    {remainingTopics} Remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Widget 2: Academic Progress & Level (5 Levels & Error Ratio) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Academic Progress & Level</h3>
                  <div className="flex flex-wrap items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      Level {currentLevel}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ({levelTitle} • Out of 5 Levels)
                    </span>
                  </div>
                </div>
                <Link
                  href="/configure-test"
                  title="Retake Assessment Test"
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-2xl transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <i className="fa-solid fa-play text-[10px] text-slate-500"></i>
                  <span>Test again</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                {/* 1. Covered Topics Bar */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-700">Covered Topics</span>
                    <span className="text-emerald-600 font-mono font-bold">
                      {coveredTopics} / {totalTopics}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${topicPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* 2. Mistake Error Ratio */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-700">Mistake Error Ratio</span>
                    <span className="text-rose-600 font-mono font-bold">
                      {errorRatio}%
                    </span>
                  </div>
                  <div className="w-full bg-rose-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${errorRatio}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. Attempted Practice Tests */}
                <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 sm:col-span-2">
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-slate-700">Attempted Practice Tests</span>
                    <span className="text-purple-600 font-mono font-bold">
                      {totalTests} Completed / 25 Goal
                    </span>
                  </div>
                  <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((totalTests / 25) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <h2 className="text-lg font-bold text-slate-900">Course Syllabus & Chapters</h2>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Scroll to view all {allChapters.length} Units →
              </span>
            </div>
            <Link
              href="/learn"
              title="View complete syllabus breakdown"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              View All
            </Link>
          </div>

          {/* Horizontally Scrollable Chapters Cards (Left to Right) */}
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 mb-6 pt-1 snap-x scroll-smooth">
            {allChapters.map((chap, idx) => {
              const compCount = chap.Topic.filter((t) => t.Progress.length > 0).length;
              const chapPercent = chap.Topic.length > 0 ? Math.round((compCount / chap.Topic.length) * 100) : 0;

              // Color cycling across units for rich visual contrast
              const colorThemes = [
                { bg: "from-sky-50/70 to-blue-50/40", border: "border-sky-100 hover:border-sky-300", badgeBg: "bg-sky-100 text-sky-700", barBg: "bg-sky-200/60", barFill: "bg-sky-500", text: "text-sky-800" },
                { bg: "from-purple-50/70 to-fuchsia-50/40", border: "border-purple-100 hover:border-purple-300", badgeBg: "bg-purple-100 text-purple-700", barBg: "bg-purple-200/60", barFill: "bg-purple-500", text: "text-purple-800" },
                { bg: "from-emerald-50/70 to-teal-50/40", border: "border-emerald-100 hover:border-emerald-300", badgeBg: "bg-emerald-100 text-emerald-700", barBg: "bg-emerald-200/60", barFill: "bg-emerald-500", text: "text-emerald-800" },
                { bg: "from-indigo-50/70 to-blue-50/40", border: "border-indigo-100 hover:border-indigo-300", badgeBg: "bg-indigo-100 text-indigo-700", barBg: "bg-indigo-200/60", barFill: "bg-indigo-500", text: "text-indigo-800" },
                { bg: "from-amber-50/70 to-orange-50/40", border: "border-amber-100 hover:border-amber-300", badgeBg: "bg-amber-100 text-amber-700", barBg: "bg-amber-200/60", barFill: "bg-amber-500", text: "text-amber-800" },
              ];
              const theme = colorThemes[idx % colorThemes.length];

              return (
                <Link
                  key={chap.id}
                  href={`/learn?topicId=${chap.Topic[0]?.id || ""}`}
                  title={`Open Unit ${chap.chapterNumber} Modules`}
                  className={`bg-gradient-to-br ${theme.bg} ${theme.border} ${theme.text} p-5 rounded-3xl border transition shadow-2xs hover:shadow-md flex flex-col justify-between group block min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start cursor-pointer`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 ${theme.badgeBg} font-bold text-xs rounded-lg`}>
                        Unit {chap.chapterNumber}
                      </span>
                      <span className="text-xs font-semibold opacity-75">
                        {chap.Topic.length} Topics
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition line-clamp-1">
                      {chap.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-1">
                      {compCount} of {chap.Topic.length} topics completed.
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700">Progress</span>
                      <span className="font-mono">{chapPercent}%</span>
                    </div>
                    <div className={`w-full ${theme.barBg} h-2 rounded-full overflow-hidden`}>
                      <div
                        className={`${theme.barFill} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${chapPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Practice Hub Card */}
          <div
            title="Open Practice & Revision Exams Hub"
            className="bg-gradient-to-br from-rose-50/75 to-pink-50/40 p-5 rounded-3xl border border-rose-100 hover:border-rose-300 transition shadow-sm hover:shadow-md flex flex-col justify-between mb-8"
          >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs shadow-md shadow-rose-500/20">
                      💻
                    </span>
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-lg">
                      Exam Prep
                    </span>
                  </div>
                  <span className="text-xs text-rose-600/80 font-semibold">
                    Punjab Board Question Bank
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Computer Science Practice & Revision Hub
                </h3>
                <p className="text-slate-600 text-xs mt-1">
                  Attempt topical programming tests, output-based questions, and review
                  board-pattern mark schemes.
                </p>
              </div>
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-rose-100/60 gap-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                  <i className="fa-solid fa-clock-rotate-left text-rose-500"></i>
                  <span>Test Your Programming Logic</span>
                </div>
                <Link
                  href="/practice"
                  title="Start Practice Exam Now"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Attempt Exam</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>
              </div>
            </div>
          </div>

        {/* Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium">
          <p>
            &copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th
            Standard Computer Science.
          </p>
        </footer>
      </main>
    </StudentShell>
  );
}
