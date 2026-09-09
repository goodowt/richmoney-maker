import Link from "next/link";
import { tools, siteConfig } from "@/lib/tools";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden>🧮</span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav aria-label="주요 계산기" className="flex flex-wrap items-center gap-1 text-sm">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/calculators/${tool.slug}`}
              className="rounded-md px-3 py-2 font-medium text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {tool.shortTitle}
            </Link>
          ))}
          <Link
            href="/about"
            className="rounded-md px-3 py-2 font-medium text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
