import React from "react";
import { prisma } from "@/lib/prisma";
import {
  LearnClient,
  SerializedChapter,
  SerializedTopic,
  SerializedLesson,
  SerializedLessonBlock,
} from "./LearnClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface LearnPageProps {
  searchParams?: Promise<{ topicId?: string }>;
}

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedTopicId = resolvedSearchParams?.topicId;

  // Query student
  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });

  const studentId = student?.id || "";
  const studentName = student?.name || "Uzair Salman";

  // Query student's completed topic progress
  const progressRecords = await prisma.progress.findMany({
    where: { userId: studentId, completed: true },
    select: { topicId: true },
  });

  const completedTopicSet = new Set(progressRecords.map((p) => p.topicId));

  // Query all chapters for Class 11 Computer Science
  const dbChapters = await prisma.chapter.findMany({
    where: {
      Subject: {
        classId: "class-11",
      },
    },
    include: {
      Topic: {
        include: {
          TopicLearnContent: true,
          Lesson: {
            include: {
              LessonBlock: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
        orderBy: { topicNumber: "asc" },
      },
    },
    orderBy: { chapterNumber: "asc" },
  });

  // Transform into serialized client structures
  const chapters: SerializedChapter[] = dbChapters.map((c) => {
    const topics: SerializedTopic[] = c.Topic.map((t) => {
      const lessons: SerializedLesson[] = t.Lesson.map((l) => {
        const blocks: SerializedLessonBlock[] = l.LessonBlock.map((b) => ({
          id: b.id,
          order: b.order,
          type: b.type,
          content: b.content,
        }));
        return {
          id: l.id,
          title: l.title,
          blocks,
        };
      });

      const tlc = t.TopicLearnContent;
      const learnContent = tlc
        ? {
            id: tlc.id,
            definitionEnglish: tlc.definitionEnglish,
            definitionUrdu: tlc.definitionUrdu,
            rubricKeywords: Array.isArray(tlc.rubricKeywords) ? (tlc.rubricKeywords as string[]) : [],
            easyExplanationEnglish: tlc.easyExplanationEnglish,
            easyExplanationUrdu: tlc.easyExplanationUrdu,
            realWorldEnglish: tlc.realWorldEnglish,
            realWorldUrdu: tlc.realWorldUrdu,
            realWorldDiagramUrl: tlc.realWorldDiagramUrl,
            realWorldDiagramTitle: tlc.realWorldDiagramTitle,
            realWorldDiagramData: tlc.realWorldDiagramData,
            contentType: tlc.contentType,
            technicalTitle: tlc.technicalTitle,
            diagramUrl: tlc.diagramUrl,
            diagramCaption: tlc.diagramCaption,
            codeSnippet: tlc.codeSnippet,
            codeLanguage: tlc.codeLanguage,
            codeExplanation: tlc.codeExplanation,
            hasInteractive: tlc.hasInteractive,
            interactiveTitle: tlc.interactiveTitle,
            interactiveType: tlc.interactiveType,
            interactiveConfig: tlc.interactiveConfig,
            examQuestion: tlc.examQuestion,
            boardReference: tlc.boardReference,
            markingScheme: Array.isArray(tlc.markingScheme)
              ? (tlc.markingScheme as { criteria: string; marks: number | string }[])
              : [],
            solutionGuidance: tlc.solutionGuidance,
          }
        : null;

      return {
        id: t.id,
        title: t.title,
        topicNumber: t.topicNumber,
        chapterId: c.id,
        chapterNumber: c.chapterNumber,
        chapterTitle: c.title,
        lessons,
        isCompleted: completedTopicSet.has(t.id),
        learnContent,
      };
    });

    return {
      id: c.id,
      chapterNumber: c.chapterNumber,
      title: c.title,
      topics,
    };
  });

  return (
    <LearnClient
      chapters={chapters}
      initialTopicId={requestedTopicId}
      studentName={studentName}
    />
  );
}
