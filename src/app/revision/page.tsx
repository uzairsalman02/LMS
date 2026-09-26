import React from "react";
import { prisma } from "@/lib/prisma";
import { RevisionClient, RevisionTopic, FlashcardItem } from "./RevisionClient";

export const metadata = {
  title: "Essential Revision Hub - Computer Science (11th Standard)",
  description: "Board Exams Essential Topics, Flashcards & Quick Review for Punjab Board Class 11.",
};

export const dynamic = "force-dynamic";

export default async function RevisionPage() {
  const [chapters, allAnswers, mistakes, dbTopics, dbFlashcards] = await Promise.all([
    prisma.chapter.findMany({
      where: { subjectId: "subj-cs-11" },
      orderBy: { chapterNumber: "asc" },
      include: {
        Question: {
          select: { id: true },
        },
      },
    }),
    prisma.attemptAnswer.findMany({
      include: {
        Question: {
          select: { chapterId: true },
        },
      },
    }),
    prisma.mistake.findMany({
      where: { resolved: false },
      include: {
        Question: {
          select: { chapterId: true },
        },
      },
    }),
    prisma.topic.findMany({
      where: { Chapter: { subjectId: "subj-cs-11" } },
      include: {
        Chapter: true,
        TopicLearnContent: true,
      },
      orderBy: [
        { Chapter: { chapterNumber: "asc" } },
        { topicNumber: "asc" },
      ],
    }),
    prisma.flashcard.findMany({
      where: {
        published: true,
        Topic: {
          Chapter: { subjectId: "subj-cs-11" },
        },
      },
      include: {
        Topic: {
          include: { Chapter: true },
        },
      },
      orderBy: [
        { Topic: { Chapter: { chapterNumber: "asc" } } },
        { Topic: { topicNumber: "asc" } },
      ],
    }),
  ]);

  const chapterStats = chapters.map((c: any) => {
    const chapAnswers = allAnswers.filter((a: any) => a.Question?.chapterId === c.id);
    const attemptedCount = chapAnswers.length;
    const correctCount = chapAnswers.filter((a: any) => a.isCorrect).length;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const pendingMistakes = mistakes.filter((m: any) => m.Question?.chapterId === c.id).length;

    return {
      id: c.id,
      chapterNumber: c.chapterNumber,
      title: c.title.replace(/^Unit\s*\d+:\s*/i, ""),
      totalQuestions: c.Question.length,
      attemptedQuestions: attemptedCount,
      accuracy,
      pendingMistakes,
    };
  });

  // Map database topics dynamically to RevisionTopic format
  const revisionTopics: RevisionTopic[] = dbTopics.map((topic: any) => {
    const isLong = topic.topicNumber % 2 === 0;
    const learn = topic.TopicLearnContent;

    let keyPoints: string[] = [];
    if (Array.isArray(learn?.rubricKeywords) && learn.rubricKeywords.length > 0) {
      keyPoints = learn.rubricKeywords.map((k: any) => String(k));
    } else if (Array.isArray(learn?.markingScheme) && learn.markingScheme.length > 0) {
      keyPoints = learn.markingScheme.map((m: any) => m.criteria);
    } else if (learn?.diagramCaption) {
      keyPoints = learn.diagramCaption
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    if (keyPoints.length === 0) {
      keyPoints = [
        `${topic.title.replace(/^Topic\s*[\d\.]+:\s*/i, "")} definitions & standard principles`,
        "Key block diagrams and examination presentation structure",
        "Punjab Board past questions and evaluation criteria",
      ];
    }

    return {
      id: topic.id,
      unitNumber: topic.Chapter.chapterNumber,
      unitName: topic.Chapter.title,
      badge: learn?.boardReference?.includes("Long")
        ? "8 Marks Long Q"
        : learn?.boardReference?.includes("Short")
        ? "Guaranteed Short Q"
        : isLong
        ? "8 Marks Long Q Favorite"
        : "Guaranteed Short Q",
      badgeType: isLong ? "long" : "short",
      title: topic.title.replace(/^Topic\s*[\d\.]+:\s*/i, ""),
      weightage: learn?.boardReference || `Section ${isLong ? "C (8 Marks)" : "B (3-4 Marks)"}`,
      description:
        learn?.easyExplanationEnglish ||
        learn?.definitionEnglish ||
        `Core high-yield examination concepts and principles from Unit ${topic.Chapter.chapterNumber}.`,
      keyPoints,
      boardExamTips:
        learn?.solutionGuidance ||
        "Draw clear diagrams, write step-by-step points with relevant subheadings, and highlight key terms to secure full marks.",
    };
  });

  // Map database flashcards dynamically to FlashcardItem format
  const flashcards: FlashcardItem[] = dbFlashcards.map((fc: any) => ({
    id: fc.id,
    unitNumber: fc.Topic.Chapter.chapterNumber,
    unitName: fc.Topic.Chapter.title,
    question: fc.front,
    answer: fc.back,
    keyTakeaway: fc.hint || "Master key board concepts and keywords.",
  }));

  return (
    <RevisionClient
      chapterStats={chapterStats}
      dbRevisionTopics={revisionTopics}
      dbFlashcards={flashcards}
    />
  );
}
