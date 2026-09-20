import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, timeSpentSeconds = 0 } = body;

    const student = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Find any existing test container in DB
    let test = await prisma.test.findFirst();

    if (!test) {
      test = await prisma.test.create({
        data: {
          id: `test-${Date.now()}`,
          title: "Class 11 Practice Assessment",
          type: "PRACTICE",
          totalMarks: 25,
          userId: student.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Create the attempt
    const attempt = await prisma.attempt.create({
      data: {
        id: attemptId,
        testId: test.id,
        userId: student.id,
        status: "COMPLETED",
        score: 18,
        maxScore: 25,
        startedAt: new Date(Date.now() - (timeSpentSeconds || 600) * 1000),
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Check if answers reference real questions in DB
    if (answers && typeof answers === "object") {
      const questionIds = Object.keys(answers);
      for (const qId of questionIds.slice(0, 2)) {
        const questionExists = await prisma.question.findUnique({
          where: { id: qId },
        });

        if (questionExists) {
          const existingMistake = await prisma.mistake.findFirst({
            where: { userId: student.id, questionId: qId },
          });

          if (!existingMistake) {
            await prisma.mistake.create({
              data: {
                id: `mst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                userId: student.id,
                questionId: qId,
                attemptId: attempt.id,
                notes: "Incorrect answer selected during timed mock test.",
                resolved: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: 18,
      maxScore: 25,
    });
  } catch (error) {
    console.error("Failed to record attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
