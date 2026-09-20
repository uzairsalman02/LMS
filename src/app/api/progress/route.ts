import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const student = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const totalTopics = await prisma.topic.count({
      where: { Chapter: { Subject: { classId: "class-11" } } },
    });

    const progressRecords = await prisma.progress.findMany({
      where: { userId: student.id },
      include: { Topic: true },
    });

    const completedTopicIds = progressRecords
      .filter((p) => p.completed)
      .map((p) => p.topicId);

    const completedCount = completedTopicIds.length;
    const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return NextResponse.json({
      studentId: student.id,
      studentName: student.name,
      totalTopics,
      completedCount,
      remainingCount: Math.max(0, totalTopics - completedCount),
      percentage,
      completedTopicIds,
    });
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicId, completed = true, score = 100 } = body;

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    const student = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if progress entry already exists
    const existing = await prisma.progress.findUnique({
      where: {
        userId_topicId: {
          userId: student.id,
          topicId,
        },
      },
    });

    let record;
    if (existing) {
      record = await prisma.progress.update({
        where: { id: existing.id },
        data: {
          completed,
          score: completed ? score : 0,
          lastAccessedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      record = await prisma.progress.create({
        data: {
          id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          userId: student.id,
          topicId,
          completed,
          score: completed ? score : 0,
          lastAccessedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // Return updated totals
    const totalTopics = await prisma.topic.count({
      where: { Chapter: { Subject: { classId: "class-11" } } },
    });

    const completedCount = await prisma.progress.count({
      where: { userId: student.id, completed: true },
    });

    const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return NextResponse.json({
      success: true,
      record,
      totalTopics,
      completedCount,
      remainingCount: Math.max(0, totalTopics - completedCount),
      percentage,
    });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
