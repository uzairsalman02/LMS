import { prisma } from "@/lib/prisma";

export interface ReportSignatorySettings {
  signatoryName: string;
  signatoryTitle: string;
  signatureUrl: string;
  stampText: string;
  showSignature: boolean;
}

// Realistic stylish digital cursive signature in pure vector SVG
export const DEFAULT_SVG_SIGNATURE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
  <path d="M 25 50 C 35 22, 50 15, 62 25 C 72 32, 68 55, 85 45 C 98 38, 105 26, 120 30 C 132 34, 138 48, 152 42 C 168 35, 180 20, 192 26 C 202 32, 198 52, 220 40" 
        fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 38 34 L 85 34" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
  <path d="M 45 56 C 85 52, 150 50, 225 44" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="228" cy="42" r="1.5" fill="#0f172a"/>
</svg>
`);

export const DEFAULT_SIGNATORY_SETTINGS: ReportSignatorySettings = {
  signatoryName: "Dr. M. Arshad",
  signatoryTitle: "Head of Computer Science Examination Cell",
  signatureUrl: DEFAULT_SVG_SIGNATURE,
  stampText: "OFFICIAL EXAMINATION CELL • PUNJAB BOARD STANDARD",
  showSignature: true,
};

export async function getReportSignatorySettings(): Promise<ReportSignatorySettings> {
  try {
    const records = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            "report_signatory_name",
            "report_signatory_title",
            "report_signatory_signature",
            "report_signatory_stamp",
            "report_show_signature",
          ],
        },
      },
    });

    const map = new Map(records.map((r) => [r.key, r.value]));

    const signatureUrl =
      map.get("report_signatory_signature") || DEFAULT_SIGNATORY_SETTINGS.signatureUrl;

    return {
      signatoryName: map.get("report_signatory_name") || DEFAULT_SIGNATORY_SETTINGS.signatoryName,
      signatoryTitle: map.get("report_signatory_title") || DEFAULT_SIGNATORY_SETTINGS.signatoryTitle,
      signatureUrl,
      stampText: map.get("report_signatory_stamp") || DEFAULT_SIGNATORY_SETTINGS.stampText,
      showSignature: map.has("report_show_signature")
        ? map.get("report_show_signature") === "true"
        : DEFAULT_SIGNATORY_SETTINGS.showSignature,
    };
  } catch (err) {
    console.error("Error loading signatory settings from database:", err);
    return DEFAULT_SIGNATORY_SETTINGS;
  }
}

export async function updateReportSignatorySettings(
  settings: Partial<ReportSignatorySettings>
): Promise<ReportSignatorySettings> {
  const updates: Array<{ key: string; value: string; description: string }> = [];

  if (settings.signatoryName !== undefined) {
    updates.push({
      key: "report_signatory_name",
      value: settings.signatoryName,
      description: "Signing person name for exam and progress reports",
    });
  }

  if (settings.signatoryTitle !== undefined) {
    updates.push({
      key: "report_signatory_title",
      value: settings.signatoryTitle,
      description: "Official title / designation of the signing authority",
    });
  }

  if (settings.signatureUrl !== undefined) {
    updates.push({
      key: "report_signatory_signature",
      value: settings.signatureUrl,
      description: "Base64 or image URL for official signature on report",
    });
  }

  if (settings.stampText !== undefined) {
    updates.push({
      key: "report_signatory_stamp",
      value: settings.stampText,
      description: "Text on official department stamp / seal",
    });
  }

  if (settings.showSignature !== undefined) {
    updates.push({
      key: "report_show_signature",
      value: String(settings.showSignature),
      description: "Toggle whether to display digital signature on reports",
    });
  }

  for (const item of updates) {
    await prisma.systemSetting.upsert({
      where: { key: item.key },
      update: { value: item.value, description: item.description },
      create: { key: item.key, value: item.value, description: item.description },
    });
  }

  return getReportSignatorySettings();
}
