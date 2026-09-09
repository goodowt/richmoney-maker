import Link from "next/link";
import type { ReactNode } from "react";
import { tools, type Tool } from "@/lib/tools";

export function CalculatorShell({
  activeSlug,
  children,
}: {
  activeSlug: Tool["slug"];
  children: ReactNode;
}) {
  const active = tools.find((tool) => tool.slug === activeSlug)!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav aria-label="계산기 이동" className="mb-8 flex flex-wrap gap-2">
        {tools.map((tool) => {
          const isActive = tool.slug === activeSlug;
          return (
            <Link
              key={tool.slug}
              href={`/calculators/${tool.slug}`}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
              }`}
            >
              {tool.emoji} {tool.shortTitle}
            </Link>
          );
        })}
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{active.title}</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">{active.description}</p>
      </header>

      {children}
    </div>
  );
}
