import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const student = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    }) || await prisma.user.findFirst();

    if (!student) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: student.id },
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

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, lessonId, pastPaperId } = body;

    const student = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    }) || await prisma.user.findFirst();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if bookmark already exists
    const existing = await prisma.bookmark.findFirst({
      where: {
        userId: student.id,
        questionId: questionId || null,
        lessonId: lessonId || null,
        pastPaperId: pastPaperId || null,
      },
    });

    if (existing) {
      // Toggle off / remove
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ action: "removed", id: existing.id });
    }

    // Create new bookmark
    const created = await prisma.bookmark.create({
      data: {
        id: `bm-${randomUUID().slice(0, 8)}`,
        userId: student.id,
        questionId: questionId || null,
        lessonId: lessonId || null,
        pastPaperId: pastPaperId || null,
      },
    });

    return NextResponse.json({ action: "added", bookmark: created });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Bookmark ID is required" }, { status: 400 });
    }

    await prisma.bookmark.deleteMany({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
