import { calculateMonthlyPaidHours } from "./weekly-holiday-pay";

export type AnnualLeaveCalculatorInput = {
  /** 입사일 (YYYY-MM-DD) */
  hireDate: string;
  /** 연차 산정 기준일 (YYYY-MM-DD) — 보통 오늘 또는 퇴사(예정)일 */
  referenceDate: string;
  /** 월급(세전, 통상임금 성격, 원) */
  monthlySalary: number;
  /** 하루 소정근로시간 */
  dailyWorkHours: number;
  /** 주 근무일수 */
  weeklyWorkDays: number;
  /** 지금까지 사용한 연차일수 */
  usedLeaveDays: number;
};

export type AnnualLeaveCalculatorResult = {
  input: AnnualLeaveCalculatorInput;
  /** 입사일부터 기준일까지 경과한 개월 수(만 개월) */
  totalServiceMonths: number;
  /** 경과한 만 근속연수·개월 (예: 3년 2개월) */
  serviceYearsLabel: { years: number; months: number };
  /** 근속 1년 미만인지 (개근 시 월 1일 방식 적용 대상) */
  isUnderOneYear: boolean;
  /** 근로기준법 제60조 기준 발생 연차일수 */
  totalEntitledDays: number;
  /** 발생 연차 - 사용 연차 (0 미만이면 0) */
  remainingLeaveDays: number;
  /** 월 환산 유급 근로시간(통상시급 산정 분모, 주 40시간 기준 209시간) */
  monthlyPaidHours: number;
  /** 통상시급 = 월급 ÷ 월 소정근로시간 */
  hourlyOrdinaryWage: number;
  /** 1일 통상임금 = 통상시급 × 하루 근무시간 */
  dailyOrdinaryWage: number;
  /** 연차수당 = 미사용 연차일수 × 1일 통상임금 */
  annualLeavePay: number;
};

/** 입사일부터 기준일까지 "만으로 꽉 찬" 개월 수를 계산합니다(나이 계산과 동일한 방식). */
function monthsElapsed(start: Date, end: Date): number {
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(months, 0);
}

/**
 * 근속기간에 따른 법정 연차 발생일수를 계산합니다(근로기준법 제60조).
 * - 1년 미만: 1개월 개근할 때마다 1일씩 발생, 최대 11일(제2항)
 * - 1년 이상: 15일 + 최초 1년을 초과하는 매 2년마다 1일 가산, 최대 25일(제4항)
 *   예: 3~4년차 16일, 5~6년차 17일 … 21년차부터 25일(상한)
 */
export function calculateEntitledLeaveDays(totalServiceMonths: number): number {
  if (totalServiceMonths < 12) {
    return Math.min(totalServiceMonths, 11);
  }
  const years = Math.floor(totalServiceMonths / 12);
  const bonusDays = Math.floor((years - 1) / 2);
  return Math.min(15 + bonusDays, 25);
}

/**
 * 입사일·기준일·월급·근무조건·사용 연차일수를 입력하면
 * 발생 연차일수, 남은(미사용) 연차일수, 연차수당을 계산합니다.
 *
 * 연차수당 = 미사용 연차일수 × 1일 통상임금
 * 1일 통상임금 = (월급 ÷ 월 소정근로시간) × 하루 근무시간이며, 월 소정근로시간은
 * 최저임금·주휴수당 계산기와 같은 방식(주휴시간 포함, 주 40시간 기준 209시간)으로 구합니다.
 *
 * 예: 3년 근속(16일 발생), 월급 300만원, 하루8시간·주5일(월 209시간), 미사용 5일
 * → 통상시급 14,354원 × 8시간 = 1일 통상임금 114,833원 × 5일 ≈ 574,163원.
 */
export function calculateAnnualLeave(
  input: AnnualLeaveCalculatorInput
): AnnualLeaveCalculatorResult {
  const hireDate = new Date(`${input.hireDate}T00:00:00`);
  const referenceDate = new Date(`${input.referenceDate}T00:00:00`);
  const hasValidDates = !Number.isNaN(hireDate.getTime()) && !Number.isNaN(referenceDate.getTime());

  const totalServiceMonths = hasValidDates ? monthsElapsed(hireDate, referenceDate) : 0;
  const serviceYearsLabel = {
    years: Math.floor(totalServiceMonths / 12),
    months: totalServiceMonths % 12,
  };
  const isUnderOneYear = totalServiceMonths < 12;

  const totalEntitledDays = calculateEntitledLeaveDays(totalServiceMonths);
  const remainingLeaveDays = Math.max(totalEntitledDays - Math.max(input.usedLeaveDays, 0), 0);

  const { monthlyPaidHours } = calculateMonthlyPaidHours(input.dailyWorkHours, input.weeklyWorkDays);
  const monthlySalary = Math.max(input.monthlySalary, 0);
  const hourlyOrdinaryWage = monthlyPaidHours > 0 ? monthlySalary / monthlyPaidHours : 0;
  const dailyOrdinaryWage = hourlyOrdinaryWage * Math.max(input.dailyWorkHours, 0);
  const annualLeavePay = remainingLeaveDays * dailyOrdinaryWage;

  return {
    input,
    totalServiceMonths,
    serviceYearsLabel,
    isUnderOneYear,
    totalEntitledDays,
    remainingLeaveDays,
    monthlyPaidHours,
    hourlyOrdinaryWage,
    dailyOrdinaryWage,
    annualLeavePay,
  };
}
