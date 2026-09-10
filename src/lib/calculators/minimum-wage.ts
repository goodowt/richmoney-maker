import { MINIMUM_WAGE_2026 } from "./rates";
import { calculateWeeklyHolidayHours } from "./weekly-holiday-pay";

export type MinimumWageCalculatorInput = {
  /** 시급(원) */
  hourlyWage: number;
  /** 하루 소정근로시간 */
  dailyWorkHours: number;
  /** 주 근무일수 */
  weeklyWorkDays: number;
};

export type MinimumWageCalculatorResult = {
  input: MinimumWageCalculatorInput;
  weeklyWorkHours: number;
  /** 주휴시간(주 15시간 이상 근무 시 발생, 최대 8시간) */
  weeklyHolidayHours: number;
  /** 주휴 포함 유급 근로시간 */
  weeklyPaidHours: number;
  /** 월 환산 유급 근로시간 (주휴 포함) */
  monthlyPaidHours: number;
  monthlyWage: number;
  annualWage: number;
  minimumHourlyWage: number;
  isBelowMinimumWage: boolean;
  /** 최저임금 미달 시, 시급 기준 부족액(원) */
  hourlyShortfall: number;
  /** 최저임금 미달 시, 월 환산 부족액(원) */
  monthlyShortfall: number;
};

const WEEKS_PER_MONTH = 365 / 7 / 12; // ≈ 4.345

/**
 * 시급을 입력하면 주휴수당을 포함한 월 환산 급여를 계산하고,
 * 2026년 최저임금(시간급 10,320원) 대비 위반 여부를 확인합니다.
 *
 * 주휴수당: 1주 소정근로시간이 15시간 이상이면 발생하며,
 * 주휴시간 = (주 근로시간 ÷ 40) × 8시간 (최대 8시간, 근로기준법 제55조).
 * 월 환산 근로시간은 주 단위 유급 시간에 "1년 평균 주 수(365÷7÷12 ≈ 4.345)"를
 * 곱한 뒤 정수로 반올림해 구합니다(주 40시간 기준으로는 208.57…시간이 나오고,
 * 이를 반올림한 209시간이 실무에서 널리 쓰이는 표준 월 근로시간입니다.
 * 예: 시급 10,320원 × 209시간 = 2,156,880원, 2026년 고용노동부 발표 최저월급과 일치).
 */
export function calculateMinimumWage(
  input: MinimumWageCalculatorInput
): MinimumWageCalculatorResult {
  const weeklyWorkHours = Math.max(input.dailyWorkHours, 0) * Math.max(input.weeklyWorkDays, 0);

  const weeklyHolidayHours = calculateWeeklyHolidayHours(weeklyWorkHours);

  const weeklyPaidHours = weeklyWorkHours + weeklyHolidayHours;
  const monthlyPaidHours = Math.round(weeklyPaidHours * WEEKS_PER_MONTH);

  const hourlyWage = Math.max(input.hourlyWage, 0);
  const monthlyWage = hourlyWage * monthlyPaidHours;
  const annualWage = monthlyWage * 12;

  const minimumHourlyWage = MINIMUM_WAGE_2026.hourlyWage;
  const isBelowMinimumWage = hourlyWage < minimumHourlyWage;
  const hourlyShortfall = Math.max(minimumHourlyWage - hourlyWage, 0);
  const monthlyShortfall = hourlyShortfall * monthlyPaidHours;

  return {
    input,
    weeklyWorkHours,
    weeklyHolidayHours,
    weeklyPaidHours,
    monthlyPaidHours,
    monthlyWage,
    annualWage,
    minimumHourlyWage,
    isBelowMinimumWage,
    hourlyShortfall,
    monthlyShortfall,
  };
}
