import {
  Home,
  Bell,
  CreditCard,
  Settings,
  Library,
  Upload,
} from "lucide-react";

const ICONS: { [key: string]: React.ReactNode } = {
  Home: <Home color="#ddd6d6" />,
  MyLibrary: <Library color="#ddd6d6" />,
  Notifications: <Bell color="#ddd6d6" />,
  Billing: <CreditCard color="#ddd6d6" />,
  Settings: <Settings color="#ddd6d6" />,
  Upload: <Upload color="#ddd6d6" />,
};

export const MENU_ITEMS = (): {
  title: string;
  href: string; 
  icon: React.ReactNode;
}[] => [
  {
    title: "Home",
    href: `/dashboard/home`,
    icon: ICONS.Home,
  },
  {
    title: "Upload",
    href: `/dashboard/upload`,
    icon: ICONS.Upload,
  },
  {
    title: "My Library",
    href: `/dashboard/my-library`,
    icon: ICONS.MyLibrary,
  },
  {
    title: "Notifications",
    href: `/dashboard/notifications`,
    icon: ICONS.Notifications,
  },
];
