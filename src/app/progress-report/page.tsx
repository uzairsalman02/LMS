import React from "react";
import { prisma } from "@/lib/prisma";
import {
  CurrentTestReportClient,
  SerializedAttemptReport,
  SerializedAnswerItem,
} from "./CurrentTestReportClient";
import { OverallTranscriptClient } from "./OverallTranscriptClient";
import { getReportSignatorySettings } from "@/lib/settings";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    attemptId?: string;
    type?: string;
  }>;
}

export default async function ProgressReportPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isOverall = params.type === "overall";

  const signatorySettings = await getReportSignatorySettings();

  if (isOverall) {
    const [studentUser, attempts, chapters, allAnswers] = await Promise.all([
      prisma.user.findFirst({
        where: { role: "STUDENT" },
        select: { name: true },
      }),
      prisma.attempt.findMany({
        include: { Test: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.chapter.findMany({
        where: { subjectId: "subj-cs-11" },
        orderBy: { chapterNumber: "asc" },
        include: { Question: { select: { id: true } } },
      }),
      prisma.attemptAnswer.findMany({
        include: { Question: { select: { chapterId: true } } },
      }),
    ]);

    const studentName = studentUser?.name || "Uzair Salman";
    const rollNumber = "BISE-2026-CS11";

    let totalScoreSum = 0;
    let totalMaxScoreSum = 0;
    let passedAttempts = 0;

    attempts.forEach((a) => {
      const s = a.score || 0;
      const ms = a.maxScore || (a.Test?.totalMarks || 1);
      totalScoreSum += s;
      totalMaxScoreSum += ms;
      if (s / ms >= 0.4) passedAttempts++;
    });

    const overallScorePct =
      totalMaxScoreSum > 0
        ? parseFloat(((totalScoreSum / totalMaxScoreSum) * 100).toFixed(1))
        : 0;

    const getGrade = (pct: number) => {
      if (pct >= 80) return "A+";
      if (pct >= 70) return "A";
      if (pct >= 60) return "B";
      if (pct >= 50) return "C";
      if (pct >= 40) return "D";
      if (pct >= 33) return "E";
      return "F";
    };

    const overallGrade = getGrade(overallScorePct);

    const units = chapters.map((c) => {
      const chapAnswers = allAnswers.filter((a) => a.Question?.chapterId === c.id);
      const totalAttempted = chapAnswers.length;
      const correctCount = chapAnswers.filter((a) => a.isCorrect).length;
      const accuracy =
        totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

      let status = "Pending";
      if (totalAttempted > 0) {
        if (accuracy >= 70) status = "Mastered";
        else if (accuracy >= 40) status = "Passed";
        else status = "Started";
      }

      return {
        chapterNumber: c.chapterNumber,
        name: c.title.replace(/^Unit\s*\d+:\s*/, ""),
        totalQuestions: c.Question.length,
        attempted: totalAttempted,
        accuracy: totalAttempted > 0 ? `${accuracy}%` : "—",
        status,
      };
    });

    return (
      <OverallTranscriptClient
        studentName={studentName}
        rollNumber={rollNumber}
        overallScore={`${overallGrade} (${overallScorePct}%)`}
        overallScorePct={overallScorePct}
        overallGrade={overallGrade}
        totalAttempts={attempts.length}
        passedAttempts={passedAttempts}
        totalAnswers={allAnswers.length}
        units={units}
        signatoryName={signatorySettings.signatoryName}
        signatoryTitle={signatorySettings.signatoryTitle}
        signatureUrl={signatorySettings.signatureUrl}
        showSignature={signatorySettings.showSignature}
      />
    );
  }

  // Find target attempt
  let attempt = null;
  if (params.attemptId) {
    attempt = await prisma.attempt.findUnique({
      where: { id: params.attemptId },
      include: {
        Test: true,
        User: true,
        AttemptAnswer: {
          include: {
            Question: {
              include: {
                Chapter: true,
                QuestionOption: {
                  orderBy: { order: "asc" },
                },
                PastPaperQuestion: {
                  include: {
                    PastPaper: {
                      include: { Board: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // Fallback: If no attemptId provided or not found, look for latest attempt
  if (!attempt) {
    attempt = await prisma.attempt.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        Test: true,
        User: true,
        AttemptAnswer: {
          include: {
            Question: {
              include: {
                Chapter: true,
                QuestionOption: {
                  orderBy: { order: "asc" },
                },
                PastPaperQuestion: {
                  include: {
                    PastPaper: {
                      include: { Board: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // If still no attempt found, render the overall transcript
  if (!attempt) {
    return <OverallTranscriptClient />;
  }

  // Calculate stats
  const totalQuestions = attempt.AttemptAnswer.length || attempt.maxScore || 1;
  const correctCount = attempt.AttemptAnswer.filter((a) => a.isCorrect).length;
  const unattemptedCount = attempt.AttemptAnswer.filter((a) => !a.selectedOptionId).length;
  const incorrectCount = Math.max(0, totalQuestions - correctCount - unattemptedCount);

  const maxScore = attempt.maxScore || totalQuestions;
  const score = attempt.score;
  const percentage = Math.round((score / (maxScore || 1)) * 100);

  let grade = "F (Needs Improvement)";
  let gradeBadgeClass = "text-rose-600";
  if (percentage >= 80) {
    grade = "A+ (Distinction)";
    gradeBadgeClass = "text-emerald-600";
  } else if (percentage >= 70) {
    grade = "A (Excellent)";
    gradeBadgeClass = "text-emerald-600";
  } else if (percentage >= 60) {
    grade = "B (Good)";
    gradeBadgeClass = "text-blue-600";
  } else if (percentage >= 50) {
    grade = "C (Satisfactory)";
    gradeBadgeClass = "text-amber-600";
  }

  // Format Duration
  const durationSec =
    attempt.completedAt && attempt.startedAt
      ? Math.max(0, Math.round((attempt.completedAt.getTime() - attempt.startedAt.getTime()) / 1000))
      : 180;
  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const durationFormatted = `${mins}m ${secs.toString().padStart(2, "0")}s`;

  // Format Date
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(attempt.completedAt || attempt.createdAt);

  const answers: SerializedAnswerItem[] = attempt.AttemptAnswer.map((ans) => {
    const q = ans.Question;
    const selectedOpt = q.QuestionOption.find((o) => o.id === ans.selectedOptionId);
    const correctOpt = q.QuestionOption.find((o) => o.isCorrect);

    const occurrences = q.PastPaperQuestion.map((pq) => ({
      boardName: pq.PastPaper.Board?.name || "Punjab Board",
      boardCode: pq.PastPaper.Board?.code || "BISE",
      year: pq.PastPaper.year,
      session: pq.PastPaper.session,
      paperType: pq.PastPaper.paperType || undefined,
    }));

    // Deduplicate occurrences
    const seen = new Set<string>();
    const uniqueOccurrences = occurrences.filter((occ) => {
      const key = `${occ.boardCode}-${occ.year}-${occ.paperType || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      id: ans.id,
      questionId: q.id,
      questionText: q.text,
      questionType: (q.type as "MCQ" | "SHORT" | "LONG") || "MCQ",
      chapterTitle: q.Chapter?.title || "Class 11 Computer Science",
      marksObtained: ans.marksObtained,
      maxMarks: q.marks || (q.type === "LONG" ? 5 : q.type === "SHORT" ? 2 : 1),
      isCorrect: ans.isCorrect,
      selectedOptionId: ans.selectedOptionId,
      selectedOptionText: selectedOpt?.text || null,
      correctOptionText: correctOpt?.text || null,
      typedAnswer: ans.typedAnswer || null,
      modelAnswer: q.answer || null,
      aiFeedback: (ans.aiFeedback as any) || null,
      explanation: q.explanation,
      pastPaperOccurrences: uniqueOccurrences,
      repeatCount: uniqueOccurrences.length,
      options: q.QuestionOption.map((opt) => ({
        id: opt.id,
        text: opt.text,
        order: opt.order,
        isCorrect: opt.isCorrect,
      })),
    };
  });

  // Extract proctoring metadata if available
  let proctoringData = {
    violationsCount: 0,
    violationLogs: [] as Array<{ time: string; type: string }>,
    integrityStatus: "CLEAN",
  };
  for (const ans of attempt.AttemptAnswer) {
    const fb = ans.aiFeedback as any;
    if (fb?.proctoring) {
      proctoringData = fb.proctoring;
      break;
    }
  }

  const report: SerializedAttemptReport = {
    id: attempt.id,
    testTitle: attempt.Test?.title || "Class 11 Mock Exam Assessment",
    studentName: attempt.User?.name || "Uzair Salman",
    rollNumber: "CS-11-2026-04",
    dateFormatted,
    durationFormatted,
    score,
    maxScore,
    percentage,
    grade,
    gradeBadgeClass,
    correctCount,
    incorrectCount,
    skippedCount: unattemptedCount,
    totalQuestions,
    answers,
    proctoring: proctoringData,
  };

  return (
    <CurrentTestReportClient
      report={report}
      overallTranscriptAvailable={true}
      signatoryName={signatorySettings.signatoryName}
      signatoryTitle={signatorySettings.signatoryTitle}
      signatureUrl={signatorySettings.signatureUrl}
      showSignature={signatorySettings.showSignature}
    />
  );
}
