"use client";

import { useMemo, useState } from "react";
import { calculateUnemploymentBenefit } from "@/lib/calculators/unemployment-benefit";
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

function ToggleField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2.5 rounded-lg bg-black/[.03] px-3 py-2.5 dark:bg-white/[.06]">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-foreground"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm">
        <span className="font-medium">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-xs text-black/50 dark:text-white/50">{hint}</span>
        )}
      </span>
    </label>
  );
}

export function UnemploymentBenefitCalculatorForm() {
  const [averageDailyWage, setAverageDailyWage] = useState(80_000);
  const [insuredYears, setInsuredYears] = useState(4);
  const [insuredMonths, setInsuredMonths] = useState(0);
  const [isOver50OrDisabled, setIsOver50OrDisabled] = useState(false);
  const [isInvoluntary, setIsInvoluntary] = useState(true);

  const result = useMemo(
    () =>
      calculateUnemploymentBenefit({
        averageDailyWage: Math.max(averageDailyWage, 0),
        insuredYears: Math.max(insuredYears, 0),
        insuredMonths: Math.max(insuredMonths, 0),
        isOver50OrDisabled,
        isInvoluntary,
      }),
    [averageDailyWage, insuredYears, insuredMonths, isOver50OrDisabled, isInvoluntary]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-5 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <NumberField
          label="이직 전 평균임금(1일 기준)"
          hint="퇴사 전 3개월간 받은 임금총액 ÷ 그 기간의 총 일수예요. 급여명세서로 확인하세요."
          value={averageDailyWage}
          onChange={setAverageDailyWage}
          min={0}
          step={1_000}
          suffix="원"
        />
        <div>
          <span className="text-sm font-medium">고용보험 가입기간</span>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <NumberField
              label=""
              value={insuredYears}
              onChange={(v) => setInsuredYears(Math.round(v))}
              min={0}
              step={1}
              suffix="년"
            />
            <NumberField
              label=""
              value={insuredMonths}
              onChange={(v) => setInsuredMonths(Math.round(v))}
              min={0}
              step={1}
              suffix="개월"
            />
          </div>
          <p className="mt-1 text-xs text-black/45 dark:text-white/45">
            여러 직장을 다녔다면 고용보험 가입 이력을 모두 합한 기간이에요(고용보험
            홈페이지에서 확인 가능).
          </p>
        </div>
        <ToggleField
          label="이직일 현재 50세 이상이거나 장애인이에요"
          checked={isOver50OrDisabled}
          onChange={setIsOver50OrDisabled}
        />
        <ToggleField
          label="비자발적으로 이직했어요(권고사직·해고·계약만료·폐업 등)"
          hint="개인 사정으로 자진 퇴사했다면 체크를 해제하세요."
          checked={isInvoluntary}
          onChange={setIsInvoluntary}
        />
      </div>

      <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-sm text-black/50 dark:text-white/50">총 예상 수급액</p>
        <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.totalBenefit)}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">1일 구직급여액</p>
            <p className="text-lg font-semibold">{formatWon(result.dailyBenefit)}</p>
          </div>
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">소정급여일수</p>
            <p className="text-lg font-semibold">{result.prescribedDays}일</p>
          </div>
        </div>

        {!isInvoluntary && (
          <div className="mt-4 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            ⚠️ 자발적 이직은 원칙적으로 실업급여 수급 대상이 아니에요. 다만 임금체불,
            근로조건 악화 등 &ldquo;정당한 사유&rdquo;가 인정되면 예외적으로 받을 수
            있으니 고용센터에 확인하세요.
          </div>
        )}
        {result.isBelowMinimumInsuredPeriod && (
          <div className="mt-4 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            ⚠️ 고용보험 가입기간이 짧아요. 이직일 전 18개월 중 실제 근무일(피보험단위기간)이
            180일 이상이어야 수급자격이 인정돼요.
          </div>
        )}

        <details className="group mt-4" open>
          <summary className="cursor-pointer select-none list-none rounded-lg bg-black/[.03] px-3 py-2 text-sm font-medium dark:bg-white/[.06]">
            계산 내역 펼쳐보기
          </summary>
          <div className="divide-y divide-black/5 px-1 pt-2 text-sm dark:divide-white/10">
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">평균임금의 60%</span>
              <span className="tabular-nums">{formatWon(result.rawDailyBenefit)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">2026년 상·하한액</span>
              <span className="tabular-nums">66,048원 ~ 68,100원</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="font-semibold">1일 구직급여액(상하한 적용)</span>
              <span className="text-lg font-bold tabular-nums">
                {formatWon(result.dailyBenefit)}
              </span>
            </div>
          </div>
        </details>

        <p className="mt-4 text-xs leading-relaxed text-black/45 dark:text-white/45">
          이 계산기는 예상 금액을 보여줄 뿐이며, 실제 수급자격과 지급액은 관할
          고용센터의 심사로 최종 결정됩니다. 소정급여일수는 고용보험법 시행령
          별표1(연령·피보험기간 기준)을 따릅니다.
        </p>
      </div>
    </div>
  );
}
