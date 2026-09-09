import { PROGRESSIVE_TAX_BRACKETS } from "./rates";

/** 구간별 누적 방식(근로소득공제 등)을 계산하는 헬퍼: base + (금액 - 하한) × rate */
export function calcBracketed(
  amount: number,
  brackets: readonly { upTo: number; rate: number; base: number }[]
) {
  let lower = 0;
  for (const bracket of brackets) {
    if (amount <= bracket.upTo) {
      return bracket.base + Math.max(amount - lower, 0) * bracket.rate;
    }
    lower = bracket.upTo;
  }
  const last = brackets[brackets.length - 1];
  return last.base + Math.max(amount - lower, 0) * last.rate;
}

/** 종합소득세 8단계 초과누진세율표를 적용해 산출세액을 계산합니다. (근로소득세·퇴직소득세 공용) */
export function progressiveTax(taxBase: number) {
  for (const bracket of PROGRESSIVE_TAX_BRACKETS) {
    if (taxBase <= bracket.upTo) {
      return Math.max(taxBase * bracket.rate - bracket.deduction, 0);
    }
  }
  return 0;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
