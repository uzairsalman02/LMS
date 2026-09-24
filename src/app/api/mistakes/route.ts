import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { mistakeId, resolved } = body;

    if (!mistakeId) {
      return NextResponse.json({ error: "mistakeId is required" }, { status: 400 });
    }

    const updated = await prisma.mistake.update({
      where: { id: mistakeId },
      data: {
        resolved: Boolean(resolved),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, mistake: updated });
  } catch (error) {
    console.error("Error updating mistake:", error);
    return NextResponse.json({ error: "Failed to update mistake" }, { status: 500 });
  }
}
