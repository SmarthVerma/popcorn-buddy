"use client";
import Sidebar from "@/components/global/sidebar/index";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex  min-h-screen w-screen">
      <Sidebar activeWorkspaceId={""} />
      <div className="w-full justify-start overflow-y-scroll overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default layout;
