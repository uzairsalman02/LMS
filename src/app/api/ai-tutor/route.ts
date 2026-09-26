import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { generateLocalTutorResponse } from "@/lib/tutor-engine";

export async function GET(req: NextRequest) {
  try {
    const student =
      (await prisma.user.findFirst({
        where: { role: "STUDENT" },
      })) || (await prisma.user.findFirst());

    if (!student) {
      return NextResponse.json({ messages: [] });
    }

    // Find or create conversation
    let conversation = await prisma.aIConversation.findFirst({
      where: { userId: student.id },
      include: {
        AIMessage: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!conversation) {
      return NextResponse.json({ messages: [] });
    }

    const messages = conversation.AIMessage.map((m) => ({
      id: m.id,
      role: m.sender === "USER" ? "user" : "ai",
      text: m.content,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({
      conversationId: conversation.id,
      messages,
    });
  } catch (error) {
    console.error("Error fetching AI conversation:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, subjectId = "subj-cs-11" } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const student =
      (await prisma.user.findFirst({
        where: { role: "STUDENT" },
      })) || (await prisma.user.findFirst());

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 1. Generate Local Syllabus Answer (Zero External API / 100% Local DB RAG)
    const tutorResult = await generateLocalTutorResponse(message, subjectId);

    // 2. Persist in Database (AIConversation & AIMessage)
    let conversation = await prisma.aIConversation.findFirst({
      where: { userId: student.id },
      orderBy: { updatedAt: "desc" },
    });

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          id: `conv-${randomUUID().slice(0, 8)}`,
          userId: student.id,
          title: "Computer Science Revision Chat",
          updatedAt: new Date(),
        },
      });
    }

    // Save User Message
    await prisma.aIMessage.create({
      data: {
        id: `msg-${randomUUID().slice(0, 8)}`,
        conversationId: conversation.id,
        sender: "USER",
        content: message.trim(),
      },
    });

    // Save AI Tutor Reply
    const savedAiMsg = await prisma.aIMessage.create({
      data: {
        id: `msg-${randomUUID().slice(0, 8)}`,
        conversationId: conversation.id,
        sender: "ASSISTANT",
        content: tutorResult.reply,
      },
    });

    // Update conversation timestamp
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      reply: tutorResult.reply,
      sourceType: tutorResult.sourceType,
      conversationId: conversation.id,
      messageId: savedAiMsg.id,
    });
  } catch (error) {
    console.error("Error processing AI tutor message:", error);
    return NextResponse.json({ error: "Failed to generate tutor response" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const student =
      (await prisma.user.findFirst({
        where: { role: "STUDENT" },
      })) || (await prisma.user.findFirst());

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.aIConversation.deleteMany({
      where: { userId: student.id },
    });

    return NextResponse.json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    return NextResponse.json({ error: "Failed to clear chat history" }, { status: 500 });
  }
}
