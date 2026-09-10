"use client";

import { useMemo, useState } from "react";
import { calculateFreelanceTax } from "@/lib/calculators/freelance-tax";
import { formatWon } from "@/lib/format";

export function FreelanceTaxCalculatorForm() {
  const [mode, setMode] = useState<"gross" | "net">("gross");
  const [amount, setAmount] = useState(3_000_000);

  const result = useMemo(
    () => calculateFreelanceTax({ amount: Math.max(amount, 0), mode }),
    [amount, mode]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-5 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <div>
          <span className="text-sm font-medium">계산 방식</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("gross")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mode === "gross"
                  ? "bg-foreground text-background"
                  : "bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
              }`}
            >
              세전 계약금액으로 계산
            </button>
            <button
              type="button"
              onClick={() => setMode("net")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mode === "net"
                  ? "bg-foreground text-background"
                  : "bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
              }`}
            >
              실수령액으로 계산
            </button>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium">
            {mode === "gross" ? "세전 계약금액(용역비)" : "실수령액(내 통장에 들어올 금액)"}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
              value={Number.isFinite(amount) ? amount : 0}
              min={0}
              step={10_000}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <span className="text-sm text-black/50 dark:text-white/50">원</span>
          </div>
          <p className="mt-1 text-xs text-black/45 dark:text-white/45">
            {mode === "gross"
              ? "계약서·인보이스에 적힌 세전 금액을 입력하세요."
              : "실제로 입금받고 싶은(또는 입금받은) 금액을 입력하세요."}
          </p>
        </label>
      </div>

      <div className="rounded-xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-sm text-black/50 dark:text-white/50">실수령액</p>
        <p className="text-2xl font-bold sm:text-3xl">{formatWon(result.netAmount)}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">세전 계약금액</p>
            <p className="text-lg font-semibold">{formatWon(result.grossAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-black/50 dark:text-white/50">원천징수세액(3.3%)</p>
            <p className="text-lg font-semibold">{formatWon(result.totalWithholding)}</p>
          </div>
        </div>

        <details className="group mt-4" open>
          <summary className="cursor-pointer select-none list-none rounded-lg bg-black/[.03] px-3 py-2 text-sm font-medium dark:bg-white/[.06]">
            계산 내역 펼쳐보기
          </summary>
          <div className="divide-y divide-black/5 px-1 pt-2 text-sm dark:divide-white/10">
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">소득세(3%)</span>
              <span className="tabular-nums">{formatWon(result.incomeTax)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">지방소득세(소득세의 10%)</span>
              <span className="tabular-nums">{formatWon(result.localIncomeTax)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="font-semibold">원천징수세액 합계</span>
              <span className="text-lg font-bold tabular-nums">
                {formatWon(result.totalWithholding)}
              </span>
            </div>
          </div>
        </details>

        <details className="group mt-3">
          <summary className="cursor-pointer select-none list-none rounded-lg bg-black/[.03] px-3 py-2 text-sm font-medium dark:bg-white/[.06]">
            매달 이 금액을 받는다면? (연 환산)
          </summary>
          <div className="divide-y divide-black/5 px-1 pt-2 text-sm dark:divide-white/10">
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">연 세전 합계</span>
              <span className="tabular-nums">{formatWon(result.annualEquivalent.grossAmount)}</span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-black/70 dark:text-white/70">연 원천징수세액 합계</span>
              <span className="tabular-nums">
                {formatWon(result.annualEquivalent.totalWithholding)}
              </span>
            </div>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="font-semibold">연 실수령액 합계</span>
              <span className="text-lg font-bold tabular-nums">
                {formatWon(result.annualEquivalent.netAmount)}
              </span>
            </div>
          </div>
        </details>

        <p className="mt-4 text-xs leading-relaxed text-black/45 dark:text-white/45">
          프리랜서(사업소득) 용역비는 소득세 3%와 지방소득세 0.3%를 더한 3.3%를
          원천징수한 뒤 지급합니다. 다음 해 5월 종합소득세 신고 때 이미 낸
          원천징수세액과 실제 세액을 정산해 환급받거나 추가로 낼 수 있어요.
        </p>
      </div>
    </div>
  );
}
