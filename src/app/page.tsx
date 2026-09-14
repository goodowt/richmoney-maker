import Link from "next/link";
import { tools, siteConfig } from "@/lib/tools";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <section className="relative mb-14 overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-10 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-soft blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-accent-soft blur-3xl"
        />

        <span className="relative inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary-hover">
          <span aria-hidden>✨</span> 급여·노동 계산기 8종
        </span>

        <h1 className="relative mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          내 월급, 퇴직금, 보험료
          <br className="sm:hidden" /> 정확히 얼마 남을까?
        </h1>
        <p className="relative mx-auto mt-4 max-w-2xl text-muted">
          {siteConfig.description}. 공제 내역을 항목별로 투명하게 펼쳐 보여주고,
          계산기 간 결과를 서로 연결해 한 번에 확인할 수 있습니다.
        </p>

        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/calculators/salary"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            💰 연봉 실수령액 계산하기
          </Link>
          <Link
            href="/calculators/severance"
            className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary-hover"
          >
            📦 퇴직금 계산하기
          </Link>
        </div>
      </section>

      <section aria-label="계산기 목록" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/calculators/${tool.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary-soft/60"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-xl"
              aria-hidden
            >
              {tool.emoji}
            </span>
            <h2 className="mt-4 text-base font-semibold group-hover:text-primary-hover">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {tool.description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
