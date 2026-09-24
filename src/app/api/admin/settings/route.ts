import { NextRequest, NextResponse } from "next/server";
import {
  getReportSignatorySettings,
  updateReportSignatorySettings,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getReportSignatorySettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch signatory settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateReportSignatorySettings({
      signatoryName: body.signatoryName,
      signatoryTitle: body.signatoryTitle,
      signatureUrl: body.signatureUrl,
      stampText: body.stampText,
      showSignature: body.showSignature,
    });

    return NextResponse.json({
      success: true,
      message: "Signatory settings saved successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update signatory settings" },
      { status: 500 }
    );
  }
}
