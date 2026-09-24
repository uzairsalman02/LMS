import React from "react";
import { prisma } from "@/lib/prisma";
import { ExamModeClient, ExamReadinessStats } from "./ExamModeClient";

export const revalidate = 0;

export const metadata = {
  title: "Exam Mode Hub - Computer Science (11th Standard)",
  description: "Official Board Exam Simulation Hub for 11th Standard Computer Science.",
};

export default async function ExamModePage() {
  const [dbChapters, student, totalTopicsCount] = await Promise.all([
    prisma.chapter.findMany({
      where: {
        OR: [
          { Subject: { classId: "class-11" } },
          { id: { startsWith: "chap-11" } },
        ],
      },
      orderBy: { chapterNumber: "asc" },
    }),
    prisma.user.findFirst({
      where: { role: "STUDENT" },
    }),
    prisma.topic.count({
      where: { Chapter: { Subject: { classId: "class-11" } } },
    }),
  ]);

  const studentId = student?.id;

  const [coveredTopicsCount, activeMistakesCount, attemptAnswers] = await Promise.all([
    studentId
      ? prisma.progress.count({ where: { userId: studentId, completed: true } })
      : prisma.progress.count({ where: { completed: true } }),
    studentId
      ? prisma.mistake.count({ where: { userId: studentId, resolved: false } })
      : prisma.mistake.count({ where: { resolved: false } }),
    prisma.attemptAnswer.findMany({
      select: { isCorrect: true },
    }),
  ]);

  const chapters = dbChapters.map((c) => ({
    id: c.id,
    chapterNumber: c.chapterNumber,
    title: c.title,
  }));

  const totalTopics = totalTopicsCount > 0 ? totalTopicsCount : 35;
  const coveredTopics = coveredTopicsCount || 0;
  const syllabusCoverage = Math.min(100, Math.round((coveredTopics / totalTopics) * 100));

  const totalAnswers = attemptAnswers.length;
  const correctAnswers = attemptAnswers.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 75;

  const activeMistakes = activeMistakesCount || 0;

  // Formula: (55% Syllabus Coverage + 45% Accuracy) - (1.5 * Active Mistakes)
  const baseReadiness = (syllabusCoverage * 0.55) + (accuracy * 0.45);
  const mistakePenalty = Math.min(25, activeMistakes * 1.5);
  const readinessScore = Math.max(5, Math.min(100, Math.round(baseReadiness - mistakePenalty)));

  const readinessStats: ExamReadinessStats = {
    syllabusCoverage,
    coveredTopics,
    totalTopics,
    accuracy,
    totalAnswers,
    correctAnswers,
    activeMistakes,
    readinessScore,
  };

  return <ExamModeClient chapters={chapters} readinessStats={readinessStats} />;
}
