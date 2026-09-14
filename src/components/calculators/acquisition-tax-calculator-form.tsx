"use client";

import { useMemo, useState } from "react";
import {
  calculateAcquisitionTax,
  type AcquisitionCause,
  type AcquisitionTaxCalculatorInput,
} from "@/lib/calculators/acquisition-tax";
import { formatWon } from "@/lib/format";

function NumberField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  step = 10_000_000,
  suffix = "원",
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
    <label className="flex items-start gap-2.5 rounded-lg bg-primary-soft/50 px-3 py-2.5">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-foreground"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm">
        <span className="font-medium">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-foreground/55">{hint}</span>}
      </span>
    </label>
  );
}

const CAUSE_OPTIONS: { value: AcquisitionCause; label: string }[] = [
  { value: "trade", label: "매매(유상취득)" },
  { value: "gift", label: "증여" },
  { value: "inheritance", label: "상속" },
  { value: "original", label: "원시취득" },
];

const HOUSE_COUNT_OPTIONS: { value: 1 | 2 | 3 | 4; label: string }[] = [
  { value: 1, label: "1주택" },
  { value: 2, label: "2주택" },
  { value: 3, label: "3주택" },
  { value: 4, label: "4주택+" },
];

const initialInput: AcquisitionTaxCalculatorInput = {
  price: 600_000_000,
  cause: "trade",
  exclusiveArea: 84,
  houseCount: 1,
  isAdjustedArea: false,
  isTemporaryTwoHouse: false,
  isFirstTimeBuyer: false,
};

export function AcquisitionTaxCalculatorForm() {
  const [input, setInput] = useState<AcquisitionTaxCalculatorInput>(initialInput);

  function set<K extends keyof AcquisitionTaxCalculatorInput>(
    key: K,
    value: AcquisitionTaxCalculatorInput[K]
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => calculateAcquisitionTax(input), [input]);
  const isTrade = input.cause === "trade";
  const canShowTemporaryTwoHouse = isTrade && input.houseCount === 2 && input.isAdjustedArea;
  const canShowFirstTimeBuyer = isTrade && input.houseCount === 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <NumberField
          label="취득가격(매매가·시가표준액 등)"
          value={input.price}
          onChange={(v) => set("price", v)}
        />
        <div>
          <span className="text-sm font-medium">취득원인</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {CAUSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("cause", opt.value)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  input.cause === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-primary-soft/40 text-foreground/70 hover:bg-primary-soft"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <NumberField
          label="전용면적"
          hint="85㎡ 초과면 농어촌특별세가 추가로 붙어요."
          value={input.exclusiveArea}
          onChange={(v) => set("exclusiveArea", v)}
          step={1}
          suffix="㎡"
        />

        {isTrade && (
          <>
            <div>
              <span className="text-sm font-medium">취득 후 보유주택수</span>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {HOUSE_COUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("houseCount", opt.value)}
                    className={`rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                      input.houseCount === opt.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-primary-soft/40 text-foreground/70 hover:bg-primary-soft"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {input.houseCount >= 2 && (
              <ToggleField
                label="조정대상지역이에요"
                hint="서울 등 조정대상지역은 다주택자 중과세율(8%·12%)이 적용돼요."
                checked={input.isAdjustedArea}
                onChange={(v) => set("isAdjustedArea", v)}
              />
            )}

            {canShowTemporaryTwoHouse && (
              <ToggleField
                label="일시적 2주택이에요(종전주택 처분 예정)"
                hint="이사·취업 등으로 일시적 2주택이 됐고 종전주택을 처분할 예정이면(2026년 8월 4일 이후 취득분은 2년 이내, 그 전 계약분은 3년 이내) 중과 대신 기본세율을 적용받아요."
                checked={input.isTemporaryTwoHouse}
                onChange={(v) => set("isTemporaryTwoHouse", v)}
              />
            )}

            {canShowFirstTimeBuyer && (
              <ToggleField
                label="생애최초 주택구입이에요"
                hint="본인·배우자 모두 주택을 가져본 적이 없고, 취득가액 12억원 이하일 때만 해당돼요(감면 한도 200만원)."
                checked={input.isFirstTimeBuyer}
                onChange={(v) => set("isFirstTimeBuyer", v)}
              />
            )}
          </>
        )}
      </div>

      <div className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-sm text-foreground/55">총 납부세액(취득세+지방교육세+농어촌특별세)</p>
          <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.totalTax)}</p>
        </div>

        {result.isSurcharged && (
          <div className="rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-400">
            ⚠️ 다주택자 중과세율({(result.appliedRate * 100).toFixed(0)}%)이 적용됐어요.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground/55">적용 세율</p>
            <p className="text-lg font-semibold">{(result.appliedRate * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-foreground/55">농어촌특별세 대상</p>
            <p className="text-lg font-semibold">{result.isRuralTaxApplicable ? "해당" : "비과세"}</p>
          </div>
        </div>

        <details className="group" open>
          <summary className="cursor-pointer select-none list-none rounded-lg bg-primary-soft/50 px-3 py-2 text-sm font-medium">
            계산 내역 펼쳐보기
          </summary>
          <div className="divide-y divide-border px-1 pt-2 text-sm">
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-foreground/75">산출 취득세액</span>
              <span className="tabular-nums">{formatWon(result.calculatedAcquisitionTax)}</span>
            </div>
            {result.firstTimeBuyerReduction > 0 && (
              <div className="flex items-baseline justify-between py-1.5">
                <span className="text-foreground/75">생애최초 감면</span>
                <span className="tabular-nums">-{formatWon(result.firstTimeBuyerReduction)}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between py-1.5">
              <span className="font-semibold">취득세(납부액)</span>
              <span className="text-lg font-bold tabular-nums">{formatWon(result.acquisitionTax)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-foreground/75">지방교육세</span>
              <span className="tabular-nums">{formatWon(result.localEducationTax)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-foreground/75">농어촌특별세</span>
              <span className="tabular-nums">{formatWon(result.ruralSpecialTax)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="font-semibold">총 납부세액</span>
              <span className="text-lg font-bold tabular-nums">{formatWon(result.totalTax)}</span>
            </div>
          </div>
        </details>

        <p className="text-xs leading-relaxed text-muted">
          2011년 지방세법 개정으로 옛 취득세·등록세가 하나로 통합돼, 소유권이전등기에는
          별도의 등록세가 없어요(취득세만 납부). 이 계산기는 예상 금액을 근사로 보여주는
          참고용이며, 지역별 한시 감면(경기도·강원도 등)은 반영하지 않아요. 정확한 세액은
          관할 시·군·구 세무부서에 확인하세요.
        </p>
      </div>
    </div>
  );
}
