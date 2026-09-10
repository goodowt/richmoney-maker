"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculateAnnualLeave } from "@/lib/calculators/annual-leave";
import { formatWon } from "@/lib/format";

function todayString() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

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

function DateField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="date"
        className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-black/45 dark:text-white/45">{hint}</p>}
    </label>
  );
}

export function AnnualLeaveCalculatorForm() {
  const [hireDate, setHireDate] = useState("2023-09-11");
  // "오늘" 날짜는 서버(빌드 시점)와 클라이언트(접속 시점)의 시간대·시각이 달라
  // 하이드레이션 불일치를 일으킬 수 있어, 서버와 동일한 빈 값으로 시작한 뒤
  // 마운트 후에만 실제 오늘 날짜로 채웁니다.
  const [referenceDate, setReferenceDate] = useState("");
  const [monthlySalary, setMonthlySalary] = useState(3_000_000);
  const [dailyWorkHours, setDailyWorkHours] = useState(8);
  const [weeklyWorkDays, setWeeklyWorkDays] = useState(5);
  const [usedLeaveDays, setUsedLeaveDays] = useState(0);

  useEffect(() => {
    setReferenceDate(todayString());
  }, []);

  const result = useMemo(
    () =>
      calculateAnnualLeave({
        hireDate,
        referenceDate,
        monthlySalary: Math.max(monthlySalary, 0),
        dailyWorkHours: Math.max(dailyWorkHours, 0),
        weeklyWorkDays: Math.max(weeklyWorkDays, 0),
        usedLeaveDays: Math.max(usedLeaveDays, 0),
      }),
    [hireDate, referenceDate, monthlySalary, dailyWorkHours, weeklyWorkDays, usedLeaveDays]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-5 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <DateField label="입사일" value={hireDate} onChange={setHireDate} />
        <DateField
          label="연차 산정 기준일"
          hint="보통 오늘 날짜예요. 퇴사 예정일을 넣으면 퇴사 시점 기준으로 계산돼요."
          value={referenceDate}
          onChange={setReferenceDate}
        />
        <NumberField
          label="월급"
          hint="기본급 등 통상임금 성격의 세전 월급이에요."
          value={monthlySalary}
          onChange={setMonthlySalary}
          min={0}
          step={10_000}
          suffix="원"
        />
        <div className="grid grid-cols-2 gap-4">
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
        <NumberField
          label="지금까지 사용한 연차일수"
          value={usedLeaveDays}
          onChange={setUsedLeaveDays}
          min={0}
          step={1}
          suffix="일"
        />
      </div>

      <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-sm text-black/50 dark:text-white/50">연차수당(미사용 연차 기준)</p>
        <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.annualLeavePay)}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">발생 연차일수</p>
            <p className="text-lg font-semibold">{result.totalEntitledDays}일</p>
          </div>
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">남은(미사용) 연차</p>
            <p className="text-lg font-semibold">{result.remainingLeaveDays}일</p>
          </div>
        </div>

        {result.remainingLeaveDays === 0 && (
          <div className="mt-4 rounded-lg bg-black/[.04] px-3 py-2.5 text-sm text-black/60 dark:bg-white/[.06] dark:text-white/60">
            {result.totalEntitledDays === 0
              ? "아직 연차가 발생하지 않았어요."
              : "발생한 연차를 이미 다 사용해서 연차수당이 없어요."}
          </div>
        )}

        <details className="group mt-4" open>
          <summary className="cursor-pointer select-none list-none rounded-lg bg-black/[.03] px-3 py-2 text-sm font-medium dark:bg-white/[.06]">
            계산 내역 펼쳐보기
          </summary>
          <div className="divide-y divide-black/5 px-1 pt-2 text-sm dark:divide-white/10">
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">근속기간</span>
              <span className="tabular-nums">
                {result.serviceYearsLabel.years}년 {result.serviceYearsLabel.months}개월
              </span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">통상시급</span>
              <span className="tabular-nums">{formatWon(result.hourlyOrdinaryWage)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="font-semibold">1일 통상임금</span>
              <span className="text-lg font-bold tabular-nums">
                {formatWon(result.dailyOrdinaryWage)}
              </span>
            </div>
          </div>
        </details>

        <p className="mt-4 text-xs leading-relaxed text-black/45 dark:text-white/45">
          근속 1년 미만은 개근한 달마다 1일(최대 11일), 1년 이상은 15일에 매 2년마다
          1일씩 가산(최대 25일)됩니다(근로기준법 제60조). 입사 첫해에 받은 최대 11일과
          1년 시점에 새로 발생하는 15일은 별도로 관리되니, 첫해 미사용 연차가 남아있다면
          이 결과에 더해서 계산하세요.
        </p>

        <Link
          href="/calculators/salary"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-black/70 underline decoration-black/30 underline-offset-4 hover:text-black dark:text-white/70 dark:decoration-white/30 dark:hover:text-white"
        >
          연차수당까지 포함한 월급으로 실수령액 계산해보기 →
        </Link>
      </div>
    </div>
  );
}
