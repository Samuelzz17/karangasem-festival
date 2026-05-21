"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/history", label: "History" },
  { href: "/rundown", label: "Rundown" },
  { href: "/merchandise", label: "Merchandise" },
  { href: "/gallery", label: "Gallery" },
  { href: "/admin", label: "Admin" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Karangasem Festival Home">
        <span className="brand-mark">KF</span>
        <span className="brand-text">
          <strong>Karangasem Festival</strong>
          <small>Culture, music, and sunset stories</small>
        </span>
      </Link>

      <nav className="nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link className="cart-chip" href="/merchandise" aria-label="Buka merchandise">
        <span>Merch</span>
        <strong>Shop</strong>
      </Link>
    </header>
  );
}
