import React from "react";
import { prisma } from "@/lib/prisma";
import { PastPapersClient, PastPaperItem } from "./PastPapersClient";

export const revalidate = 0;

export default async function PastPapersPage() {
  const dbPapers = await prisma.pastPaper.findMany({
    include: {
      Board: true,
    },
    orderBy: [
      { year: "desc" },
      { title: "asc" }
    ],
  });

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
  }));

  return <PastPapersClient papers={papers} />;
}
