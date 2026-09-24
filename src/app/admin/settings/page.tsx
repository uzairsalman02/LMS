import React from "react";
import { getReportSignatorySettings } from "@/lib/settings";
import { AdminSettingsClient } from "./AdminSettingsClient";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getReportSignatorySettings();

  return <AdminSettingsClient initialSettings={settings} />;
}
