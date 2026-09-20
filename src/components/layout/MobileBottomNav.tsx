"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBottomNavProps {
  onToggleRightPanel?: () => void;
  rightPanelIcon?: string;
  rightPanelLabel?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onToggleRightPanel,
  rightPanelIcon = "fa-user",
  rightPanelLabel = "Profile",
}) => {
  const pathname = usePathname();

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return `flex flex-col items-center ${
      isActive ? "text-emerald-600 font-bold" : "text-slate-400 hover:text-slate-600"
    }`;
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40 flex justify-around py-3 px-2 shadow-lg">
      <Link href="/dashboard" title="Overview" className={getLinkClasses("/dashboard")}>
        <i className="fa-solid fa-house text-lg"></i>
        <span className="text-[10px] font-medium mt-1">Overview</span>
      </Link>
      <Link href="/learn" title="Learn" className={getLinkClasses("/learn")}>
        <i className="fa-solid fa-book-open text-lg"></i>
        <span className="text-[10px] font-medium mt-1">Learn</span>
      </Link>
      <Link href="/past-papers" title="Past Papers" className={getLinkClasses("/past-papers")}>
        <i className="fa-solid fa-file-lines text-lg"></i>
        <span className="text-[10px] font-medium mt-1">Papers</span>
      </Link>
      <button
        onClick={onToggleRightPanel}
        id="mobile-profile-tab"
        title={rightPanelLabel}
        className="flex flex-col items-center text-slate-400 hover:text-slate-600 cursor-pointer"
      >
        <i className={`fa-solid ${rightPanelIcon} text-lg`}></i>
        <span className="text-[10px] font-medium mt-1">{rightPanelLabel}</span>
      </button>
    </nav>
  );
};
