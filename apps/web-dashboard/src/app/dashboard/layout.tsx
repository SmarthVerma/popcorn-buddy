"use client";
import AdminNavbar from "@/components/global/header";
import Sidebar from "@/components/global/sidebar/index";
import { redirect } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex  min-h-screen w-screen">
      <Sidebar activeWorkspaceId={""} />
      <div className="w-full justify-start   overflow-y-scroll overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default layout;
