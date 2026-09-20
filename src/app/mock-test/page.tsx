import React from "react";
import { prisma } from "@/lib/prisma";
import { MockTestClient, MockQuestion } from "./MockTestClient";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    count?: string;
    time?: string;
    chapters?: string;
    difficulty?: string;
    mode?: string;
  }>;
}

export default async function MockTestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const count = parseInt(params.count || "20", 10);
  const time = parseInt(params.time || "30", 10);
  const chapterIds = params.chapters ? params.chapters.split(",").filter(Boolean) : [];

  const whereClause: any = {
    type: "MCQ",
  };

  if (chapterIds.length > 0) {
    whereClause.chapterId = { in: chapterIds };
  }

  const dbQuestions = await prisma.question.findMany({
    where: whereClause,
    include: {
      Chapter: true,
      QuestionOption: {
        orderBy: { order: "asc" },
      },
    },
    take: count,
  });

  const questions: MockQuestion[] = dbQuestions.map((q) => ({
    id: q.id,
    text: q.text,
    chapterTitle: q.Chapter?.title || "Unit 1: Basics of IT",
    options: q.QuestionOption.map((opt) => ({
      id: opt.id,
      text: opt.text,
      order: opt.order,
      isCorrect: opt.isCorrect,
    })),
  }));

  const isFormal = params.mode === "formal";

  return (
    <MockTestClient
      questions={questions}
      initialMinutes={time}
      testTitle={isFormal ? "Official Board Exam Simulation" : "Mock Exam Room"}
    />
  );
}
