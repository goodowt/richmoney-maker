"use client";

import { useMemo, useState } from "react";
import {
  calculateYearEndTax,
  type SmeTaxReductionType,
  type YearEndTaxCalculatorInput,
} from "@/lib/calculators/year-end-tax";
import { MORTGAGE_INTEREST_DEDUCTION_OPTIONS, type MortgageTermType } from "@/lib/calculators/rates";
import { formatWon } from "@/lib/format";

function NumberField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  step = 10_000,
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-foreground/85">{children}</h3>;
}

const initialInput: YearEndTaxCalculatorInput = {
  annualGrossSalary: 40_000_000,
  totalWithheldTax: 1_200_000,
  dependents: 1,
  childrenUnder20: 0,
  additionalPersonalDeduction: 0,
  creditCardSpending: 8_000_000,
  checkCardAndCashReceiptSpending: 4_000_000,
  traditionalMarketAndTransitSpending: 500_000,
  medicalExpense: 0,
  isMedicalExpenseUnlimited: false,
  educationExpensePreCollege: 0,
  educationExpenseUniversity: 0,
  insurancePremium: 0,
  isDisabledInsurance: false,
  donation: 0,
  pensionSavingsContribution: 0,
  irpContribution: 0,
  isNoHouseHousehold: false,
  housingSavingsContribution: 0,
  mortgageInterestPaid: 0,
  mortgageTermType: "from10To15Other",
  monthlyRentPaid: 0,
  smeTaxReductionType: "none",
};

export function YearEndTaxCalculatorForm() {
  const [input, setInput] = useState<YearEndTaxCalculatorInput>(initialInput);

  function set<K extends keyof YearEndTaxCalculatorInput>(key: K, value: YearEndTaxCalculatorInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => calculateYearEndTax(input), [input]);
  const isRefund = result.refundOrDueAmount >= 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="space-y-8 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          <SectionHeading>① 기본 정보</SectionHeading>
          <NumberField
            label="총급여액(비과세 제외, 연간)"
            hint="원천징수영수증 상단의 '총급여'예요. 식대 등 비과세 항목은 빼고 입력하세요."
            value={input.annualGrossSalary}
            onChange={(v) => set("annualGrossSalary", v)}
            step={1_000_000}
          />
          <NumberField
            label="연간 기납부세액(원천징수 결정세액 합계)"
            hint="매달 급여에서 이미 뗀 소득세+지방소득세를 1년치 합한 금액이에요. 급여명세서나 원천징수영수증에서 확인하세요."
            value={input.totalWithheldTax}
            onChange={(v) => set("totalWithheldTax", v)}
            step={10_000}
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="부양가족 수(본인 포함)"
              value={input.dependents}
              onChange={(v) => set("dependents", Math.round(v))}
              step={1}
              suffix="명"
            />
            <NumberField
              label="8~20세 자녀 수"
              value={input.childrenUnder20}
              onChange={(v) => set("childrenUnder20", Math.round(v))}
              step={1}
              suffix="명"
            />
          </div>
          <NumberField
            label="그 밖의 인적공제(경로우대·장애인·한부모 등, 선택)"
            hint="70세 이상 경로우대(1인당 100만원), 장애인공제(1인당 200만원), 한부모공제(100만원) 등에 해당하면 합산 금액을 직접 입력하세요. 해당 없으면 0으로 두세요."
            value={input.additionalPersonalDeduction}
            onChange={(v) => set("additionalPersonalDeduction", v)}
            step={100_000}
          />
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <SectionHeading>② 신용카드 등 사용액(연간)</SectionHeading>
          <NumberField
            label="신용카드 사용액"
            value={input.creditCardSpending}
            onChange={(v) => set("creditCardSpending", v)}
          />
          <NumberField
            label="체크카드·현금영수증 사용액"
            value={input.checkCardAndCashReceiptSpending}
            onChange={(v) => set("checkCardAndCashReceiptSpending", v)}
          />
          <NumberField
            label="전통시장·대중교통 사용액"
            value={input.traditionalMarketAndTransitSpending}
            onChange={(v) => set("traditionalMarketAndTransitSpending", v)}
          />
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <SectionHeading>③ 보험료·의료비·교육비·기부금(연간)</SectionHeading>
          <NumberField
            label="보장성 보험료"
            value={input.insurancePremium}
            onChange={(v) => set("insurancePremium", v)}
          />
          <ToggleField
            label="장애인전용보장성보험이에요"
            hint="공제율이 12%→15%로 올라가요."
            checked={input.isDisabledInsurance}
            onChange={(v) => set("isDisabledInsurance", v)}
          />
          <NumberField
            label="의료비 지출액"
            value={input.medicalExpense}
            onChange={(v) => set("medicalExpense", v)}
          />
          <ToggleField
            label="본인·65세 이상 부양가족·장애인·난임시술비 의료비예요"
            hint="이 경우 700만원 한도 없이 전액 공제 대상이 돼요."
            checked={input.isMedicalExpenseUnlimited}
            onChange={(v) => set("isMedicalExpenseUnlimited", v)}
          />
          <NumberField
            label="교육비 - 취학전아동·초중고생(1인당 한도 300만원)"
            value={input.educationExpensePreCollege}
            onChange={(v) => set("educationExpensePreCollege", v)}
          />
          <NumberField
            label="교육비 - 대학생(대학원 제외, 1인당 한도 900만원)"
            value={input.educationExpenseUniversity}
            onChange={(v) => set("educationExpenseUniversity", v)}
          />
          <NumberField label="기부금" value={input.donation} onChange={(v) => set("donation", v)} />
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <SectionHeading>④ 연금계좌(연간 납입액)</SectionHeading>
          <NumberField
            label="연금저축 납입액"
            hint="연금저축 단독으로는 최대 600만원까지만 세액공제 대상이에요."
            value={input.pensionSavingsContribution}
            onChange={(v) => set("pensionSavingsContribution", v)}
          />
          <NumberField
            label="IRP(개인형퇴직연금) 납입액"
            hint="연금저축과 합산해 최대 900만원까지 공제돼요."
            value={input.irpContribution}
            onChange={(v) => set("irpContribution", v)}
          />
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <SectionHeading>⑤ 주택자금 · 월세</SectionHeading>
          <ToggleField
            label="무주택 세대주예요"
            hint="주택청약저축·주담대이자·월세 공제는 모두 무주택 세대주(또는 배우자)만 대상이에요."
            checked={input.isNoHouseHousehold}
            onChange={(v) => set("isNoHouseHousehold", v)}
          />
          <NumberField
            label="주택청약종합저축 납입액(총급여 7천만원 이하)"
            value={input.housingSavingsContribution}
            onChange={(v) => set("housingSavingsContribution", v)}
          />
          <NumberField
            label="장기주택저당차입금 이자상환액"
            hint="주택담보대출(주담대) 이자로 낸 금액이에요. 취득 당시 주택 기준시가 6억원 이하인 대출만 해당해요."
            value={input.mortgageInterestPaid}
            onChange={(v) => set("mortgageInterestPaid", v)}
          />
          <label className="block">
            <span className="text-sm font-medium">대출 상환 조건</span>
            <select
              className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
              value={input.mortgageTermType}
              onChange={(e) => set("mortgageTermType", e.target.value as MortgageTermType)}
            >
              {MORTGAGE_INTEREST_DEDUCTION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} (한도 {formatWon(o.limit)})
                </option>
              ))}
            </select>
          </label>
          <NumberField
            label="월세액(연간 합계, 총급여 8천만원 이하만 대상)"
            value={input.monthlyRentPaid}
            onChange={(v) => set("monthlyRentPaid", v)}
          />
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <SectionHeading>⑥ 중소기업 취업자 소득세 감면</SectionHeading>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { value: "none", label: "해당 없음" },
                { value: "youth", label: "청년(90%·5년)" },
                { value: "other", label: "60세이상·장애인 등(70%·3년)" },
              ] as { value: SmeTaxReductionType; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("smeTaxReductionType", opt.value)}
                className={`rounded-lg px-2 py-2 text-xs font-medium leading-tight transition-colors ${
                  input.smeTaxReductionType === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-primary-soft/40 text-foreground/70 hover:bg-primary-soft"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
        <div>
          <p className="text-sm text-foreground/55">{isRefund ? "예상 환급액" : "예상 추가납부액"}</p>
          <p className={`text-2xl font-bold sm:text-3xl ${isRefund ? "" : "text-red-600 dark:text-red-400"}`}>
            {formatWon(Math.abs(result.refundOrDueAmount))}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground/55">근로소득금액</p>
            <p className="text-lg font-semibold">{formatWon(result.earnedIncome)}</p>
          </div>
          <div>
            <p className="text-sm text-foreground/55">과세표준</p>
            <p className="text-lg font-semibold">{formatWon(result.taxBase)}</p>
          </div>
        </div>

        <details className="group" open>
          <summary className="cursor-pointer select-none list-none rounded-lg bg-primary-soft/50 px-3 py-2 text-sm font-medium">
            소득공제 내역
          </summary>
          <div className="divide-y divide-border px-1 pt-2 text-sm">
            <Row label="기본공제" value={result.incomeDeductions.basicDeduction} />
            <Row label="추가 인적공제" value={result.incomeDeductions.additionalPersonalDeduction} />
            <Row label="연금보험료공제(국민연금)" value={result.incomeDeductions.pensionPremiumDeduction} />
            <Row label="특별소득공제(건강·장기요양·고용보험)" value={result.incomeDeductions.specialDeductionInsurance} />
            <Row label="신용카드 등 사용액 소득공제" value={result.incomeDeductions.creditCardDeduction} />
            <Row label="주택청약저축 소득공제" value={result.incomeDeductions.housingSavingsDeduction} />
            <Row label="장기주택저당차입금 이자상환액 소득공제" value={result.incomeDeductions.mortgageInterestDeduction} />
            <Row label="소득공제 합계" value={result.incomeDeductions.total} bold />
          </div>
        </details>

        <details className="group">
          <summary className="cursor-pointer select-none list-none rounded-lg bg-primary-soft/50 px-3 py-2 text-sm font-medium">
            세액감면·세액공제 내역
          </summary>
          <div className="divide-y divide-border px-1 pt-2 text-sm">
            <Row label="산출세액" value={result.calculatedTax} />
            <Row label="중소기업 취업자 세액감면" value={-result.smeTaxReduction} />
            <Row label="근로소득세액공제" value={-result.taxCredits.laborIncomeTaxCredit} />
            <Row label="자녀세액공제" value={-result.taxCredits.childTaxCredit} />
            <Row
              label="표준세액공제 또는 보험료·의료비·교육비·기부금 세액공제"
              value={-result.taxCredits.standardOrItemizedCredit}
            />
            <Row label="연금계좌 세액공제" value={-result.taxCredits.pensionAccountCredit} />
            <Row label="월세액 세액공제" value={-result.taxCredits.monthlyRentCredit} />
            <Row label="결정세액(소득세)" value={result.determinedTax} bold />
            <Row label="지방소득세(결정세액의 10%)" value={result.localIncomeTax} />
            <Row label="결정세액 합계" value={result.totalDeterminedTaxWithLocal} bold />
          </div>
        </details>

        <p className="text-xs leading-relaxed text-muted">
          이 계산기는 예상 금액을 근사로 보여주는 참고용 도구예요. 실제 연말정산은 회사가
          홈택스 연말정산 간소화 자료를 바탕으로 정산하며, 이 계산기가 다루지 않는 세부
          항목(출산·입양공제, 월세 청년 우대 등)이 있으면 실제 금액과 차이가 날 수 있어요.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={bold ? "font-semibold" : "text-foreground/75"}>{label}</span>
      <span className={`tabular-nums ${bold ? "text-base font-bold" : ""}`}>{formatWon(value)}</span>
    </div>
  );
}
