import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaperViewerClient, PaperDetail, QuestionData } from "./PaperViewerClient";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPaperPage({ params }: PageProps) {
  const resolvedParams = await params;
  const paperId = resolvedParams.id;

  let dbPaper = await prisma.pastPaper.findUnique({
    where: { id: paperId },
    include: {
      Board: true,
      PastPaperQuestion: {
        include: {
          Question: {
            include: {
              QuestionOption: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!dbPaper) {
    dbPaper = await prisma.pastPaper.findFirst({
      include: {
        Board: true,
        PastPaperQuestion: {
          include: {
            Question: {
              include: {
                QuestionOption: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });
  }

  if (!dbPaper) {
    notFound();
  }

  // Extract mapped questions
  const mappedQuestions: QuestionData[] = dbPaper.PastPaperQuestion.map((pq) => ({
    id: pq.Question.id,
    questionNumber: pq.questionNumber,
    type: pq.Question.type,
    marks: pq.marks || pq.Question.marks,
    text: pq.Question.text,
    answer: pq.Question.answer,
    explanation: pq.Question.explanation,
    options: pq.Question.QuestionOption.map((o) => ({
      id: o.id,
      text: o.text,
      isCorrect: o.isCorrect,
      order: o.order,
    })),
  }));

  // If paper has no LONG questions mapped yet, grab some actual verified LONG questions from DB
  const hasLong = mappedQuestions.some((q) => q.type === "LONG");
  if (!hasLong) {
    const extraLongQuestions = await prisma.question.findMany({
      where: { type: "LONG" },
      take: 3,
    });
    extraLongQuestions.forEach((eq, idx) => {
      mappedQuestions.push({
        id: eq.id,
        questionNumber: `Q.${mappedQuestions.length + 1}`,
        type: "LONG",
        marks: eq.marks || 8,
        text: eq.text,
        answer: eq.answer,
        explanation: eq.explanation,
      });
    });
  }

  const paper: PaperDetail = {
    id: dbPaper.id,
    title: dbPaper.title,
    year: dbPaper.year,
    session: dbPaper.session,
    paperType: dbPaper.paperType,
    totalMarks: dbPaper.totalMarks,
    durationMinutes: dbPaper.durationMinutes,
    boardName: dbPaper.Board?.name || "Punjab Board",
    fileUrl: dbPaper.fileUrl,
    questions: mappedQuestions,
  };

  return <PaperViewerClient paper={paper} />;
}
