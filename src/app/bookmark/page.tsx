import React from "react";
import { prisma } from "@/lib/prisma";
import { BookmarkClient, BookmarkItem } from "./BookmarkClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saved Bookmarks - Computer Science (11th Standard)",
  description: "Review and organize your saved board questions, past papers, and theory notes.",
};

export default async function BookmarkPage() {
  const student = (await prisma.user.findFirst({
    where: { role: "STUDENT" },
  })) || (await prisma.user.findFirst());

  const dbBookmarks = await prisma.bookmark.findMany({
    where: student ? { userId: student.id } : undefined,
    include: {
      Question: {
        include: {
          Chapter: true,
          QuestionOption: true,
        },
      },
      PastPaper: true,
      Lesson: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedBookmarks: BookmarkItem[] = dbBookmarks.map((b: any) => {
    if (b.PastPaper) {
      return {
        id: b.id,
        category: "paper",
        categoryBadge: "Past Paper",
        unit: b.PastPaper.session ? `${b.PastPaper.session} ${b.PastPaper.year}` : "Board Paper",
        title: b.PastPaper.title,
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        description: "Official Punjab Board past paper marked for exam review.",
        link: `/past-papers/${b.PastPaper.id}`,
        linkLabel: "View Paper",
      };
    }

    if (b.Question) {
      return {
        id: b.id,
        category: "question",
        categoryBadge: "Important Question",
        unit: b.Question.Chapter?.title ? b.Question.Chapter.title.replace(/^Unit\s*\d+:\s*/i, "") : "Unit 1: Basics of IT",
        title: b.Question.text,
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        description: b.Question.explanation || "Saved from practice test.",
        link: `/practice?unit=${b.Question.Chapter?.chapterNumber || 1}`,
        linkLabel: "Practice Topic",
        questionData: {
          id: b.Question.id,
          text: b.Question.text,
          explanation: b.Question.explanation,
          options: (b.Question.QuestionOption || []).map((o: any) => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        },
      };
    }

    return {
      id: b.id,
      category: "theory",
      categoryBadge: "Theory Notes",
      unit: b.Lesson?.title || "Lesson Notes",
      title: b.Lesson?.title || "Computer Science Essential Notes",
      date: new Date(b.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      description: "Saved lesson content from syllabus.",
      link: "/learn",
      linkLabel: "View Notes",
    };
  });

  // Authentic Class 11 CS initial fallbacks if user has 0 bookmarks
  if (formattedBookmarks.length === 0) {
    formattedBookmarks.push(
      {
        id: "demo-1",
        category: "question",
        categoryBadge: "Important Question",
        unit: "Unit 2: Information Networks",
        title: "Which network topology requires a multipoint connection with terminators?",
        date: "Sep 20, 2026",
        description: "Bus topology uses a single common backbone cable with terminating resistors at each end.",
        link: "/practice?unit=2",
        linkLabel: "Practice Topic",
        questionData: {
          id: "demo-q-1",
          text: "Which network topology requires a multipoint connection with terminators at both ends?",
          explanation: "Bus topology relies on a single continuous backbone cable where terminators prevent signal reflection.",
          options: [
            { id: "opt-1", text: "Star Topology", isCorrect: false },
            { id: "opt-2", text: "Bus Topology", isCorrect: true },
            { id: "opt-3", text: "Mesh Topology", isCorrect: false },
            { id: "opt-4", text: "Ring Topology", isCorrect: false },
          ],
        },
      },
      {
        id: "demo-2",
        category: "paper",
        categoryBadge: "Past Paper",
        unit: "BISE Lahore Annual 2024",
        title: "BISE Lahore Computer Science Class 11 (Annual 2024 - Group 1)",
        date: "Sep 18, 2026",
        description: "Official board paper marked for full syllabus mock exam preparation.",
        link: "/past-papers",
        linkLabel: "View Paper",
      },
      {
        id: "demo-3",
        category: "theory",
        categoryBadge: "Theory Notes",
        unit: "Unit 5: Computer Architecture",
        title: "Von Neumann Architecture: Bus Interconnection & CPU Registers",
        date: "Sep 15, 2026",
        description: "Comprehensive review of Data Bus, Address Bus, Control Bus and internal registers (PC, MAR, MBR).",
        link: "/learn",
        linkLabel: "View Notes",
      }
    );
  }

  return (
    <BookmarkClient
      initialBookmarks={formattedBookmarks}
      studentName={student?.name || "Uzair Salman"}
    />
  );
}
