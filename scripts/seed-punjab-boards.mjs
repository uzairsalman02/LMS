import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const punjabBoards = [
  {
    id: "board-bise-lhr",
    name: "BISE Lahore",
    code: "BISE_LHR",
    description: "Serves Lahore, Kasur, Sheikhupura, and Nankana Sahib.",
    city: "Lahore",
    short: "LHR",
  },
  {
    id: "board-bise-rwp",
    name: "BISE Rawalpindi",
    code: "BISE_RWP",
    description: "Serves Rawalpindi, Attock, Chakwal, Jhelum, and Murree.",
    city: "Rawalpindi",
    short: "RWP",
  },
  {
    id: "board-bise-fsd",
    name: "BISE Faisalabad",
    code: "BISE_FSD",
    description: "Serves Faisalabad, Jhang, Toba Tek Singh, and Chiniot.",
    city: "Faisalabad",
    short: "FSD",
  },
  {
    id: "board-bise-grw",
    name: "BISE Gujranwala",
    code: "BISE_GRW",
    description: "Serves Gujranwala, Gujrat, Sialkot, Narowal, Hafizabad, and Mandi Bahauddin.",
    city: "Gujranwala",
    short: "GRW",
  },
  {
    id: "board-bise-mul",
    name: "BISE Multan",
    code: "BISE_MUL",
    description: "Serves Multan, Khanewal, Vehari, and Lodhran.",
    city: "Multan",
    short: "MUL",
  },
  {
    id: "board-bise-bwp",
    name: "BISE Bahawalpur",
    code: "BISE_BWP",
    description: "Serves the Bahawalpur division.",
    city: "Bahawalpur",
    short: "BWP",
  },
  {
    id: "board-bise-dgk",
    name: "BISE D.G. Khan",
    code: "BISE_DGK",
    description: "Serves Dera Ghazi Khan and surrounding districts.",
    city: "D.G. Khan",
    short: "DGK",
  },
  {
    id: "board-bise-shw",
    name: "BISE Sahiwal",
    code: "BISE_SHW",
    description: "Serves Sahiwal, Okara, and Pakpattan.",
    city: "Sahiwal",
    short: "SHW",
  },
  {
    id: "board-bise-sgd",
    name: "BISE Sargodha",
    code: "BISE_SGD",
    description: "Serves the Sargodha division.",
    city: "Sargodha",
    short: "SGD",
  },
];

const samplePapers = [
  // --- 1. BISE LAHORE ---
  {
    id: "pp-lhr-2025-g1",
    boardId: "board-bise-lhr",
    title: "BISE Lahore Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-lhr-2025-g2",
    boardId: "board-bise-lhr",
    title: "BISE Lahore Computer Science Class 11 (Annual 2025 - Group 2)",
    year: 2025,
    session: "Annual",
    paperType: "Group 2",
  },
  {
    id: "pp-lhr-2024-g1",
    boardId: "board-bise-lhr",
    title: "BISE Lahore Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-lhr-2024-g2",
    boardId: "board-bise-lhr",
    title: "BISE Lahore Computer Science Class 11 (Annual 2024 - Group 2)",
    year: 2024,
    session: "Annual",
    paperType: "Group 2",
  },
  {
    id: "pp-lhr-2023-g1",
    boardId: "board-bise-lhr",
    title: "BISE Lahore Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 2. BISE RAWALPINDI ---
  {
    id: "pp-rwp-2025-g1",
    boardId: "board-bise-rwp",
    title: "BISE Rawalpindi Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-rwp-2024-g1",
    boardId: "board-bise-rwp",
    title: "BISE Rawalpindi Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-rwp-2024-g2",
    boardId: "board-bise-rwp",
    title: "BISE Rawalpindi Computer Science Class 11 (Annual 2024 - Group 2)",
    year: 2024,
    session: "Annual",
    paperType: "Group 2",
  },
  {
    id: "pp-rwp-2023-g1",
    boardId: "board-bise-rwp",
    title: "BISE Rawalpindi Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 3. BISE FAISALABAD ---
  {
    id: "pp-fsd-2025-g1",
    boardId: "board-bise-fsd",
    title: "BISE Faisalabad Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-fsd-2024-g1",
    boardId: "board-bise-fsd",
    title: "BISE Faisalabad Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-fsd-2024-g2",
    boardId: "board-bise-fsd",
    title: "BISE Faisalabad Computer Science Class 11 (Annual 2024 - Group 2)",
    year: 2024,
    session: "Annual",
    paperType: "Group 2",
  },
  {
    id: "pp-fsd-2023-g1",
    boardId: "board-bise-fsd",
    title: "BISE Faisalabad Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 4. BISE GUJRANWALA ---
  {
    id: "pp-grw-2025-g1",
    boardId: "board-bise-grw",
    title: "BISE Gujranwala Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-grw-2024-g1",
    boardId: "board-bise-grw",
    title: "BISE Gujranwala Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-grw-2024-g2",
    boardId: "board-bise-grw",
    title: "BISE Gujranwala Computer Science Class 11 (Annual 2024 - Group 2)",
    year: 2024,
    session: "Annual",
    paperType: "Group 2",
  },
  {
    id: "pp-grw-2023-g1",
    boardId: "board-bise-grw",
    title: "BISE Gujranwala Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 5. BISE MULTAN ---
  {
    id: "pp-mul-2025-g1",
    boardId: "board-bise-mul",
    title: "BISE Multan Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-mul-2024-g1",
    boardId: "board-bise-mul",
    title: "BISE Multan Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-mul-2024-g2",
    boardId: "board-bise-mul",
    title: "BISE Multan Computer Science Class 11 (Annual 2024 - Group 2)",
    year: 2024,
    session: "Annual",
    paperType: "Group 2",
  },
  {
    id: "pp-mul-2023-g1",
    boardId: "board-bise-mul",
    title: "BISE Multan Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 6. BISE BAHAWALPUR ---
  {
    id: "pp-bwp-2025-g1",
    boardId: "board-bise-bwp",
    title: "BISE Bahawalpur Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-bwp-2024-g1",
    boardId: "board-bise-bwp",
    title: "BISE Bahawalpur Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-bwp-2023-g1",
    boardId: "board-bise-bwp",
    title: "BISE Bahawalpur Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 7. BISE D.G. KHAN ---
  {
    id: "pp-dgk-2025-g1",
    boardId: "board-bise-dgk",
    title: "BISE D.G. Khan Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-dgk-2024-g1",
    boardId: "board-bise-dgk",
    title: "BISE D.G. Khan Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-dgk-2023-g1",
    boardId: "board-bise-dgk",
    title: "BISE D.G. Khan Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 8. BISE SAHIWAL ---
  {
    id: "pp-shw-2025-g1",
    boardId: "board-bise-shw",
    title: "BISE Sahiwal Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-shw-2024-g1",
    boardId: "board-bise-shw",
    title: "BISE Sahiwal Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-shw-2023-g1",
    boardId: "board-bise-shw",
    title: "BISE Sahiwal Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },

  // --- 9. BISE SARGODHA ---
  {
    id: "pp-sgd-2025-g1",
    boardId: "board-bise-sgd",
    title: "BISE Sargodha Computer Science Class 11 (Annual 2025 - Group 1)",
    year: 2025,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-sgd-2024-g1",
    boardId: "board-bise-sgd",
    title: "BISE Sargodha Computer Science Class 11 (Annual 2024 - Group 1)",
    year: 2024,
    session: "Annual",
    paperType: "Group 1",
  },
  {
    id: "pp-sgd-2023-g1",
    boardId: "board-bise-sgd",
    title: "BISE Sargodha Computer Science Class 11 (Annual 2023 - Group 1)",
    year: 2023,
    session: "Annual",
    paperType: "Group 1",
  },
];

async function main() {
  console.log("Seeding 9 Punjab BISE Boards...");
  const now = new Date();

  // 1. Seed the 9 Punjab BISE Boards
  for (const b of punjabBoards) {
    await prisma.board.upsert({
      where: { id: b.id },
      update: {
        name: b.name,
        code: b.code,
        description: b.description,
        updatedAt: now,
      },
      create: {
        id: b.id,
        name: b.name,
        code: b.code,
        description: b.description,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  console.log("Successfully upserted 9 Punjab BISE Boards into Board table!");

  // 2. Fetch sample questions for linking
  const questions = await prisma.question.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  // 3. Seed past papers for each board
  console.log(`Seeding ${samplePapers.length} past papers for all 9 Punjab boards...`);
  for (const p of samplePapers) {
    await prisma.pastPaper.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        year: p.year,
        session: p.session,
        paperType: p.paperType,
        totalMarks: 75,
        durationMinutes: 150,
        verificationStatus: "VERIFIED",
        boardId: p.boardId,
        updatedAt: now,
      },
      create: {
        id: p.id,
        title: p.title,
        year: p.year,
        session: p.session,
        paperType: p.paperType,
        fileKey: `past-papers/${p.id}.pdf`,
        fileUrl: `/uploads/past-papers/${p.id}.pdf`,
        totalMarks: 75,
        durationMinutes: 150,
        published: true,
        verificationStatus: "VERIFIED",
        boardId: p.boardId,
        classId: "class-11",
        updatedAt: now,
      },
    });

    // Attach questions to paper
    for (let i = 0; i < Math.min(5, questions.length); i++) {
      const q = questions[i];
      const ppqId = `${p.id}-q${i + 1}`;
      await prisma.pastPaperQuestion.upsert({
        where: {
          pastPaperId_questionId: {
            pastPaperId: p.id,
            questionId: q.id,
          },
        },
        update: {
          updatedAt: now,
        },
        create: {
          id: ppqId,
          pastPaperId: p.id,
          questionId: q.id,
          questionNumber: q.type === "MCQ" ? `Q1.${i + 1}` : `Q2.(${i + 1})`,
          section: q.type === "MCQ" ? "Section A - Objective (MCQs)" : "Section B - Subjective (Short Questions)",
          marks: q.marks || 1,
          updatedAt: now,
        },
      });
    }
  }

  // Update existing legacy papers (cmtzrn8...) to point to board-bise-lhr
  await prisma.pastPaper.updateMany({
    where: {
      id: { startsWith: "cmtzrn" },
    },
    data: {
      boardId: "board-bise-lhr",
      updatedAt: now,
    },
  });

  console.log("Completed! All 9 Punjab BISE Boards and their past papers are ready.");
}

main()
  .catch((e) => {
    console.error("Error seeding Punjab boards:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
