"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/layout/StudentShell";

export interface UserProfileData {
  name: string;
  dob: string;
  email: string;
  phone: string;
  institution: string;
  rollNumber: string;
}

interface ProfileClientProps {
  initialProfile: UserProfileData;
}

export function ProfileClient({ initialProfile }: ProfileClientProps) {
  const [profile, setProfile] = useState<UserProfileData>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfileData>(initialProfile);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
    showNotice("Profile updated successfully!");
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const rightRail = (
    <div className="space-y-4">
      {/* Student Identity Card */}
      <div className="bg-white p-4 rounded-3xl flex flex-col items-center text-center relative group">
        <div className="relative mb-2 mt-0.5">
          <div
            title="Uzair Salman - Active Student"
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-md cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden text-slate-600 font-bold text-lg">
              US
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <h3 className="font-bold text-slate-900 text-sm">{profile.name}</h3>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">11th Computer Science • 2026</p>
      </div>

      {/* Achievements Unlocked Box */}
      <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-purple-100/80 p-3.5 rounded-3xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs shadow-md shadow-purple-500/30">
              🏆
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Achievements</h4>
              <p className="text-[10px] text-purple-700 font-semibold">3 Badges Unlocked</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-white/90 border border-purple-100/80 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm mb-1">
              💻
            </div>
            <span className="text-[9px] font-bold text-slate-800 leading-tight">Coding Ace</span>
          </div>
          <div className="bg-white/90 border border-purple-100/80 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm mb-1">
              💡
            </div>
            <span className="text-[9px] font-bold text-slate-800 leading-tight">Problem Solver</span>
          </div>
          <div className="bg-white/90 border border-purple-100/80 p-2.5 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm mb-1">
              🚀
            </div>
            <span className="text-[9px] font-bold text-slate-800 leading-tight">Fast Coder</span>
          </div>
        </div>
      </div>

      {/* Upcoming Deadline Box */}
      <div className="bg-gradient-to-br from-rose-50/60 to-pink-50/30 border border-rose-100 p-3.5 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs mb-1">
          <i className="fa-solid fa-clock"></i>
          <span>Upcoming Deadline</span>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          OOP Practical Lab Assignment due tomorrow at 11:59 PM.
        </p>
      </div>
    </div>
  );

  return (
    <StudentShell
      rightPanel={rightRail}
      rightPanelIcon="fa-user"
      rightPanelLabel="Profile & Schedule"
      pageTitle="Computer Science"
      badge="11th Standard"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 bg-white min-h-screen no-scrollbar flex flex-col justify-between">
        <div className="space-y-6">
          {/* Notification Toast */}
          {notification && (
            <div className="fixed top-20 right-8 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg z-50 animate-bounce">
              <i className="fa-solid fa-check mr-2"></i> {notification}
            </div>
          )}

          {/* Page Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
                <span>Account</span>
                <span>/</span>
                <span className="text-emerald-600">Student Profile</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Student Account & Performance Profile
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-3.5 py-2 rounded-xl">
                Verified Student Active
              </span>
            </div>
          </div>

          {/* 4 Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Syllabus Covered % */}
            <div className="bg-gradient-to-br from-slate-50 via-teal-50/30 to-white p-5 rounded-3xl border border-teal-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block mb-1">
                  Syllabus Covered
                </span>
                <h3 className="text-2xl font-bold text-teal-700">75%</h3>
                <span className="text-[11px] text-teal-600 font-medium">12 of 16 chapters</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-book-open"></i>
              </div>
            </div>

            {/* Card 2: Exam Readiness */}
            <div className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white p-5 rounded-3xl border border-indigo-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Exam Readiness
                </span>
                <h3 className="text-2xl font-bold text-indigo-700">78%</h3>
                <span className="text-[11px] text-indigo-600 font-medium">Board simulation index</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
            </div>

            {/* Card 3: Active Bookmarks */}
            <div className="bg-gradient-to-br from-slate-50 via-amber-50/30 to-white p-5 rounded-3xl border border-amber-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                  Active Bookmarks
                </span>
                <h3 className="text-2xl font-bold text-amber-700">18</h3>
                <span className="text-[11px] text-amber-600 font-medium">Saved topics & MCQs</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-bookmark"></i>
              </div>
            </div>

            {/* Card 4: Level */}
            <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-white p-5 rounded-3xl border border-purple-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                  Student Level
                </span>
                <h3 className="text-2xl font-bold text-purple-700">Level 4</h3>
                <span className="text-[11px] text-purple-600 font-medium">Tested out of 5 levels</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg shadow-inner">
                <i className="fa-solid fa-layer-group"></i>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Credentials & Achievements */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                    Personal & Academic Credentials
                  </h3>
                  {isEditing ? (
                    <div className="space-x-2">
                      <button
                        onClick={handleSave}
                        className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-xl transition cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditData(profile);
                          setIsEditing(false);
                        }}
                        className="text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl transition cursor-pointer"
                    >
                      <i className="fa-solid fa-pen mr-1"></i> Edit Info
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Full Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      />
                    ) : (
                      <span className="font-bold text-slate-800 text-sm">{profile.name}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Date of Birth</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.dob}
                        onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                        className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      />
                    ) : (
                      <span className="font-bold text-slate-800 text-sm">{profile.dob}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Email Address</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      />
                    ) : (
                      <span className="font-bold text-slate-800 text-sm">{profile.email}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">Contact Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      />
                    ) : (
                      <span className="font-bold text-slate-800 text-sm">{profile.phone}</span>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                      Institution / Campus
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.institution}
                        onChange={(e) => setEditData({ ...editData, institution: e.target.value })}
                        className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      />
                    ) : (
                      <span className="font-bold text-slate-800 text-sm">{profile.institution}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements Showcase */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200/80 pb-3">
                  Unlocked Achievements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2 shadow-2xs">
                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-base">
                      <i className="fa-solid fa-crown"></i>
                    </div>
                    <span className="font-bold text-slate-800 block">C++ Master</span>
                    <span className="text-[10px] text-slate-400 block">Unit 3 Completed</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2 shadow-2xs">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-base">
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <span className="font-bold text-slate-800 block">Quick Solver</span>
                    <span className="text-[10px] text-slate-400 block">Under 15 mins test</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2 shadow-2xs">
                    <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-base">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <span className="font-bold text-slate-800 block">Exam Pro</span>
                    <span className="text-[10px] text-slate-400 block">75 Marks Simulation</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2 shadow-2xs">
                    <div className="w-10 h-10 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-base">
                      <i className="fa-solid fa-fire"></i>
                    </div>
                    <span className="font-bold text-slate-800 block">12-Day Streak</span>
                    <span className="text-[10px] text-slate-400 block">Consistent login</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Security & ID Card */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200/80 pb-3">
                  Security & Access
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">Two-Factor Auth</span>
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">Password Status</span>
                    <span className="text-slate-500">Updated 2mo ago</span>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 rounded-xl transition shadow-2xs cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Printable Student Card Widget */}
              <div className="bg-gradient-to-br from-emerald-50/60 to-purple-50/30 p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm text-center">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Printable Student Card
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Official
                  </span>
                </div>

                {/* Mini ID Card Preview Box */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-left space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-base shadow-sm">
                      US
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs">{profile.name}</h5>
                      <p className="text-[10px] text-slate-500 font-medium">11th Standard • CS</p>
                      <p className="text-[9px] text-emerald-600 font-mono font-bold mt-0.5">
                        ID: {profile.rollNumber}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Valid: 2026-2027</span>
                    <span className="font-mono font-bold text-slate-700">||| | | ||||</span>
                  </div>
                </div>

                <Link
                  href="/student-card"
                  target="_blank"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>Print Student Card</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Center Copyright Footer */}
        <footer className="py-6 text-center text-xs text-slate-400 font-medium mt-8">
          <p>&copy; 2026 Uzair Salman. All rights reserved. Designed with precision for 11th Standard Computer Science.</p>
        </footer>
      </main>

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Update Password</h3>
            <div className="space-y-2 text-xs">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border border-slate-200 rounded-xl p-2.5"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-slate-200 rounded-xl p-2.5"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full border border-slate-200 rounded-xl p-2.5"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  showNotice("Password updated successfully!");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentShell>
  );
}
