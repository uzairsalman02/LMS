import React from "react";
import { prisma } from "@/lib/prisma";
import { PastPapersClient, PastPaperItem, BoardItem } from "./PastPapersClient";

export const revalidate = 0;

export default async function PastPapersPage() {
  const [dbPapers, dbBoards] = await Promise.all([
    prisma.pastPaper.findMany({
      include: {
        Board: true,
      },
      orderBy: [
        { year: "desc" },
        { title: "asc" },
      ],
    }),
    prisma.board.findMany({
      where: {
        id: { not: "board-punjab-bise" },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const papers: PastPaperItem[] = dbPapers.map((p) => ({
    id: p.id,
    title: p.title,
    year: p.year,
    session: p.session,
    paperType: p.paperType,
    fileKey: p.fileKey,
    fileUrl: p.fileUrl,
    totalMarks: p.totalMarks,
    durationMinutes: p.durationMinutes,
    verificationStatus: p.verificationStatus,
    boardName: p.Board?.name || "Punjab Board",
    boardCode: p.Board?.code || "BISE",
    boardDescription: p.Board?.description || "",
  }));

  const boards: BoardItem[] = dbBoards.map((b) => ({
    id: b.id,
    name: b.name,
    code: b.code,
    description: b.description || "",
  }));

  return <PastPapersClient papers={papers} boards={boards} />;
}
