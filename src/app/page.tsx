import Link from "next/link";
import { tools, siteConfig } from "@/lib/tools";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          내 월급, 퇴직금, 보험료
          <br className="sm:hidden" /> 정확히 얼마 남을까?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-black/60 dark:text-white/60">
          {siteConfig.description}. 공제 내역을 항목별로 투명하게 펼쳐 보여주고,
          계산기 간 결과를 서로 연결해 한 번에 확인할 수 있습니다.
        </p>
      </section>

      <section aria-label="계산기 목록" className="grid gap-4 sm:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/calculators/${tool.slug}`}
            className="group flex flex-col rounded-xl border border-black/10 p-6 transition-colors hover:border-black/30 hover:bg-black/[.02] dark:border-white/10 dark:hover:border-white/30 dark:hover:bg-white/[.03]"
          >
            <span className="text-3xl" aria-hidden>
              {tool.emoji}
            </span>
            <h2 className="mt-3 text-lg font-semibold group-hover:underline">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              {tool.description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
