import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  href: string;
  selected: boolean;
  notifications?: number;
};

const SidebarItem = ({ href, icon, selected, title, notifications }: Props) => {
  return (
    <li className="cursor-pointer ">
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between group rounded-lg hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-slate-700",
          selected ? "bg-slate-800 border-slate-700" : ""
        )}
      >
        <div className="flex items-center gap-3 transition-all p-3 cursor-pointer w-full">
          <div
            className={cn(
              "transition-colors duration-200",
              selected
                ? "text-blue-400"
                : "text-slate-400 group-hover:text-white"
            )}
          >
            {icon}
          </div>
          <span
            className={cn(
              "font-medium text-[#ddd6d6] transition-all duration-200 truncate flex-1",
              selected ? "text-white" : "text-[#ddd6d6] group-hover:text-white"
            )}
          >
            {title}
          </span>
          {notifications && notifications > 0 && (
            <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-2">
              {notifications > 99 ? "99+" : notifications}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
