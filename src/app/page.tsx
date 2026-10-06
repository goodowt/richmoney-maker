import type { Metadata } from "next";
import Link from "next/link";
import { tools, siteConfig } from "@/lib/tools";
import {
  POPULAR_SALARY_AMOUNTS_MAN,
  formatManLabel,
  salaryAmountPath,
} from "@/lib/calculators/salary-amounts";

// 예전 티스토리 주소(/?page=4 등)가 홈과 같은 내용으로 열려 중복 페이지로 잡히지 않도록 표준 주소를 지정합니다.
export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
};

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
          <span aria-hidden>✨</span> 계산기 {tools.length}종
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

      <section aria-labelledby="salary-amounts-heading" className="mt-14">
        <h2 id="salary-amounts-heading" className="text-xl font-bold">
          연봉별 실수령액 바로 보기
        </h2>
        <p className="mt-2 text-sm text-muted">
          내 연봉을 누르면 월 실수령액과 공제 내역을 바로 확인할 수 있어요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {POPULAR_SALARY_AMOUNTS_MAN.map((man) => (
            <Link
              key={man}
              href={salaryAmountPath(man)}
              className="rounded-full bg-primary-soft/40 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary-soft"
            >
              연봉 {formatManLabel(man)}
            </Link>
          ))}
          <Link
            href="/calculators/salary/table"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary-hover"
          >
            전체 연봉 실수령액 표 →
          </Link>
        </div>
      </section>
    </div>
  );
}
