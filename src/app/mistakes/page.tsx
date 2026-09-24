import React from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { prisma } from "@/lib/prisma";
import { MistakesClient, SerializedMistakeItem } from "./MistakesClient";

export const revalidate = 0;

export default async function MistakesPage() {
  const [dbMistakes, totalLogged, resolvedCount, chapters, incorrectAttempts] = await Promise.all([
    prisma.mistake.findMany({
      where: {
        Question: { published: true },
      },
      include: {
        Question: {
          include: {
            Chapter: true,
            Topic: true,
            QuestionOption: {
              orderBy: { order: "asc" },
            },
            PastPaperQuestion: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mistake.count({
      where: { Question: { published: true } },
    }),
    prisma.mistake.count({
      where: { resolved: true, Question: { published: true } },
    }),
    prisma.chapter.findMany({
      where: { subjectId: "subj-cs-11" },
      orderBy: { chapterNumber: "asc" },
      select: { id: true, chapterNumber: true, title: true },
    }),
    prisma.attemptAnswer.groupBy({
      by: ["questionId"],
      where: { isCorrect: false },
      _count: { id: true },
    }),
  ]);

  const unresolvedCount = totalLogged - resolvedCount;
  const fixedRate =
    totalLogged > 0 ? ((resolvedCount / totalLogged) * 100).toFixed(1) : "0.0";

  // Build accurate mistake counts per question from attempt history
  const questionFailCountMap: Record<string, number> = {};
  incorrectAttempts.forEach((item) => {
    questionFailCountMap[item.questionId] = item._count.id;
  });

  // Calculate mistake frequency per topic across all attempts
  const topicFailCountMap: Record<
    string,
    { topicId: string; title: string; chapterNumber: number; count: number }
  > = {};
  dbMistakes.forEach((m) => {
    const qCount = questionFailCountMap[m.questionId] || 1;
    const tId = m.Question?.topicId;
    if (tId) {
      if (!topicFailCountMap[tId]) {
        topicFailCountMap[tId] = {
          topicId: tId,
          title: m.Question?.Topic?.title || "Topic",
          chapterNumber: m.Question?.Chapter?.chapterNumber || 1,
          count: 0,
        };
      }
      topicFailCountMap[tId].count += qCount;
    }
  });

  const frequentTopics = Object.values(topicFailCountMap)
    .filter((t) => t.count >= 2)
    .sort((a, b) => b.count - a.count);

  // Build accurate mistake distribution by authentic Class 11 chapters
  const unitMap: Record<
    number,
    { chapterNumber: number; title: string; count: number; unresolved: number }
  > = {};

  chapters.forEach((c) => {
    unitMap[c.chapterNumber] = {
      chapterNumber: c.chapterNumber,
      title: c.title.replace(/^Unit\s*\d+:\s*/, ""),
      count: 0,
      unresolved: 0,
    };
  });

  dbMistakes.forEach((m) => {
    const cNum = m.Question?.Chapter?.chapterNumber || 1;
    if (!unitMap[cNum]) {
      unitMap[cNum] = {
        chapterNumber: cNum,
        title: m.Question?.Chapter?.title || `Unit ${cNum}`,
        count: 0,
        unresolved: 0,
      };
    }
    unitMap[cNum].count += 1;
    if (!m.resolved) {
      unitMap[cNum].unresolved += 1;
    }
  });

  const unitList = Object.values(unitMap).sort((a, b) => b.unresolved - a.unresolved);

  const serializedMistakes: SerializedMistakeItem[] = dbMistakes.map((m) => {
    const q = m.Question;
    const incorrectCount = questionFailCountMap[m.questionId] || 1;
    const topicMistakeCount =
      (q?.topicId && topicFailCountMap[q.topicId]?.count) || incorrectCount;

    return {
      id: m.id,
      questionId: m.questionId,
      questionText: q?.text || "Question statement logged",
      questionType: (q?.type as "MCQ" | "SHORT" | "LONG") || "MCQ",
      chapterId: q?.Chapter?.id,
      chapterNumber: q?.Chapter?.chapterNumber || 1,
      chapterTitle: q?.Chapter?.title || "Unit 1: Introduction to Software Development",
      topicId: q?.Topic?.id,
      topicTitle: q?.Topic?.title || "Core Curriculum Topic",
      notes: m.notes,
      answer: q?.answer,
      explanation: q?.explanation,
      marks: q?.marks,
      resolved: m.resolved,
      createdAt: m.createdAt.toISOString(),
      options: (q?.QuestionOption || []).map((opt) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
        order: opt.order,
      })),
      repeatCount: (q?.PastPaperQuestion || []).length,
      incorrectCount,
      topicMistakeCount,
      isFrequent: incorrectCount >= 2,
    };
  });

  const rightRail = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-sm">Mistake Recovery</h3>
        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
          Real-time Audit
        </span>
      </div>

      {/* Recovery Progress Card */}
      <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-4 rounded-3xl border border-amber-200/80 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Resolved Concepts</span>
          <span className="text-xs font-bold text-amber-800">
            {resolvedCount} / {totalLogged}
          </span>
        </div>
        <div className="w-full bg-amber-100/90 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${fixedRate}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          You have mastered <strong className="text-slate-900">{fixedRate}%</strong> of your logged mock test errors.
        </p>
      </div>

      {/* Dynamic Breakdown by Authentic Punjab Board Unit */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900">Mistakes by Unit</h4>
          <span className="text-[10px] text-slate-400 font-semibold">Class 11</span>
        </div>
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
          {unitList.slice(0, 6).map((unit) => {
            const hasErrors = unit.unresolved > 0;
            const pct = unit.count > 0 ? Math.round((unit.unresolved / Math.max(1, totalLogged)) * 100) : 0;
            return (
              <div key={unit.chapterNumber} className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700 text-[11px]">
                  <span className="truncate max-w-[170px]" title={unit.title}>
                    Unit {unit.chapterNumber}: {unit.title}
                  </span>
                  <span
                    className={`font-bold ${
                      hasErrors ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {hasErrors ? `${unit.unresolved} Pending` : "✓ Clean"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      hasErrors ? (unit.unresolved > 3 ? "bg-rose-500" : "bg-amber-500") : "bg-emerald-500"
                    }`}
                    style={{ width: hasErrors ? `${Math.max(15, pct)}%` : "100%" }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Focus Error Topics (Topics with multiple incorrect attempts) */}
      {frequentTopics.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200/80 p-4 rounded-3xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-xs">
              <i className="fa-solid fa-fire text-rose-600"></i>
              <span>High Focus Topics</span>
            </div>
            <span className="text-[10px] font-black text-rose-700 bg-rose-100 border border-rose-200 px-1.5 py-0.2 rounded-md">
              {frequentTopics.length} Areas
            </span>
          </div>
          <p className="text-[11px] text-rose-700/90 leading-snug">
            Concepts answered incorrectly multiple times across practice exams:
          </p>
          <div className="space-y-1.5">
            {frequentTopics.slice(0, 3).map((ft) => (
              <div
                key={ft.topicId}
                className="bg-white/90 p-2.5 rounded-2xl border border-rose-200/60 flex items-center justify-between text-xs shadow-2xs"
              >
                <div className="truncate max-w-[155px]" title={ft.title}>
                  <p className="font-bold text-slate-800 truncate text-[11px]">
                    {ft.title.replace(/^Topic\s*\d+\.\d+:\s*/, "")}
                  </p>
                  <span className="text-[10px] text-slate-400">Unit {ft.chapterNumber}</span>
                </div>
                <span className="text-[10px] font-black text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                  {ft.count}x Errors
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Targeted Drill CTA Card */}
      {unresolvedCount > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-3xl border border-amber-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
            <i className="fa-solid fa-bolt text-amber-600"></i>
            <span>Targeted Drill Session</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Take a personalized revision quiz targeting strictly your {unresolvedCount} pending errors.
          </p>
          <Link
            href="/mock-test?mode=drill"
            className="block text-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow-sm"
          >
            Launch Mistakes Drill 🎯
          </Link>
        </div>
      )}

      {/* Quick Tip Card */}
      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 space-y-1.5">
        <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
          <i className="fa-solid fa-lightbulb text-amber-500"></i>
          <span>Examiner Tip</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Students who review their incorrect options within 24 hours of taking a mock test improve their final BISE board score by up to 25%.
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-triangle-exclamation"
      rightPanelLabel="Recovery"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <MistakesClient initialMistakes={serializedMistakes} chapters={chapters} />

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8 border-t border-slate-100">
          <p>
            &copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science (Punjab Curriculum).
          </p>
        </footer>
      </main>
    </StudentShell>
  );
}
