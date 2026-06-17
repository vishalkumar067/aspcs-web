export interface NavChild { label: string; href: string; }
export interface NavItem  { label: string; href: string; children?: NavChild[]; }

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },

  {
    label: "About", href: "/about",
    children: [
      { label: "About ASPCS",          href: "/about" },
      { label: "Chairman's Message",   href: "/about/chairman" },
      { label: "Principal's Message",  href: "/about#principal" },
      { label: "Vision & Mission",     href: "/about#vision" },
      { label: "Infrastructure",       href: "/about#infrastructure" },
    ],
  },

  {
    label: "Academics", href: "/academics",
    children: [
      { label: "Primary (Class I – V)",            href: "/academics#primary" },
      { label: "Middle School (Class VI – VIII)",   href: "/academics#middle" },
      { label: "Secondary (Class IX – X)",          href: "/academics#secondary" },
      { label: "Senior Secondary (Class XI – XII)", href: "/academics#senior" },
    ],
  },

  { label: "Gallery",     href: "/gallery" },
  { label: "Notices",     href: "/notices" },
  { label: "Events",      href: "/events" },
  { label: "Admissions",  href: "/admissions" },
  { label: "Disclosure",  href: "/mandatory-disclosure" },
  { label: "Contact",     href: "/contact" },
];

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home",                        href: "/" },
    { label: "About ASPCS",                 href: "/about" },
    { label: "Admissions 2026–27",          href: "/admissions" },
    { label: "Class XI Admissions (New!)",  href: "/admissions#class11" },
    { label: "Notice Board",                href: "/notices" },
    { label: "Events",                      href: "/events" },
    { label: "Careers",                     href: "/careers" },
    { label: "Contact Us",                  href: "/contact" },
  ],
  academics: [
    { label: "Primary (Class I – V)",             href: "/academics#primary" },
    { label: "Middle School (Class VI – VIII)",   href: "/academics#middle" },
    { label: "Secondary (Class IX – X)",          href: "/academics#secondary" },
    { label: "Senior Secondary (Class XI – XII)", href: "/academics#senior" },
    { label: "Science Stream (Class XI–XII)",     href: "/academics#science" },
    { label: "Commerce Stream (Class XI–XII)",    href: "/academics#commerce" },
    { label: "Subjects & Syllabus",               href: "/academics#syllabus" },
  ],
  policies: [
    { label: "Mandatory Disclosure",  href: "/mandatory-disclosure" },
    { label: "TC Verification",       href: "/#tc-verify" },
    { label: "Privacy Policy",        href: "/mandatory-disclosure#privacy" },
    { label: "Admin Login",           href: "/admin/login" },
  ],
};
