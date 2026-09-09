"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateInsurance } from "@/lib/calculators/insurance";
import { COMPANY_SIZE_OPTIONS, type CompanySize } from "@/lib/calculators/rates";
import { formatWon } from "@/lib/format";

function InsuranceRow({
  label,
  employee,
  employer,
}: {
  label: string;
  employee: number;
  employer: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-4 py-2">
      <span className="font-medium">{label}</span>
      <span className="tabular-nums text-black/70 dark:text-white/70">{formatWon(employee)}</span>
      <span className="tabular-nums text-black/50 dark:text-white/50">{formatWon(employer)}</span>
    </div>
  );
}

export function InsuranceCalculatorForm() {
  const [monthlySalaryMan, setMonthlySalaryMan] = useState(300);
  const [companySize, setCompanySize] = useState<CompanySize>("under150");

  const result = useMemo(
    () =>
      calculateInsurance({
        monthlySalary: Math.max(monthlySalaryMan, 0) * 10_000,
        companySize,
      }),
    [monthlySalaryMan, companySize]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="space-y-5 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <label className="block">
          <span className="text-sm font-medium">월 보수액(세전)</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
              value={monthlySalaryMan}
              min={0}
              step={10}
              onChange={(e) => setMonthlySalaryMan(Number(e.target.value))}
            />
            <span className="text-sm text-black/50 dark:text-white/50">만원</span>
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium">사업장 규모</span>
          <select
            className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value as CompanySize)}
          >
            {COMPANY_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-black/45 dark:text-white/45">
            고용보험 중 &ldquo;고용안정·직업능력개발사업&rdquo;분은 사업주만 부담하며
            사업장 규모에 따라 요율이 다릅니다.
          </p>
        </label>
      </div>

      <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">근로자 부담 합계</p>
            <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.employeeTotal)}</p>
          </div>
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">사업주 부담 합계</p>
            <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.employerTotal)}</p>
          </div>
        </div>

        <div className="rounded-lg bg-black/[.03] px-3 py-2 dark:bg-white/[.06]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 text-xs font-medium text-black/50 dark:text-white/50">
            <span>항목</span>
            <span>근로자</span>
            <span>사업주</span>
          </div>
        </div>
        <div className="divide-y divide-black/5 px-1 dark:divide-white/10">
          <InsuranceRow
            label="국민연금"
            employee={result.nationalPension.employee}
            employer={result.nationalPension.employer}
          />
          <InsuranceRow
            label="건강보험"
            employee={result.healthInsurance.employee}
            employer={result.healthInsurance.employer}
          />
          <InsuranceRow
            label="장기요양보험"
            employee={result.longTermCare.employee}
            employer={result.longTermCare.employer}
          />
          <InsuranceRow
            label="고용보험"
            employee={result.employmentInsurance.employee}
            employer={result.employmentInsurance.employer}
          />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-black/45 dark:text-white/45">
          2026년 4대보험 요율 기준입니다. 산재보험은 사업주가 전액 부담하며
          업종별 요율이 달라 이 계산기에는 포함하지 않았습니다.
        </p>

        <Link
          href="/calculators/salary"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-black/70 underline decoration-black/30 underline-offset-4 hover:text-black dark:text-white/70 dark:decoration-white/30 dark:hover:text-white"
        >
          이 보수로 실수령액까지 계산해보기 →
        </Link>
      </div>
    </div>
  );
}
