export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "home", href: "/" },
  { label: "notes", href: "/notes" },
  { label: "about", href: "/about" },
];
