import React from "react";
import { prisma } from "@/lib/prisma";
import { BookmarkClient, BookmarkItem } from "./BookmarkClient";

export const revalidate = 0;

export default async function BookmarkPage() {
  const dbBookmarks = await prisma.bookmark.findMany({
    include: {
      Question: {
        include: {
          Chapter: true,
        },
      },
      PastPaper: true,
      Lesson: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedBookmarks: BookmarkItem[] = dbBookmarks.map((b) => {
    if (b.PastPaper) {
      return {
        id: b.id,
        category: "paper",
        categoryBadge: "Past Paper",
        unit: b.PastPaper.title,
        title: b.PastPaper.title,
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        description: "Marked for final revision before exams.",
        link: `/past-papers/${b.PastPaper.id}`,
        linkLabel: "View Paper",
      };
    }

    if (b.Question) {
      const isCode = b.Question.text.toLowerCase().includes("c++") || b.Question.text.toLowerCase().includes("virtual");
      return {
        id: b.id,
        category: isCode ? "snippet" : "mcq",
        categoryBadge: isCode ? "C++ Snippet" : "Important MCQ",
        unit: b.Question.Chapter?.title || "Unit 1: Basics of IT",
        title: b.Question.text,
        date: new Date(b.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        description: b.Question.explanation || "Saved from practice test.",
        link: "/practice",
        linkLabel: isCode ? "View Topic" : "Practice MCQ",
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
      description: "Saved lesson content.",
      link: "/learn",
      linkLabel: "View Notes",
    };
  });

  // If fewer than 3, add high-yield prototype bookmarks for visual richness
  if (formattedBookmarks.length === 0) {
    formattedBookmarks.push(
      {
        id: "demo-1",
        category: "snippet",
        categoryBadge: "C++ Snippet",
        unit: "Unit 3: Object-Oriented Programming",
        title: "Dynamic Polymorphism using Virtual Functions & Base Pointers",
        date: "Sep 14, 2026",
        description: "Essential syntax example for runtime method dispatch.",
        link: "/learn",
        linkLabel: "View Topic",
      },
      {
        id: "demo-2",
        category: "mcq",
        categoryBadge: "Important MCQ",
        unit: "Unit 2: Computer Networks",
        title: "Difference between TCP and UDP transmission protocols",
        date: "Sep 10, 2026",
        description: "Frequently asked board exam objective question.",
        link: "/practice",
        linkLabel: "Practice MCQ",
      },
      {
        id: "demo-3",
        category: "paper",
        categoryBadge: "Past Paper",
        unit: "BISE Lahore Annual 2024",
        title: "Subjective Question 5: File Handling Operations in C++",
        date: "Aug 29, 2026",
        description: "Marked for final revision before exams.",
        link: "/past-papers",
        linkLabel: "View Paper",
      }
    );
  }

  return <BookmarkClient initialBookmarks={formattedBookmarks} />;
}
