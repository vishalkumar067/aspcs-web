import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about/story" },
      { label: "Vision & Mission", href: "/about/vision" },
      { label: "Faculty", href: "/about/faculty" },
      { label: "Infrastructure", href: "/about/infrastructure" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Programs", href: "/academics/programs" },
      { label: "Curriculum", href: "/academics/curriculum" },
      { label: "Calendar", href: "/academics/calendar" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Notices", href: "/notices" },
  { label: "Events", href: "/events" },
  { label: "Admissions", href: "/admissions" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Admissions", href: "/admissions" },
    { label: "Gallery", href: "/gallery" },
    { label: "Notices", href: "/notices" },
    { label: "Contact", href: "/contact" },
  ],
  academics: [
    { label: "Nursery & KG", href: "/academics/programs#early" },
    { label: "Primary (I–V)", href: "/academics/programs#primary" },
    { label: "Middle (VI–VIII)", href: "/academics/programs#middle" },
    { label: "Secondary (IX–X)", href: "/academics/programs#secondary" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Fee Structure", href: "/admissions/fees" },
    { label: "Grievance", href: "/grievance" },
  ],
};
