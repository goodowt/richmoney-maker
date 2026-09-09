"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateSalary } from "@/lib/calculators/salary";
import { formatWon } from "@/lib/format";

const MAN = 10_000;

function NumberField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  step = 1,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && <span className="text-sm text-black/50 dark:text-white/50">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-black/45 dark:text-white/45">{hint}</p>}
    </label>
  );
}

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

export function SalaryCalculatorForm() {
  const [annualSalaryMan, setAnnualSalaryMan] = useState(4000);
  const [nonTaxableMan, setNonTaxableMan] = useState(20);
  const [dependents, setDependents] = useState(1);
  const [childrenUnder20, setChildrenUnder20] = useState(0);

  const result = useMemo(
    () =>
      calculateSalary({
        annualSalary: Math.max(annualSalaryMan, 0) * MAN,
        monthlyNonTaxable: Math.max(nonTaxableMan, 0) * MAN,
        dependents: Math.max(dependents, 1),
        childrenUnder20: Math.max(childrenUnder20, 0),
      }),
    [annualSalaryMan, nonTaxableMan, dependents, childrenUnder20]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-5 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <NumberField
          label="연봉(세전)"
          value={annualSalaryMan}
          onChange={setAnnualSalaryMan}
          min={0}
          step={100}
          suffix="만원"
        />
        <NumberField
          label="비과세액(식대 등, 월)"
          hint="식대 비과세 한도는 월 20만원입니다."
          value={nonTaxableMan}
          onChange={setNonTaxableMan}
          min={0}
          step={5}
          suffix="만원"
        />
        <NumberField
          label="부양가족 수(본인 포함)"
          value={dependents}
          onChange={(v) => setDependents(Math.round(v))}
          min={1}
          step={1}
          suffix="명"
        />
        <NumberField
          label="20세 이하 자녀 수"
          value={childrenUnder20}
          onChange={(v) => setChildrenUnder20(Math.round(v))}
          min={0}
          step={1}
          suffix="명"
        />
      </div>

      <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">월 실수령액</p>
            <p className="text-2xl font-bold sm:text-3xl">
              {formatWon(result.monthlyNetSalary)}
            </p>
          </div>
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">연 실수령액</p>
            <p className="text-2xl font-bold sm:text-3xl">
              {formatWon(result.annualNetSalary)}
            </p>
          </div>
        </div>

        <details className="group" open>
          <summary className="cursor-pointer select-none list-none rounded-lg bg-black/[.03] px-3 py-2 text-sm font-medium dark:bg-white/[.06]">
            공제 내역 펼쳐보기
          </summary>
          <div className="divide-y divide-black/5 px-1 pt-2 dark:divide-white/10">
            <ResultRow label="세전 월급" value={result.monthlyGrossSalary} emphasis />
            <ResultRow label="국민연금" value={result.insurance.nationalPension} negative />
            <ResultRow label="건강보험" value={result.insurance.healthInsurance} negative />
            <ResultRow label="장기요양보험" value={result.insurance.longTermCare} negative />
            <ResultRow label="고용보험" value={result.insurance.employmentInsurance} negative />
            <ResultRow label="소득세" value={result.tax.monthlyIncomeTax} negative />
            <ResultRow label="지방소득세" value={result.tax.monthlyLocalIncomeTax} negative />
            <ResultRow label="공제 합계" value={result.monthlyDeductionTotal} negative />
            <ResultRow label="월 실수령액" value={result.monthlyNetSalary} emphasis />
          </div>
        </details>

        <p className="mt-4 text-xs leading-relaxed text-black/45 dark:text-white/45">
          이 계산기는 2026년 4대보험 요율과 국세청 근로소득 간이세액표를 근사한
          결과입니다. 실제 원천징수세액은 회사의 계산 방식에 따라 소폭 다를 수
          있습니다.
        </p>

        <Link
          href="/calculators/severance"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-black/70 underline decoration-black/30 underline-offset-4 hover:text-black dark:text-white/70 dark:decoration-white/30 dark:hover:text-white"
        >
          이 연봉이면 퇴직금은 얼마일까요? →
        </Link>
      </div>
    </div>
  );
}
