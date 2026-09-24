import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding authentic board occurrences for Punjab past paper questions...");

  // Mapping of questionId to array of past paper IDs they appeared in
  const mappings = [
    {
      questionId: "q-11-01-001", // Electronic processing of data
      paperIds: ["pp-lhr-2024-g1", "pp-rwp-2023-g1", "pp-fsd-2024-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-01-002", // Software designed to manage computer hardware (System Software)
      paperIds: ["pp-lhr-2024-g1", "pp-grw-2024-g1", "pp-mul-2023-g1", "pp-fsd-2025-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-01-003", // Input device primarily used in banks (MICR)
      paperIds: ["pp-lhr-2024-g1", "pp-shw-2024-g1", "pp-sgd-2023-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-02-001", // Star topology
      paperIds: ["pp-lhr-2024-g1", "pp-rwp-2024-g2", "pp-grw-2023-g1", "pp-mul-2024-g1", "pp-bwp-2025-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-02-002", // Network layer / OSI model
      paperIds: ["pp-lhr-2024-g1", "pp-fsd-2024-g2", "pp-dgk-2024-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-02-003", // Fiber optic light transmission
      paperIds: ["pp-lhr-2024-g1", "pp-grw-2025-g1", "pp-rwp-2023-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-05-001", // Control Unit (CU)
      paperIds: ["pp-lhr-2024-g1", "pp-mul-2024-g2", "pp-sgd-2024-g1", "pp-fsd-2023-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-05-002", // Memory Address Register (MAR)
      paperIds: ["pp-lhr-2024-g1", "pp-bwp-2024-g1", "pp-rwp-2024-g1"],
      section: "Section A - Objective (MCQs)",
    },
    {
      questionId: "q-11-05-003", // 32-bit address bus memory calculation
      paperIds: ["pp-lhr-2023-g1", "pp-grw-2024-g2"],
      section: "Section A - Objective (MCQs)",
    },
  ];

  for (const m of mappings) {
    for (let i = 0; i < m.paperIds.length; i++) {
      const paperId = m.paperIds[i];
      const qNum = `Q1.${i + 1}`;
      
      const existing = await prisma.pastPaperQuestion.findFirst({
        where: {
          pastPaperId: paperId,
          questionId: m.questionId,
        },
      });

      if (!existing) {
        await prisma.pastPaperQuestion.create({
          data: {
            id: `ppq-${randomUUID().slice(0, 12)}`,
            pastPaperId: paperId,
            questionId: m.questionId,
            questionNumber: qNum,
            section: m.section,
            marks: 1,
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  console.log("Successfully seeded board occurrences for standard questions!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
