const WEEKS_PER_MONTH = 365 / 7 / 12; // ≈ 4.345

/**
 * 주휴시간을 계산합니다. 1주 소정근로시간이 15시간 이상이면 발생하며,
 * 주휴시간 = (주 근로시간 ÷ 40) × 8시간 (최대 8시간, 근로기준법 제55조).
 *
 * 최저임금 계산기(minimum-wage.ts)의 월 환산 근로시간 계산에도 재사용됩니다.
 */
export function calculateWeeklyHolidayHours(weeklyWorkHours: number): number {
  return weeklyWorkHours >= 15 ? Math.min((weeklyWorkHours / 40) * 8, 8) : 0;
}

export type MonthlyPaidHours = {
  weeklyWorkHours: number;
  weeklyHolidayHours: number;
  /** 주휴 포함 유급 근로시간(주) */
  weeklyPaidHours: number;
  /** 월 환산 유급 근로시간(주휴 포함). 주 40시간 기준 209시간 */
  monthlyPaidHours: number;
};

/**
 * 하루 근무시간·주 근무일수로 "월 환산 유급 근로시간"(주휴시간 포함)을 계산합니다.
 * 최저임금 계산기의 월급 환산, 연차수당 계산기의 통상시급 환산(월급 ÷ 월 소정근로시간)에
 * 공통으로 쓰이는 값이라 여기서 한 번만 계산하도록 분리했습니다.
 */
export function calculateMonthlyPaidHours(
  dailyWorkHours: number,
  weeklyWorkDays: number
): MonthlyPaidHours {
  const weeklyWorkHours = Math.max(dailyWorkHours, 0) * Math.max(weeklyWorkDays, 0);
  const weeklyHolidayHours = calculateWeeklyHolidayHours(weeklyWorkHours);
  const weeklyPaidHours = weeklyWorkHours + weeklyHolidayHours;
  const monthlyPaidHours = Math.round(weeklyPaidHours * WEEKS_PER_MONTH);

  return { weeklyWorkHours, weeklyHolidayHours, weeklyPaidHours, monthlyPaidHours };
}

export type WeeklyHolidayPayInput = {
  /** 시급(원) */
  hourlyWage: number;
  /** 하루 소정근로시간 */
  dailyWorkHours: number;
  /** 주 근무일수 */
  weeklyWorkDays: number;
  /** 그 주 소정근로일에 결근 없이 개근했는지 여부 (근로기준법 시행령 제30조) */
  isFullAttendance: boolean;
};

export type WeeklyHolidayPayResult = {
  input: WeeklyHolidayPayInput;
  weeklyWorkHours: number;
  /** 주 15시간 이상 요건 충족 여부 */
  meetsHoursRequirement: boolean;
  /** 시간 요건 + 개근 요건을 모두 충족해 주휴수당이 발생하는지 */
  isEligible: boolean;
  weeklyHolidayHours: number;
  /** 1주치 주휴수당 */
  weeklyHolidayPay: number;
  /** 월 환산 주휴수당 (주휴수당 × 4.345주) */
  monthlyHolidayPay: number;
  /** 연 환산 주휴수당 */
  annualHolidayPay: number;
};

/**
 * 시급과 근무 조건을 입력하면 주휴수당을 계산합니다.
 *
 * 주휴수당 = 주휴시간 × 시급. 1주 소정근로시간이 15시간 이상이고, 그 주 소정근로일에
 * 결근 없이 개근했을 때 발생합니다(근로기준법 제55조, 같은 법 시행령 제30조).
 * 정규직·아르바이트 구분 없이 요건을 충족하면 지급 의무가 있습니다.
 *
 * 예: 시급 10,320원 × 주 40시간(하루 8시간×5일) 근무 → 주휴시간 8시간 →
 * 주휴수당 82,560원/주, 월 환산 약 358,723원(82,560원 × 4.345주).
 */
export function calculateWeeklyHolidayPay(
  input: WeeklyHolidayPayInput
): WeeklyHolidayPayResult {
  const weeklyWorkHours = Math.max(input.dailyWorkHours, 0) * Math.max(input.weeklyWorkDays, 0);
  const meetsHoursRequirement = weeklyWorkHours >= 15;
  const isEligible = meetsHoursRequirement && input.isFullAttendance;

  const weeklyHolidayHours = isEligible ? calculateWeeklyHolidayHours(weeklyWorkHours) : 0;

  const hourlyWage = Math.max(input.hourlyWage, 0);
  const weeklyHolidayPay = weeklyHolidayHours * hourlyWage;
  const monthlyHolidayPay = Math.round(weeklyHolidayPay * WEEKS_PER_MONTH);
  const annualHolidayPay = monthlyHolidayPay * 12;

  return {
    input,
    weeklyWorkHours,
    meetsHoursRequirement,
    isEligible,
    weeklyHolidayHours,
    weeklyHolidayPay,
    monthlyHolidayPay,
    annualHolidayPay,
  };
}
