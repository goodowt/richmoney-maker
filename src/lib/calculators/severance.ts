import {
  SERVICE_YEAR_DEDUCTION_BRACKETS,
  CONVERTED_SALARY_DEDUCTION_BRACKETS,
  INCOME_TAX_CONSTANTS,
} from "./rates";
import { progressiveTax } from "./tax-utils";

export type SeveranceCalculatorInput = {
  /** 입사일 (YYYY-MM-DD) */
  startDate: string;
  /** 퇴사일 (YYYY-MM-DD) */
  endDate: string;
  /** 1일 평균임금(원) — 퇴직 전 3개월 임금총액 ÷ 3개월 총일수 */
  averageDailyWage: number;
};

export type SeveranceCalculatorResult = {
  input: SeveranceCalculatorInput;
  serviceDays: number;
  serviceYears: number;
  /** 세법상 근속연수(1년 미만 올림, 최소 1년) */
  serviceYearsForTax: number;
  severancePay: number;
  tax: {
    serviceYearDeduction: number;
    convertedSalary: number;
    convertedSalaryDeduction: number;
    taxBase: number;
    convertedCalculatedTax: number;
    calculatedTax: number;
    localIncomeTax: number;
    total: number;
  };
  netSeverancePay: number;
};

function daysBetween(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function serviceYearDeduction(years: number) {
  const bracket =
    SERVICE_YEAR_DEDUCTION_BRACKETS.find((b) => years <= b.upToYears) ??
    SERVICE_YEAR_DEDUCTION_BRACKETS[SERVICE_YEAR_DEDUCTION_BRACKETS.length - 1];
  return Math.max(bracket.calc(years), 0);
}

function convertedSalaryDeduction(amount: number) {
  const bracket =
    CONVERTED_SALARY_DEDUCTION_BRACKETS.find((b) => amount <= b.upTo) ??
    CONVERTED_SALARY_DEDUCTION_BRACKETS[CONVERTED_SALARY_DEDUCTION_BRACKETS.length - 1];
  return Math.max(bracket.calc(amount), 0);
}

/**
 * 퇴직금과 퇴직소득세(현행 "환산급여" 방식, 2020년 이후 규정)를 계산합니다.
 *
 * 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
 * 퇴직소득세는 근속연수가 길수록, 퇴직금이 근속연수 대비 적을수록 세부담이
 * 크게 줄어드는 구조입니다(장기근속 우대). 근속연수공제 → 환산급여 → 환산급여공제
 * → 과세표준 → (근로소득세와 동일한 8단계 누진세율표 적용) → 근속연수만큼 재환산
 * 순서로 계산합니다.
 */
export function calculateSeverance(input: SeveranceCalculatorInput): SeveranceCalculatorResult {
  const serviceDays = Math.max(daysBetween(input.startDate, input.endDate), 0);
  const serviceYears = serviceDays / 365;
  const serviceYearsForTax = Math.max(Math.ceil(serviceYears), 1);

  const severancePay = input.averageDailyWage * 30 * serviceYears;

  const yearDeduction = serviceYearDeduction(serviceYearsForTax);
  const convertedSalary = Math.max(
    ((severancePay - yearDeduction) * 12) / serviceYearsForTax,
    0
  );
  const salaryDeduction = convertedSalaryDeduction(convertedSalary);
  const taxBase = Math.max(convertedSalary - salaryDeduction, 0);

  const convertedCalculatedTax = progressiveTax(taxBase);
  const calculatedTax = (convertedCalculatedTax * serviceYearsForTax) / 12;
  const localIncomeTax = calculatedTax * INCOME_TAX_CONSTANTS.localTaxRate;
  const totalTax = calculatedTax + localIncomeTax;

  return {
    input,
    serviceDays,
    serviceYears,
    serviceYearsForTax,
    severancePay,
    tax: {
      serviceYearDeduction: yearDeduction,
      convertedSalary,
      convertedSalaryDeduction: salaryDeduction,
      taxBase,
      convertedCalculatedTax,
      calculatedTax,
      localIncomeTax,
      total: totalTax,
    },
    netSeverancePay: severancePay - totalTax,
  };
}
