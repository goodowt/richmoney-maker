"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateMinimumWage } from "@/lib/calculators/minimum-wage";
import { formatWon } from "@/lib/format";

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
          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-base outline-none focus:border-primary"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && <span className="text-sm text-foreground/55">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </label>
  );
}

export function MinimumWageCalculatorForm() {
  const [hourlyWage, setHourlyWage] = useState(10_320);
  const [dailyWorkHours, setDailyWorkHours] = useState(8);
  const [weeklyWorkDays, setWeeklyWorkDays] = useState(5);

  const result = useMemo(
    () =>
      calculateMinimumWage({
        hourlyWage: Math.max(hourlyWage, 0),
        dailyWorkHours: Math.max(dailyWorkHours, 0),
        weeklyWorkDays: Math.max(weeklyWorkDays, 0),
      }),
    [hourlyWage, dailyWorkHours, weeklyWorkDays]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <NumberField
          label="시급"
          hint="2026년 최저시급은 10,320원입니다."
          value={hourlyWage}
          onChange={setHourlyWage}
          min={0}
          step={10}
          suffix="원"
        />
        <NumberField
          label="하루 근무시간"
          value={dailyWorkHours}
          onChange={setDailyWorkHours}
          min={0}
          step={0.5}
          suffix="시간"
        />
        <NumberField
          label="주 근무일수"
          value={weeklyWorkDays}
          onChange={(v) => setWeeklyWorkDays(Math.round(v))}
          min={0}
          step={1}
          suffix="일"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground/55">월 예상 급여(세전)</p>
            <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.monthlyWage)}</p>
          </div>
          <div>
            <p className="text-sm text-foreground/55">연 환산 급여(세전)</p>
            <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.annualWage)}</p>
          </div>
        </div>

        {result.isBelowMinimumWage ? (
          <div className="rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            ⚠️ 입력한 시급이 2026년 최저시급({formatWon(result.minimumHourlyWage)})보다{" "}
            {formatWon(result.hourlyShortfall)} 적어요. 최저임금법 위반일 수 있습니다.
          </div>
        ) : (
          <div className="rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
            ✅ 2026년 최저시급({formatWon(result.minimumHourlyWage)}) 이상이에요.
          </div>
        )}

        <details className="group mt-4" open>
          <summary className="cursor-pointer select-none list-none rounded-lg bg-primary-soft/50 px-3 py-2 text-sm font-medium">
            계산 내역 펼쳐보기
          </summary>
          <div className="divide-y divide-border px-1 pt-2 text-sm">
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-foreground/75">주 근무시간</span>
              <span className="tabular-nums">{result.weeklyWorkHours}시간</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-foreground/75">주휴시간</span>
              <span className="tabular-nums">{result.weeklyHolidayHours}시간</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="font-semibold">월 환산 유급 근로시간</span>
              <span className="text-lg font-bold tabular-nums">{result.monthlyPaidHours}시간</span>
            </div>
          </div>
        </details>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          주휴수당은 1주 소정근로시간이 15시간 이상일 때 발생하며(근로기준법 제55조),
          주 40시간 근무 기준 월 환산 근로시간은 209시간입니다. 실제 급여는 회사의
          급여 계산 방식(비과세 항목, 수당 포함 여부 등)에 따라 다를 수 있습니다.
        </p>

        <Link
          href="/calculators/salary"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/75 underline decoration-primary/40 underline-offset-4 hover:text-primary"
        >
          이 월급으로 4대보험·세금 뗀 실수령액까지 계산해보기 →
        </Link>
      </div>
    </div>
  );
}
