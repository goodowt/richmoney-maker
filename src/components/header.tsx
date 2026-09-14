import Link from "next/link";
import { tools, siteConfig } from "@/lib/tools";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-lg"
            aria-hidden
          >
            🧮
          </span>
          <span className="text-lg font-bold">{siteConfig.name}</span>
        </Link>
        <nav
          aria-label="주요 계산기"
          className="flex w-full items-center gap-1 overflow-x-auto text-sm [-ms-overflow-style:none] [scrollbar-width:none] sm:w-auto sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/calculators/${tool.slug}`}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 font-medium text-foreground/70 transition-colors hover:bg-primary-soft hover:text-primary-hover"
            >
              {tool.shortTitle}
            </Link>
          ))}
          <Link
            href="/about"
            className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 font-medium text-foreground/70 transition-colors hover:bg-primary-soft hover:text-primary-hover"
          >
            소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
