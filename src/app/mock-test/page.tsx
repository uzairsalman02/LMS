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
    paperType?: string;
    format?: string;
  }>;
}

export default async function MockTestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const count = parseInt(params.count || "15", 10);
  const time = parseInt(params.time || "30", 10);
  const chapterIds = params.chapters ? params.chapters.split(",").filter(Boolean) : [];
  const paperType = params.paperType || params.format || "objective";

  let dbQuestions: any[] = [];

  const baseInclude = {
    Chapter: true,
    QuestionOption: {
      orderBy: { order: "asc" as const },
    },
    PastPaperQuestion: {
      include: {
        PastPaper: {
          include: {
            Board: true,
          },
        },
      },
    },
  };

  if (params.mode === "drill") {
    // Targeted Mistakes Drill: load unresolved mistake questions
    const mistakes = await prisma.mistake.findMany({
      where: {
        resolved: false,
        Question: { published: true },
      },
      include: {
        Question: {
          include: baseInclude,
        },
      },
      take: count || 15,
    });

    if (mistakes.length > 0) {
      dbQuestions = mistakes.map((m) => m.Question).filter(Boolean);
    } else {
      // Fallback: If all are resolved, load any recent mistakes
      const allMistakes = await prisma.mistake.findMany({
        where: { Question: { published: true } },
        include: {
          Question: {
            include: baseInclude,
          },
        },
        take: count || 15,
      });
      dbQuestions = allMistakes.map((m) => m.Question).filter(Boolean);
    }

    if (dbQuestions.length === 0) {
      dbQuestions = await prisma.question.findMany({
        where: { published: true },
        include: baseInclude,
        take: count || 15,
      });
    }
  } else if (paperType === "full") {
    // Standard Full Board Simulation: 15 MCQs + 6 Short Questions + 2 Long Questions
    const [mcqs, shorts, longs] = await Promise.all([
      prisma.question.findMany({
        where: {
          type: "MCQ",
          published: true,
          ...(chapterIds.length > 0 ? { chapterId: { in: chapterIds } } : {}),
        },
        include: baseInclude,
        orderBy: [{ PastPaperQuestion: { _count: "desc" } }, { createdAt: "asc" }],
        take: 15,
      }),
      prisma.question.findMany({
        where: {
          type: "SHORT",
          published: true,
          ...(chapterIds.length > 0 ? { chapterId: { in: chapterIds } } : {}),
        },
        include: baseInclude,
        orderBy: [{ PastPaperQuestion: { _count: "desc" } }, { createdAt: "asc" }],
        take: 6,
      }),
      prisma.question.findMany({
        where: {
          type: "LONG",
          published: true,
          ...(chapterIds.length > 0 ? { chapterId: { in: chapterIds } } : {}),
        },
        include: baseInclude,
        orderBy: [{ PastPaperQuestion: { _count: "desc" } }, { createdAt: "asc" }],
        take: 2,
      }),
    ]);

    dbQuestions = [...mcqs, ...shorts, ...longs];
  } else if (paperType === "subjective") {
    // Subjective Paper: 8 Short Questions + 3 Long Questions
    const [shorts, longs] = await Promise.all([
      prisma.question.findMany({
        where: {
          type: "SHORT",
          published: true,
          ...(chapterIds.length > 0 ? { chapterId: { in: chapterIds } } : {}),
        },
        include: baseInclude,
        orderBy: [{ PastPaperQuestion: { _count: "desc" } }, { createdAt: "asc" }],
        take: 8,
      }),
      prisma.question.findMany({
        where: {
          type: "LONG",
          published: true,
          ...(chapterIds.length > 0 ? { chapterId: { in: chapterIds } } : {}),
        },
        include: baseInclude,
        orderBy: [{ PastPaperQuestion: { _count: "desc" } }, { createdAt: "asc" }],
        take: 3,
      }),
    ]);

    dbQuestions = [...shorts, ...longs];
  } else {
    // Default: Objective MCQs
    dbQuestions = await prisma.question.findMany({
      where: {
        type: "MCQ",
        published: true,
        ...(chapterIds.length > 0 ? { chapterId: { in: chapterIds } } : {}),
      },
      include: baseInclude,
      orderBy: [{ PastPaperQuestion: { _count: "desc" } }, { createdAt: "asc" }],
      take: count,
    });
  }

  const questions: MockQuestion[] = dbQuestions.map((q) => {
    const rawOccurrences = (q.PastPaperQuestion || []).map((pq: any) => ({
      boardName: pq.PastPaper.Board?.name || "Punjab Board",
      boardCode: pq.PastPaper.Board?.code || "BISE",
      year: pq.PastPaper.year,
      session: pq.PastPaper.session,
      paperType: pq.PastPaper.paperType || undefined,
      questionNumber: pq.questionNumber,
    }));

    // Deduplicate occurrences by board and year
    const seen = new Set<string>();
    const uniqueOccurrences = rawOccurrences.filter((occ: any) => {
      const key = `${occ.boardCode}-${occ.year}-${occ.paperType || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      id: q.id,
      text: q.text,
      type: (q.type as "MCQ" | "SHORT" | "LONG") || "MCQ",
      marks: q.marks || (q.type === "LONG" ? 5 : q.type === "SHORT" ? 2 : 1),
      answer: q.answer,
      explanation: q.explanation,
      chapterTitle: q.Chapter?.title || "Unit 1: Basics of IT",
      pastPaperOccurrences: uniqueOccurrences,
      repeatCount: uniqueOccurrences.length,
      options: (q.QuestionOption || []).map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        order: opt.order,
        isCorrect: opt.isCorrect,
      })),
    };
  });

  const isDrill = params.mode === "drill";
  const isFormal = params.mode === "formal";

  let testTitle = isDrill
    ? "Targeted Mistakes Drill Session"
    : isFormal
    ? "Official Board Exam Simulation"
    : "Mock Exam Room";

  let testSubtitle = "Full Syllabus • Punjab Board (BISE)";
  if (isDrill) {
    testSubtitle = `Adaptive Drill: Retesting ${questions.length} Logged Error Questions`;
  } else if (paperType === "full") {
    testSubtitle = "Part-I (Objective 15 MCQs) & Part-II (Subjective Short & Long Qs)";
  } else if (paperType === "subjective") {
    testSubtitle = "Part-II Subjective Paper: Short & Long Questions";
  } else if (chapterIds.length === 1 && questions[0]?.chapterTitle) {
    testSubtitle = questions[0].chapterTitle;
  } else if (chapterIds.length > 1) {
    testSubtitle = `${chapterIds.length} Units Selected • Board Standard`;
  }

  const returnUrl = params.mode === "drill" ? "/mistakes" : "/exam-mode";

  return (
    <MockTestClient
      questions={questions}
      initialMinutes={time}
      testTitle={testTitle}
      testSubtitle={testSubtitle}
      isFormal={isFormal}
      returnUrl={returnUrl}
    />
  );
}
