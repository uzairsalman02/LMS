"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";
import { DEFAULT_SVG_SIGNATURE } from "@/lib/settings";

interface SignatorySettings {
  signatoryName: string;
  signatoryTitle: string;
  signatureUrl: string;
  stampText: string;
  showSignature: boolean;
}

// Preset vector SVG signatures for instant 1-click selection
const PRESET_SIGNATURES = [
  {
    id: "preset-1",
    name: "Executive Script (Dr. M. Arshad)",
    dataUrl: DEFAULT_SVG_SIGNATURE,
  },
  {
    id: "preset-2",
    name: "Formal Controller Cursive",
    dataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
  <path d="M 20 35 Q 40 10 55 40 T 80 30 Q 100 15 115 45 T 145 35 Q 165 20 185 30 T 215 40" 
        fill="none" stroke="#0f172a" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M 30 50 Q 100 45 220 38" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M 60 20 L 70 52" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
</svg>
`),
  },
  {
    id: "preset-3",
    name: "Dynamic Academic Loop",
    dataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
  <path d="M 25 45 C 40 15, 60 10, 75 35 C 90 60, 110 20, 130 30 C 150 40, 160 15, 180 35 C 195 50, 210 25, 225 35" 
        fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M 40 30 L 90 30" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="225" cy="35" r="2" fill="#0f172a"/>
</svg>
`),
  },
];

export function AdminSettingsClient({
  initialSettings,
}: {
  initialSettings: SignatorySettings;
}) {
  const [settings, setSettings] = useState<SignatorySettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<"draw" | "presets" | "upload">("draw");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Canvas drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnOnCanvas, setHasDrawnOnCanvas] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawnOnCanvas(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a"; // Deep ink slate
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnOnCanvas(false);
  };

  const applyDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasDrawnOnCanvas) {
      showToast("Please draw on the canvas before applying.", "error");
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    setSettings((prev) => ({ ...prev, signatureUrl: dataUrl }));
    showToast("Drawn signature captured for preview!");
  };

  // Image upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (PNG, JPG, SVG).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSettings((prev) => ({ ...prev, signatureUrl: reader.result as string }));
        showToast("Signature image uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Settings to Backend API
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (data.success) {
        showToast("Signatory information & signature saved successfully!");
      } else {
        showToast(data.error || "Failed to save settings.", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Failed to connect to server.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const rightRail = (
    <div className="space-y-4">
      {/* Quick Navigation Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100/60 shadow-2xs space-y-3">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
          <i className="fa-solid fa-file-invoice text-emerald-600"></i>
          <span>Report Links</span>
        </h4>
        <div className="space-y-2 text-xs">
          <Link
            href="/progress-report"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium border border-slate-200/60 group"
          >
            <span>Current Test Report</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70 group-hover:opacity-100"></i>
          </Link>
          <Link
            href="/progress-report?type=overall"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium border border-slate-200/60 group"
          >
            <span>Cumulative Transcript</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70 group-hover:opacity-100"></i>
          </Link>
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/30 border border-indigo-100 p-4 rounded-3xl shadow-xs text-xs space-y-2">
        <div className="flex items-center space-x-2 text-indigo-700 font-bold">
          <i className="fa-solid fa-circle-info"></i>
          <span>Punjab Board Printing Guidelines</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          The signatory name, designation, and signature configured here will automatically print across both single-test report cards and overall transcripts.
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-user-shield"
      rightPanelLabel="Admin Tools"
      pageTitle="Admin Settings"
      badge="Administration"
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-8 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border animate-bounce ${
            toast.type === "success"
              ? "bg-slate-900 text-white border-slate-700"
              : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          <i
            className={`fa-solid ${
              toast.type === "success" ? "fa-circle-check text-emerald-400" : "fa-triangle-exclamation text-rose-300"
            }`}
          ></i>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="space-y-6 max-w-4xl mx-auto w-full pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
              <Link href="/settings" className="hover:text-slate-700">Settings</Link>
              <span>/</span>
              <span className="text-slate-700">Admin Controls</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Examination & Report Signatory Authority
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure the signing officer&apos;s name, official title, and digital signature for all printed student report cards.
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 self-start sm:self-auto">
            <i className="fa-solid fa-shield-halved text-[10px]"></i>
            <span>Admin Active</span>
          </span>
        </div>

        {/* 1. Signing Person Credentials Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center space-x-2">
              <i className="fa-solid fa-id-badge text-emerald-600"></i>
              <span>Signing Person Credentials</span>
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-700">
              <span>Show Signature on Report</span>
              <input
                type="checkbox"
                checked={settings.showSignature}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, showSignature: e.target.checked }))
                }
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Signing Officer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={settings.signatoryName}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, signatoryName: e.target.value }))
                }
                placeholder="e.g. Dr. M. Arshad or Prof. Tariq"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs transition"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                This exact name will be printed above the designation line on student reports.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Designation / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={settings.signatoryTitle}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, signatoryTitle: e.target.value }))
                }
                placeholder="e.g. Head of Computer Science Examination Cell"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs transition"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Departmental designation or examination authority title.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Departmental Seal / Verification Text
              </label>
              <input
                type="text"
                value={settings.stampText}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, stampText: e.target.value }))
                }
                placeholder="e.g. OFFICIAL EXAMINATION CELL • PUNJAB BOARD STANDARD"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs transition"
              />
            </div>
          </div>
        </div>

        {/* 2. Interactive Signature Studio */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center space-x-2">
                <i className="fa-solid fa-signature text-emerald-600"></i>
                <span>Digital Signature Studio</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Draw, pick an executive preset, or upload an authentic signature.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("draw")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === "draw" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <i className="fa-solid fa-pen-nib text-[10px]"></i>
                <span>Draw</span>
              </button>
              <button
                onClick={() => setActiveTab("presets")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === "presets" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                <span>Presets</span>
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === "upload" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <i className="fa-solid fa-arrow-up-from-bracket text-[10px]"></i>
                <span>Upload Image</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Draw on Canvas */}
          {activeTab === "draw" && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-2 bg-slate-50 flex flex-col items-center justify-center relative">
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="bg-white rounded-xl shadow-xs cursor-crosshair touch-none w-full max-w-[450px]"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  Draw your official signature using mouse, trackpad, or touchscreen.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                  <span>Clear Pad</span>
                </button>

                <button
                  type="button"
                  onClick={applyDrawnSignature}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Use This Drawn Signature</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Realistic Cursive Presets */}
          {activeTab === "presets" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_SIGNATURES.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setSettings((prev) => ({ ...prev, signatureUrl: preset.dataUrl }));
                    showToast(`Selected "${preset.name}"!`);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col items-center justify-between space-y-2 bg-white hover:border-emerald-400 hover:shadow-xs ${
                    settings.signatureUrl === preset.dataUrl
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="h-14 flex items-center justify-center w-full px-2 bg-slate-50 rounded-xl">
                    <img
                      src={preset.dataUrl}
                      alt={preset.name}
                      className="max-h-12 object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 text-center">
                    {preset.name}
                  </span>
                  {settings.signatureUrl === preset.dataUrl && (
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">
                      ✓ Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Upload Image */}
          {activeTab === "upload" && (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-emerald-600 flex items-center justify-center mx-auto text-xl border border-slate-200">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">
                  Upload Scanned Signature Image
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Supports PNG with transparent background, SVG, or JPG (Max 2MB).
                </p>
              </div>
              <div>
                <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5">
                  <i className="fa-solid fa-folder-open"></i>
                  <span>Browse Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 3. Live A4 Report Preview Card */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <i className="fa-solid fa-eye text-indigo-600"></i>
              <span>Live Report Card Signature Preview</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              Exact replica of printout bottom section
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-4 items-end">
            {/* Left Remarks Simulation */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-[10px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Evaluator Remarks:</span>
              <p className="text-[10px] leading-relaxed">
                Demonstrated high academic accuracy aligned with Punjab Board standards. Ready for board exams.
              </p>
            </div>

            {/* Right Signature Simulation */}
            <div className="flex flex-col justify-end text-right space-y-1">
              {settings.showSignature && settings.signatureUrl ? (
                <div className="flex justify-end mb-0.5">
                  <img
                    src={settings.signatureUrl}
                    alt="Authorized Signature"
                    className="h-10 max-w-[140px] object-contain"
                  />
                </div>
              ) : (
                <div className="h-6 text-[10px] text-slate-300 italic flex items-center justify-end">
                  (Signature hidden)
                </div>
              )}
              <div className="w-44 ml-auto border-b-2 border-slate-900 pb-0.5 font-bold text-slate-900 text-xs">
                {settings.signatoryName || "Signatory Name"}
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                {settings.signatoryTitle || "Official Designation"}
              </span>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk text-xs"></i>
                <span>Save Signatory Settings</span>
              </>
            )}
          </button>

          <Link
            href="/progress-report"
            target="_blank"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3.5 px-5 rounded-2xl text-sm transition shadow-xs flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-xs text-emerald-600"></i>
            <span>Preview Live Student Report</span>
          </Link>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-slate-400 font-medium">
          <p>&copy; 2026 Uzair Salman • EduStack LMS Administration</p>
        </footer>
      </div>
    </StudentShell>
  );
}
