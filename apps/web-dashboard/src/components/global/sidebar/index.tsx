"use client";
import { getWorkSpaces } from "@/actions/workspace";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { count } from "console";
import {
  PlusCircle,
  Search,
  Loader,
  Menu,
  Settings,
  Upload,
  Home,
} from "lucide-react";
import SidebarItem from "./sidebar-item";
import WorkspacePlaceholder from "./workspace-placeholder";
import Link from "next/link";
import { MENU_ITEMS } from "./constants";
import { usePathname } from "next/navigation";

type Props = {
  activeWorkspaceId: string;
};

const Sidebar = ({ activeWorkspaceId }: Props) => {
  // WIP: add the upgrade button to the sidebar

  const menuItems = MENU_ITEMS();
  const pathName = usePathname();

  const SidebarSection = (
    <div className="h-full bg-slate-900 w-64 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Navigation</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.title}
            href={item.href}
            icon={item.icon}
            title={item.title}
            selected={pathName === item.href}
          />
        ))}
      </div>

      {/* Footer (optional) */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 font-medium">Active Workspace</p>
          <p className="text-sm text-white truncate mt-1">
            {activeWorkspaceId}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="full">
      {/* //INFOBAR */}
      {/* <InfoBar /> */}
      {/* //Sheet mobile and desktop */}
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button
              variant={"ghost"}
              className="mt-[2px] text-white hover:bg-slate-800 border-slate-700"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="p-0 w-fit h-full bg-slate-900 border-slate-700"
          >
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;
