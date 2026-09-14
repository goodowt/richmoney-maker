"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateWeeklyHolidayPay } from "@/lib/calculators/weekly-holiday-pay";
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

export function WeeklyHolidayPayCalculatorForm() {
  const [hourlyWage, setHourlyWage] = useState(10_320);
  const [dailyWorkHours, setDailyWorkHours] = useState(8);
  const [weeklyWorkDays, setWeeklyWorkDays] = useState(5);
  const [isFullAttendance, setIsFullAttendance] = useState(true);

  const result = useMemo(
    () =>
      calculateWeeklyHolidayPay({
        hourlyWage: Math.max(hourlyWage, 0),
        dailyWorkHours: Math.max(dailyWorkHours, 0),
        weeklyWorkDays: Math.max(weeklyWorkDays, 0),
        isFullAttendance,
      }),
    [hourlyWage, dailyWorkHours, weeklyWorkDays, isFullAttendance]
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
        <label className="flex items-start gap-2.5 rounded-lg bg-primary-soft/50 px-3 py-2.5">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-foreground"
            checked={isFullAttendance}
            onChange={(e) => setIsFullAttendance(e.target.checked)}
          />
          <span className="text-sm">
            <span className="font-medium">이번 주에 결근 없이 개근했어요</span>
            <span className="mt-0.5 block text-xs text-foreground/55">
              지각·조퇴는 상관없지만, 하루라도 결근하면 그 주는 주휴수당이 발생하지
              않아요.
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-foreground/55">1주치 주휴수당</p>
        <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.weeklyHolidayPay)}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground/55">월 환산(약 4.345주)</p>
            <p className="text-lg font-semibold">{formatWon(result.monthlyHolidayPay)}</p>
          </div>
          <div>
            <p className="text-sm text-foreground/55">연 환산</p>
            <p className="text-lg font-semibold">{formatWon(result.annualHolidayPay)}</p>
          </div>
        </div>

        {result.isEligible ? (
          <div className="mt-4 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
            ✅ 주휴수당 발생 조건(주 15시간 이상 + 개근)을 충족해요.
          </div>
        ) : (
          <div className="mt-4 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            ⚠️{" "}
            {result.meetsHoursRequirement
              ? "이번 주에 결근이 있어서 주휴수당이 발생하지 않아요."
              : "주 소정근로시간이 15시간 미만이라 주휴수당이 발생하지 않아요."}
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
              <span className="font-semibold">주휴시간</span>
              <span className="text-lg font-bold tabular-nums">
                {result.weeklyHolidayHours}시간
              </span>
            </div>
          </div>
        </details>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          주휴수당은 근로기준법 제55조에 따라 주 15시간 이상 근무하고 그 주에 개근한
          근로자에게 지급됩니다. 정규직·아르바이트 구분 없이 요건을 충족하면 지급
          의무가 있어요.
        </p>

        <Link
          href="/calculators/minimum-wage"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/75 underline decoration-primary/40 underline-offset-4 hover:text-primary"
        >
          주휴수당 포함 월급 전체를 최저임금 계산기에서 확인하기 →
        </Link>
      </div>
    </div>
  );
}
