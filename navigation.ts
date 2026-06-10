import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About", href: "/about",
    children: [
      { label: "Our Story",            href: "/about#story" },
      { label: "Vision & Mission",     href: "/about#vision" },
      { label: "Faculty",              href: "/about#faculty" },
      { label: "Infrastructure",       href: "/about#infrastructure" },
      { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
    ],
  },
  {
    label: "Academics", href: "/academics",
    children: [
      { label: "Programs",   href: "/academics#programs" },
      { label: "Curriculum", href: "/academics#curriculum" },
      { label: "Calendar",   href: "/academics#calendar" },
    ],
  },
  { label: "Gallery",    href: "/gallery" },
  { label: "Notices",    href: "/notices" },
  { label: "Events",     href: "/events" },
  { label: "Admissions", href: "/admissions" },
  {
    label: "More", href: "#",
    children: [
      { label: "Careers",              href: "/careers" },
      { label: "TC Request",           href: "/tc-request" },
      { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
      { label: "Contact",              href: "/contact" },
    ],
  },
  { label: "Admin",      href: "/admin/login" },
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "About Us",             href: "/about" },
    { label: "Academics",            href: "/academics" },
    { label: "Admissions",           href: "/admissions" },
    { label: "Gallery",              href: "/gallery" },
    { label: "Notices",              href: "/notices" },
    { label: "Events",               href: "/events" },
    { label: "Careers",              href: "/careers" },
    { label: "TC Request",           href: "/tc-request" },
  ],
  academics: [
    { label: "Nursery & KG",     href: "/academics#programs" },
    { label: "Primary (I-V)",    href: "/academics#programs" },
    { label: "Middle (VI-VIII)", href: "/academics#programs" },
    { label: "Secondary (IX-X)", href: "/academics#programs" },
  ],
  policies: [
    { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
    { label: "Privacy Policy",       href: "/privacy" },
    { label: "Terms of Use",         href: "/terms" },
    { label: "Grievance",            href: "/grievance" },
  ],
};
