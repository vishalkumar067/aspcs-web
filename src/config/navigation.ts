export interface NavChild { label: string; href: string; }
export interface NavItem  { label: string; href: string; children?: NavChild[]; }

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },

  {
    label: "About", href: "/about",
    children: [
      { label: "About ASPCS",         href: "/about" },
      { label: "Principal's Message",  href: "/about#principal" },
      { label: "Vision & Mission",     href: "/about#vision" },
      { label: "Infrastructure",       href: "/about#infrastructure" },
    ],
  },

  {
    label: "Academics", href: "/academics",
    children: [
      { label: "Primary (Class I – V)",           href: "/academics#primary" },
      { label: "Middle School (Class VI – VIII)",  href: "/academics#middle" },
      { label: "Secondary (Class IX – X)",         href: "/academics#secondary" },
      { label: "Senior Secondary (Class XI – XII)", href: "/academics#senior" },
      { label: "Subjects & Syllabus",              href: "/academics#syllabus" },
    ],
  },

  {
    label: "School Life", href: "/gallery",
    children: [
      { label: "Photo Gallery",  href: "/gallery" },
      { label: "Events",         href: "/events" },
      { label: "Notice Board",   href: "/notices" },
    ],
  },

  {
    label: "Admissions", href: "/admissions",
    children: [
      { label: "Admission Process",          href: "/admissions" },
      { label: "Class XI Admissions (New)",  href: "/admissions#class11" },
      { label: "Fee Structure",              href: "/admissions#fees" },
      { label: "Apply Online",               href: "/admissions#apply" },
    ],
  },

  {
    label: "More", href: "#",
    children: [
      { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
      { label: "Careers at ASPCS",     href: "/careers" },
      { label: "TC Verification",      href: "/#tc-verify" },
      { label: "Contact Us",           href: "/contact" },
    ],
  },
];

// Footer
export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home",                href: "/" },
    { label: "About ASPCS",         href: "/about" },
    { label: "Admissions 2026–27",  href: "/admissions" },
    { label: "Class XI Admissions", href: "/admissions#class11" },
    { label: "Notice Board",        href: "/notices" },
    { label: "Events",              href: "/events" },
    { label: "Contact Us",          href: "/contact" },
  ],
  academics: [
    { label: "Primary (Class I–V)",              href: "/academics#primary" },
    { label: "Middle School (Class VI–VIII)",    href: "/academics#middle" },
    { label: "Secondary (Class IX–X)",           href: "/academics#secondary" },
    { label: "Senior Secondary (Class XI–XII)",  href: "/academics#senior" },
    { label: "Science Stream (XI–XII)",          href: "/academics#science" },
    { label: "Commerce Stream (XI–XII)",         href: "/academics#commerce" },
    { label: "Subjects & Syllabus",              href: "/academics#syllabus" },
  ],
  policies: [
    { label: "Mandatory Disclosure",  href: "/mandatory-disclosure" },
    { label: "Privacy Policy",        href: "/mandatory-disclosure#privacy" },
    { label: "TC Verification",       href: "/#tc-verify" },
    { label: "Careers",               href: "/careers" },
    { label: "Admin Login",           href: "/admin/login" },
  ],
};
