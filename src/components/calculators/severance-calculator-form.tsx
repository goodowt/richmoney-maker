"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateSeverance } from "@/lib/calculators/severance";
import { formatWon } from "@/lib/format";

function ResultRow({
  label,
  value,
  emphasis,
  negative,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span className={emphasis ? "font-semibold" : "text-black/70 dark:text-white/70"}>
        {label}
      </span>
      <span className={emphasis ? "text-lg font-bold" : "tabular-nums"}>
        {negative && value > 0 ? "-" : ""}
        {formatWon(value)}
      </span>
    </div>
  );
}

function todayMinusYears(years: number) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

export function SeveranceCalculatorForm() {
  const [startDate, setStartDate] = useState(() => todayMinusYears(3));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [averageDailyWageMan, setAverageDailyWageMan] = useState(15);

  const result = useMemo(() => {
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      return null;
    }
    return calculateSeverance({
      startDate,
      endDate,
      averageDailyWage: Math.max(averageDailyWageMan, 0) * 10_000,
    });
  }, [startDate, endDate, averageDailyWageMan]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-5 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <label className="block">
          <span className="text-sm font-medium">입사일</span>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">퇴사일</span>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">1일 평균임금</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
              value={averageDailyWageMan}
              min={0}
              step={1}
              onChange={(e) => setAverageDailyWageMan(Number(e.target.value))}
            />
            <span className="text-sm text-black/50 dark:text-white/50">만원</span>
          </div>
          <p className="mt-1 text-xs text-black/45 dark:text-white/45">
            퇴직 전 3개월간 받은 임금 총액 ÷ 그 기간의 총 일수
          </p>
        </label>
      </div>

      <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
        {!result ? (
          <p className="text-sm text-black/50 dark:text-white/50">
            퇴사일은 입사일보다 이후 날짜여야 합니다.
          </p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-black/50 dark:text-white/50">
                재직기간 {Math.floor(result.serviceDays / 365)}년{" "}
                {Math.floor((result.serviceDays % 365) / 30)}개월 (총 {result.serviceDays.toLocaleString("ko-KR")}일)
              </p>
              <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                세후 실수령 예상 퇴직금
              </p>
              <p className="text-2xl font-bold sm:text-3xl">
                {formatWon(result.netSeverancePay)}
              </p>
            </div>

            <details className="group" open>
              <summary className="cursor-pointer select-none list-none rounded-lg bg-black/[.03] px-3 py-2 text-sm font-medium dark:bg-white/[.06]">
                계산 내역 펼쳐보기
              </summary>
              <div className="divide-y divide-black/5 px-1 pt-2 dark:divide-white/10">
                <ResultRow label="세전 퇴직금" value={result.severancePay} emphasis />
                <ResultRow label="근속연수공제" value={result.tax.serviceYearDeduction} negative />
                <ResultRow label="환산급여" value={result.tax.convertedSalary} />
                <ResultRow label="환산급여공제" value={result.tax.convertedSalaryDeduction} negative />
                <ResultRow label="퇴직소득세 과세표준" value={result.tax.taxBase} />
                <ResultRow label="퇴직소득세" value={result.tax.calculatedTax} negative />
                <ResultRow label="지방소득세" value={result.tax.localIncomeTax} negative />
                <ResultRow label="세금 합계" value={result.tax.total} negative />
                <ResultRow label="세후 실수령 퇴직금" value={result.netSeverancePay} emphasis />
              </div>
            </details>
          </>
        )}

        <p className="mt-4 text-xs leading-relaxed text-black/45 dark:text-white/45">
          퇴직소득세는 2020년 이후 시행 중인 &ldquo;환산급여&rdquo; 방식(근속연수공제 →
          환산급여공제 → 누진세율)으로 계산한 값입니다. 실제 원천징수액은 회사의
          계산 방식에 따라 소폭 다를 수 있습니다.
        </p>

        <Link
          href="/calculators/salary"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-black/70 underline decoration-black/30 underline-offset-4 hover:text-black dark:text-white/70 dark:decoration-white/30 dark:hover:text-white"
        >
          내 연봉 실수령액도 계산해보기 →
        </Link>
      </div>
    </div>
  );
}
