import { Calendar, HomeIcon, LucideIcon, Settings, User } from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  disabled?: boolean;
  children?: NavItemWithoutIcon[];
}

export interface NavItemWithoutIcon {
  title: string;
  href: string;
  disabled?: boolean;
}

export const dashboardNav: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    children: [],
    icon: HomeIcon,
  },

  {
    title: "Planning",
    icon: Calendar,

    children: [
      {
        title: "Sessions",
        href: "/dashboard/sessions",
      },
      {
        title: "Venues",
        href: "/dashboard/venues",
      },
    ],
  },

  {
    title: "Attendees",
    icon: User,
    children: [
      {
        title: "users",
        href: "#",
        disabled: true,
      },
    ],
  },

  {
    title: "Settings",
    icon: Settings,
    children: [
      {
        title: "Edit Profile",
        href: "/",
        disabled: true,
      },
    ],
  },
];
