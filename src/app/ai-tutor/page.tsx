import React from "react";
import { prisma } from "@/lib/prisma";
import { AITutorClient, ChatMessageItem } from "./AITutorClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Syllabus Tutor - Computer Science (11th Standard)",
  description: "Instant answers and board exam preparation powered by the official Punjab Board curriculum database.",
};

export default async function AITutorPage() {
  const student =
    (await prisma.user.findFirst({
      where: { role: "STUDENT" },
    })) || (await prisma.user.findFirst());

  const studentName = student?.name || "Uzair Salman";

  // Fetch persistent conversation history from database
  let initialMessages: ChatMessageItem[] = [];

  if (student) {
    const conversation = await prisma.aIConversation.findFirst({
      where: { userId: student.id },
      include: {
        AIMessage: {
          orderBy: { createdAt: "asc" },
          take: 60,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (conversation && conversation.AIMessage.length > 0) {
      initialMessages = conversation.AIMessage.map((m) => ({
        id: m.id,
        role: m.sender === "USER" ? "user" : "ai",
        text: m.content,
        createdAt: m.createdAt.toISOString(),
      }));
    }
  }

  // If no chat history yet, start with welcoming prompt
  if (initialMessages.length === 0) {
    initialMessages = [
      {
        id: "welcome-1",
        role: "ai",
        text: `Assalam-o-Alaikum ${studentName}! I am your AI Computer Science Tutor, powered directly by your Punjab Board textbook syllabus.\n\nI can explain concepts, clarify definitions, share real-world analogies, and provide board exam presentation tips for Units 1 to 10.\n\nTry selecting any topic on the right or type your question below.`,
      },
    ];
  }

  // Fetch chapters for syllabus guide
  const chapters = await prisma.chapter.findMany({
    where: { subjectId: "subj-cs-11" },
    orderBy: { chapterNumber: "asc" },
    select: {
      id: true,
      chapterNumber: true,
      title: true,
      _count: {
        select: { Topic: true, Question: true },
      },
    },
  });

  return (
    <AITutorClient
      studentName={studentName}
      initialMessages={initialMessages}
      chapters={chapters}
      subjectId="subj-cs-11"
    />
  );
}
