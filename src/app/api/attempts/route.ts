import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { evaluateSubjectiveAnswer } from "@/lib/evaluator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      testTitle,
      answers = {},
      typedAnswers = {},
      questionIds = [],
      timeSpentSeconds = 0,
      violationsCount = 0,
      violationLogs = [],
      terminationReason = null,
    } = body;

    let student = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!student) {
      student = await prisma.user.findFirst();
    }

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Determine list of question IDs in this specific test
    const allAnswerKeys = new Set([...Object.keys(answers), ...Object.keys(typedAnswers)]);
    const orderedQIds: string[] =
      Array.isArray(questionIds) && questionIds.length > 0
        ? questionIds
        : Array.from(allAnswerKeys);

    if (orderedQIds.length === 0) {
      return NextResponse.json({ error: "No questions provided" }, { status: 400 });
    }

    // Fetch questions from DB with their options
    const dbQuestions = await prisma.question.findMany({
      where: { id: { in: orderedQIds } },
      include: {
        QuestionOption: true,
      },
    });

    const questionMap = new Map(dbQuestions.map((q) => [q.id, q]));

    // Find or create test record
    const titleToUse = testTitle || "Class 11 Mock Examination";
    let test = await prisma.test.findFirst({
      where: { title: titleToUse },
    });

    if (!test) {
      test = await prisma.test.create({
        data: {
          id: `test-${randomUUID().slice(0, 12)}`,
          title: titleToUse,
          type: "PRACTICE",
          totalMarks: orderedQIds.length,
          userId: student.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const attemptId = `att-${Date.now()}-${randomUUID().slice(0, 6)}`;

    // Evaluate answers
    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const answerRecords: Array<{
      id: string;
      attemptId: string;
      questionId: string;
      selectedOptionId: string | null;
      typedAnswer: string | null;
      marksObtained: number;
      isCorrect: boolean;
      aiFeedback: any;
      updatedAt: Date;
    }> = [];

    for (const qId of orderedQIds) {
      const q = questionMap.get(qId);
      const isSubjective = q?.type === "SHORT" || q?.type === "LONG";
      const defaultMarks = isSubjective ? (q?.type === "LONG" ? 5 : 2) : 1;
      const questionMarks = q?.marks || defaultMarks;
      maxScore += questionMarks;

      if (isSubjective) {
        // Evaluate Subjective (Short or Long) Question
        const studentText = typedAnswers[qId] ? String(typedAnswers[qId]).trim() : null;

        if (!studentText) {
          unattemptedCount++;
          const blankEval = evaluateSubjectiveAnswer("", q?.answer, q?.explanation, questionMarks, q?.type as any);
          answerRecords.push({
            id: `aa-${randomUUID().slice(0, 12)}`,
            attemptId,
            questionId: qId,
            selectedOptionId: null,
            typedAnswer: null,
            marksObtained: 0,
            isCorrect: false,
            aiFeedback: blankEval,
            updatedAt: new Date(),
          });
          continue;
        }

        const evalResult = evaluateSubjectiveAnswer(
          studentText,
          q?.answer,
          q?.explanation,
          questionMarks,
          q?.type as any
        );

        totalScore += evalResult.marksObtained;
        if (evalResult.isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
          // Log mistake if performance is subpar
          try {
            const existingMistake = await prisma.mistake.findFirst({
              where: { userId: student.id, questionId: qId },
            });
            if (!existingMistake) {
              await prisma.mistake.create({
                data: {
                  id: `mst-${randomUUID().slice(0, 12)}`,
                  userId: student.id,
                  questionId: qId,
                  attemptId,
                  notes: `Score: ${evalResult.marksObtained}/${questionMarks}. Missing: ${evalResult.missingConcepts.slice(0, 2).join(", ")}.`,
                  resolved: false,
                  updatedAt: new Date(),
                },
              });
            } else {
              await prisma.mistake.update({
                where: { id: existingMistake.id },
                data: {
                  resolved: false,
                  attemptId,
                  notes: `Score: ${evalResult.marksObtained}/${questionMarks}. Missing: ${evalResult.missingConcepts.slice(0, 2).join(", ")}.`,
                  updatedAt: new Date(),
                },
              });
            }
          } catch (mErr) {
            console.warn("Failed to record mistake for subjective question:", mErr);
          }
        }

        answerRecords.push({
          id: `aa-${randomUUID().slice(0, 12)}`,
          attemptId,
          questionId: qId,
          selectedOptionId: null,
          typedAnswer: studentText,
          marksObtained: evalResult.marksObtained,
          isCorrect: evalResult.isCorrect,
          aiFeedback: evalResult,
          updatedAt: new Date(),
        });
      } else {
        // Evaluate MCQ Question
        const selectedOptionId = answers[qId] || null;

        if (!selectedOptionId) {
          unattemptedCount++;
          answerRecords.push({
            id: `aa-${randomUUID().slice(0, 12)}`,
            attemptId,
            questionId: qId,
            selectedOptionId: null,
            typedAnswer: null,
            marksObtained: 0,
            isCorrect: false,
            aiFeedback: null,
            updatedAt: new Date(),
          });
          continue;
        }

        const selectedOption = q?.QuestionOption.find((o) => o.id === selectedOptionId);
        const isCorrect = selectedOption?.isCorrect === true;

        if (isCorrect) {
          correctCount++;
          totalScore += questionMarks;
        } else {
          incorrectCount++;
          // Log mistake for student's practice list
          try {
            const existingMistake = await prisma.mistake.findFirst({
              where: { userId: student.id, questionId: qId },
            });
            if (!existingMistake) {
              await prisma.mistake.create({
                data: {
                  id: `mst-${randomUUID().slice(0, 12)}`,
                  userId: student.id,
                  questionId: qId,
                  attemptId,
                  notes: `Selected: "${selectedOption?.text || "Unknown"}".`,
                  resolved: false,
                  updatedAt: new Date(),
                },
              });
            } else {
              await prisma.mistake.update({
                where: { id: existingMistake.id },
                data: {
                  resolved: false,
                  attemptId,
                  notes: `Selected: "${selectedOption?.text || "Unknown"}".`,
                  updatedAt: new Date(),
                },
              });
            }
          } catch (mErr) {
            console.warn("Failed to record mistake:", mErr);
          }
        }

        answerRecords.push({
          id: `aa-${randomUUID().slice(0, 12)}`,
          attemptId,
          questionId: qId,
          selectedOptionId,
          typedAnswer: null,
          marksObtained: isCorrect ? questionMarks : 0,
          isCorrect,
          aiFeedback: null,
          updatedAt: new Date(),
        });
      }
    }

    // Attach proctoring metadata to the first answer record so reports can display it
    const proctoringData = {
      violationsCount: Number(violationsCount) || 0,
      violationLogs: Array.isArray(violationLogs) ? violationLogs : [],
      terminationReason: terminationReason || null,
      integrityStatus:
        Number(violationsCount) === 0
          ? "CLEAN"
          : Number(violationsCount) >= 3
          ? "DISQUALIFIED_AUTO_SUBMIT"
          : "WARNINGS_RECORDED",
    };

    if (answerRecords.length > 0) {
      const existingFb = answerRecords[0].aiFeedback || {};
      answerRecords[0].aiFeedback = {
        ...existingFb,
        proctoring: proctoringData,
      };
    }

    // Create Attempt in DB
    const attempt = await prisma.attempt.create({
      data: {
        id: attemptId,
        testId: test.id,
        userId: student.id,
        status: violationsCount >= 3 ? "ABANDONED" : "COMPLETED",
        score: totalScore,
        maxScore: maxScore || orderedQIds.length,
        startedAt: new Date(Date.now() - (timeSpentSeconds || 60) * 1000),
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Save AttemptAnswers
    for (const rec of answerRecords) {
      await prisma.attemptAnswer.create({
        data: rec,
      });
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: totalScore,
      maxScore: maxScore || orderedQIds.length,
      correctCount,
      incorrectCount,
      unattemptedCount,
      totalQuestions: orderedQIds.length,
    });
  } catch (error) {
    console.error("Failed to record attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
