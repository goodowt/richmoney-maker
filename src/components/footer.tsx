import Link from "next/link";
import { siteConfig } from "@/lib/tools";

const footerLinks = [
  { href: "/about", label: "소개" },
  { href: "/contact", label: "문의" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-black/60 dark:text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name} ({siteConfig.domain})
        </p>
        <nav aria-label="정책 페이지" className="flex flex-wrap gap-x-4 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
