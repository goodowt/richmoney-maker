/**
 * 2026년 기준 4대보험 요율 및 소득세 계산에 필요한 상수.
 *
 * 매년(국민연금·건강보험은 통상 반기/연 단위) 요율이 바뀌므로, 새 연도가 되면
 * 이 파일의 값만 교체하면 되도록 계산 로직(salary.ts)과 분리해 두었습니다.
 *
 * 출처(2026-09 기준 확인):
 * - 국민연금 4.75%(근로자), 기준소득월액 상한 659만원/하한 41만원(2026.7~2027.6 적용)
 * - 건강보험 3.595%(근로자)
 * - 장기요양보험료율(건강보험료 대비) 13.14% — 보건복지부 2026년도 고시
 * - 고용보험 0.9%(근로자, 실업급여분) — 2025년과 동일, 산재보험은 사업주 전액 부담이라 제외
 */
export const INSURANCE_RATES_2026 = {
  year: 2026,
  nationalPension: {
    /** 근로자 부담률 (사업주도 동일하게 부담) */
    employeeRate: 0.0475,
    /** 기준소득월액 하한액 (2026.7~2027.6) */
    minMonthlyBase: 410_000,
    /** 기준소득월액 상한액 (2026.7~2027.6) */
    maxMonthlyBase: 6_590_000,
  },
  healthInsurance: {
    employeeRate: 0.03595,
  },
  longTermCare: {
    /** 건강보험료 대비 비율 (소득 대비 직접 요율은 약 0.9448%) */
    rateOfHealthInsurance: 0.1314,
  },
  employmentInsurance: {
    /** 실업급여분 — 근로자·사업주 동일 부담 */
    employeeRate: 0.009,
    employerUnemploymentRate: 0.009,
    /**
     * 고용안정·직업능력개발사업분 — 사업주만 100% 부담, 사업장 규모별 요율.
     * (실업급여 0.9%는 별도로 더해집니다)
     */
    employerStabilityRateByCompanySize: {
      under150: 0.0025,
      preferred150Plus: 0.0045,
      from150To1000: 0.0065,
      over1000OrPublic: 0.0085,
    },
  },
} as const;

export type CompanySize = keyof typeof INSURANCE_RATES_2026.employmentInsurance.employerStabilityRateByCompanySize;

export const COMPANY_SIZE_OPTIONS: { value: CompanySize; label: string }[] = [
  { value: "under150", label: "상시 150인 미만" },
  { value: "preferred150Plus", label: "150인 이상 (우선지원대상기업)" },
  { value: "from150To1000", label: "150인~1,000인 미만" },
  { value: "over1000OrPublic", label: "1,000인 이상 / 국가·지자체" },
];

/**
 * 근로소득 간이세액표 근사 계산에 쓰이는 소득세법 상수.
 * (근로소득공제·인적공제·세율표·근로소득세액공제는 매년 바뀌지 않는 편이라
 *  4대보험 요율보다는 변경 빈도가 낮습니다.)
 */
export const INCOME_TAX_CONSTANTS = {
  /** 기본공제: 부양가족 1인(본인 포함)당 연 150만원 */
  basicDeductionPerDependent: 1_500_000,
  /** 특별세액공제를 신청하지 않았다고 가정할 때 적용되는 표준세액공제(연) */
  standardTaxCredit: 130_000,
  /** 지방소득세 = 소득세의 10% */
  localTaxRate: 0.1,
} as const;

/** 근로소득공제 구간 (연간 총급여 기준) */
export const LABOR_INCOME_DEDUCTION_BRACKETS = [
  { upTo: 5_000_000, rate: 0.7, base: 0 },
  { upTo: 15_000_000, rate: 0.4, base: 3_500_000 },
  { upTo: 45_000_000, rate: 0.15, base: 7_500_000 },
  { upTo: 100_000_000, rate: 0.05, base: 12_000_000 },
  { upTo: Infinity, rate: 0.02, base: 14_750_000 },
] as const;

/** 종합소득세 초과누진세율표 (2023년 개정, 과세표준 기준·연간) */
export const PROGRESSIVE_TAX_BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, deduction: 0 },
  { upTo: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { upTo: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { upTo: Infinity, rate: 0.45, deduction: 65_940_000 },
] as const;

/**
 * 퇴직소득세 근속연수공제표 (2020년 이후 현행 규정, 국세청 고시 기준).
 * 근속연수는 1년 미만 端數를 1년으로 올림 처리한 값을 사용합니다.
 */
export const SERVICE_YEAR_DEDUCTION_BRACKETS = [
  { upToYears: 5, calc: (years: number) => years * 1_000_000 },
  { upToYears: 10, calc: (years: number) => 5_000_000 + (years - 5) * 2_000_000 },
  { upToYears: 20, calc: (years: number) => 15_000_000 + (years - 10) * 2_500_000 },
  { upToYears: Infinity, calc: (years: number) => 40_000_000 + (years - 20) * 3_000_000 },
] as const;

/** 퇴직소득세 환산급여공제표 (2020년 이후 현행 규정) */
export const CONVERTED_SALARY_DEDUCTION_BRACKETS = [
  { upTo: 8_000_000, calc: (amount: number) => amount },
  { upTo: 70_000_000, calc: (amount: number) => 8_000_000 + (amount - 8_000_000) * 0.6 },
  { upTo: 100_000_000, calc: (amount: number) => 45_200_000 + (amount - 70_000_000) * 0.55 },
  { upTo: 300_000_000, calc: (amount: number) => 61_700_000 + (amount - 100_000_000) * 0.45 },
  { upTo: Infinity, calc: (amount: number) => 151_700_000 + (amount - 300_000_000) * 0.35 },
] as const;

/** 근로소득세액공제 한도(연간 총급여 기준) */
export const LABOR_INCOME_TAX_CREDIT_LIMITS = [
  { upTo: 33_000_000, calc: () => 740_000 },
  {
    upTo: 70_000_000,
    calc: (gross: number) => Math.max(740_000 - (gross - 33_000_000) * 0.008, 660_000),
  },
  {
    upTo: 120_000_000,
    calc: (gross: number) => Math.max(660_000 - (gross - 70_000_000) * 0.5, 500_000),
  },
  {
    upTo: Infinity,
    calc: (gross: number) => Math.max(500_000 - (gross - 120_000_000) * 0.5, 200_000),
  },
] as const;

/**
 * 8세~20세 자녀 세액공제(월 간이세액표 기준 직접 차감액).
 * PLAN 요구사항에 맞춰 "20세 이하 자녀 수"를 그대로 입력받아 적용합니다.
 */
export function monthlyChildTaxCredit(childCount: number): number {
  if (childCount <= 0) return 0;
  if (childCount === 1) return 12_500;
  if (childCount === 2) return 29_160;
  return 29_160 + (childCount - 2) * 25_000;
}
