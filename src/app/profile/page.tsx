import React from "react";
import { prisma } from "@/lib/prisma";
import { ProfileClient, UserProfileData } from "./ProfileClient";

export default async function ProfilePage() {
  let profileData: UserProfileData = {
    name: "Uzair Salman",
    dob: "14-Aug-2005",
    email: "uzair.salman@edustack.pk",
    phone: "+92 300 1234567",
    institution: "Govt. College of Science, Lahore",
    rollNumber: "CS-2024-8841",
  };

  try {
    const user = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    });
    if (user) {
      profileData = {
        name: user.name || profileData.name,
        dob: "14-Aug-2005",
        email: user.email || profileData.email,
        phone: "+92 300 1234567",
        institution: "Govt. College of Science, Lahore",
        rollNumber: "CS-2024-8841",
      };
    }
  } catch (err) {
    console.warn("Using fallback profile data:", err);
  }

  return <ProfileClient initialProfile={profileData} />;
}
