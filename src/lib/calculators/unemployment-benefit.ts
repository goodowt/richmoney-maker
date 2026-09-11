import { UNEMPLOYMENT_BENEFIT_2026, PRESCRIBED_BENEFIT_DAYS } from "./rates";

export type UnemploymentBenefitCalculatorInput = {
  /** 이직 전 3개월 평균임금(1일 기준, 원) */
  averageDailyWage: number;
  /** 고용보험 가입기간(피보험기간) 중 "년" */
  insuredYears: number;
  /** 고용보험 가입기간(피보험기간) 중 "개월" */
  insuredMonths: number;
  /** 이직일 현재 50세 이상이거나 장애인인지 */
  isOver50OrDisabled: boolean;
  /** 비자발적 이직(권고사직·해고·계약만료·폐업 등)인지 */
  isInvoluntary: boolean;
};

export type UnemploymentBenefitCalculatorResult = {
  input: UnemploymentBenefitCalculatorInput;
  /** 총 피보험기간(개월) */
  totalInsuredMonths: number;
  /** 상하한액 적용 전, 평균임금의 60% */
  rawDailyBenefit: number;
  /** 상하한액 적용 후 1일 구직급여액 */
  dailyBenefit: number;
  /** 소정급여일수 */
  prescribedDays: number;
  /** 총 예상 수급액(1일 구직급여액 × 소정급여일수) */
  totalBenefit: number;
  /** 피보험기간이 최소 요건(180일, 약 6개월)에 못 미치는지 */
  isBelowMinimumInsuredPeriod: boolean;
};

/**
 * 총 피보험기간(개월)에 따른 소정급여일수를 구합니다(고용보험법 시행령 별표1).
 */
function findPrescribedDays(totalInsuredMonths: number, isOver50OrDisabled: boolean): number {
  const bracket =
    PRESCRIBED_BENEFIT_DAYS.find((b) => totalInsuredMonths < b.upToMonths) ??
    PRESCRIBED_BENEFIT_DAYS[PRESCRIBED_BENEFIT_DAYS.length - 1];
  return isOver50OrDisabled ? bracket.over50OrDisabled : bracket.under50;
}

/**
 * 구직급여(실업급여) 예상 수급액을 계산합니다(고용보험법 제45·46·50조).
 *
 * 1일 구직급여액 = 이직 전 평균임금 × 60%이며, 2026년 기준 상한 68,100원·
 * 하한 66,048원 사이로 제한됩니다. 총 예상 수급액 = 1일 구직급여액 × 소정급여일수
 * (연령·피보험기간에 따라 120~270일).
 *
 * 이 계산기는 금액을 추정할 뿐이며, 실제 수급자격(이직 사유의 정당성, 피보험단위
 * 기간 180일 이상 등)은 고용센터가 최종 판단합니다.
 *
 * 예: 평균임금 8만원(월급 약 240만원 수준), 근속 4년, 50세 미만
 * → 평균임금의 60%인 48,000원이 2026년 하한액(66,048원)보다 낮아 하한액이 적용됨
 * → 1일 구직급여 66,048원 × 소정급여일수 180일 = 11,888,640원.
 */
export function calculateUnemploymentBenefit(
  input: UnemploymentBenefitCalculatorInput
): UnemploymentBenefitCalculatorResult {
  const totalInsuredMonths =
    Math.max(input.insuredYears, 0) * 12 + Math.max(input.insuredMonths, 0);

  const averageDailyWage = Math.max(input.averageDailyWage, 0);
  const rawDailyBenefit = averageDailyWage * UNEMPLOYMENT_BENEFIT_2026.dailyBenefitRate;
  const dailyBenefit = Math.min(
    Math.max(rawDailyBenefit, UNEMPLOYMENT_BENEFIT_2026.dailyLowerLimit),
    UNEMPLOYMENT_BENEFIT_2026.dailyUpperLimit
  );

  const prescribedDays = findPrescribedDays(totalInsuredMonths, input.isOver50OrDisabled);
  const totalBenefit = dailyBenefit * prescribedDays;

  return {
    input,
    totalInsuredMonths,
    rawDailyBenefit,
    dailyBenefit,
    prescribedDays,
    totalBenefit,
    isBelowMinimumInsuredPeriod: totalInsuredMonths < 6,
  };
}
