import React from "react";
import { prisma } from "@/lib/prisma";
import { ConfigureTestClient, ChapterOption } from "./ConfigureTestClient";

export const revalidate = 0;

export default async function ConfigureTestPage() {
  const dbChapters = await prisma.chapter.findMany({
    where: { Subject: { classId: "class-11" } },
    orderBy: { chapterNumber: "asc" },
  });

  const chapters: ChapterOption[] = dbChapters.map((c) => ({
    id: c.id,
    chapterNumber: c.chapterNumber,
    title: c.title,
  }));

  return <ConfigureTestClient chapters={chapters} />;
}
