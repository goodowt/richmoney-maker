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

/**
 * 2026년 적용 최저임금 (고용노동부 2025-08-05 고시).
 * 시간급 10,320원, 전년 대비 290원(2.9%) 인상. 2026-01-01 ~ 2026-12-31 적용.
 * 출처: https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144
 */
export const MINIMUM_WAGE_2026 = {
  year: 2026,
  hourlyWage: 10_320,
  /** 주 40시간 근무(주휴 8시간 포함) 기준 월 환산 근로시간 */
  standardMonthlyHours: 209,
} as const;

/**
 * 프리랜서(사업소득) 원천징수세율. 소득세법 제129조 제1항 제2호에 따라
 * 인적용역 사업소득 지급액의 3%를 소득세로 원천징수하고, 지방소득세는
 * 소득세의 10%(=지급액의 0.3%)를 더해 원천징수합니다(지방세법 제103조의13).
 * 소득세 3% + 지방소득세 0.3% = 총 3.3%로 흔히 "프리랜서 3.3%"라고 부릅니다.
 * 지방소득세율은 근로소득 계산과 동일하게 INCOME_TAX_CONSTANTS.localTaxRate(10%)를 사용합니다.
 */
export const FREELANCE_WITHHOLDING_INCOME_TAX_RATE = 0.03;

/**
 * 2026년 구직급여(실업급여) 산정 기준(고용보험법 제45·46조).
 *
 * 구직급여일액 = 이직 전 평균임금 × 60%이며, 상한액·하한액 사이로 제한됩니다.
 * 하한액은 이직 당시 최저임금(시간급)의 80% × 1일 소정근로시간(8시간)으로 정해져
 * 최저임금과 함께 매년 바뀝니다(2026년: 10,320원×0.8×8=66,048원).
 * 상한액은 고용노동부가 별도로 고시하며, 2026년 1월 1일 이후 이직자부터 68,100원이
 * 적용됩니다(2025년 66,000원에서 인상).
 * 출처: 고용노동부 발표(2026년 구직급여 상한·하한액 조정).
 */
export const UNEMPLOYMENT_BENEFIT_2026 = {
  year: 2026,
  /** 구직급여일액 = 평균임금 × 60% */
  dailyBenefitRate: 0.6,
  /** 1일 상한액 */
  dailyUpperLimit: 68_100,
  /** 1일 하한액(=최저시급×80%×8시간) */
  dailyLowerLimit: 66_048,
} as const;

/**
 * 구직급여 소정급여일수(고용보험법 시행령 별표1, 2019.10.1 개정 기준 현행).
 * 이직일 현재 연령과 고용보험 피보험기간(가입기간)에 따라 정해집니다.
 * upToMonths는 "미만" 기준 상한(예: 12 → 피보험기간 1년 미만)입니다.
 */
export const PRESCRIBED_BENEFIT_DAYS = [
  { upToMonths: 12, under50: 120, over50OrDisabled: 120 },
  { upToMonths: 36, under50: 150, over50OrDisabled: 180 },
  { upToMonths: 60, under50: 180, over50OrDisabled: 210 },
  { upToMonths: 120, under50: 210, over50OrDisabled: 240 },
  { upToMonths: Infinity, under50: 240, over50OrDisabled: 270 },
] as const;

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

/**
 * 연말정산 자녀세액공제(연간 확정 금액, 소득세법 제59조의2, 2024년 개정 상향분 반영).
 * 8세 이상 기본공제대상 자녀 수 기준으로, 월 간이세액표에서 쓰는 monthlyChildTaxCredit과는
 * 금액 체계가 달라 별도 상수로 둡니다(연말정산은 실제 연간 확정치를 그대로 적용).
 * 1명 25만원, 2명 55만원, 3명째부터 1인당 40만원씩 가산.
 */
export function annualChildTaxCredit(childCount: number): number {
  const n = Math.max(0, Math.floor(childCount));
  if (n === 0) return 0;
  if (n === 1) return 250_000;
  if (n === 2) return 550_000;
  return 550_000 + (n - 2) * 400_000;
}

/**
 * 연말정산 "그 밖의 소득공제·세액공제" 항목별 2026년 기준 요율·한도.
 * (근로소득세액공제·자녀세액공제·기본공제 등 기존 상수는 위쪽 것을 그대로 재사용)
 *
 * 출처(2026-09 확인):
 * - 신용카드 등 사용액 소득공제: 국세청 연말정산 안내(소득세법 제126조의2)
 * - 의료비·교육비·보험료·기부금 세액공제율: 국세청 연말정산 안내(소득세법 제59조의4)
 * - 연금계좌 세액공제: 국세청·금융권 공통 안내(소득세법 제59조의3, 900만원 한도는 2023년 개정)
 * - 월세액 세액공제: 국세청 안내(2025년 귀속 기준 현행 한도 1,000만원 — 2026년 세제개편안의
 *   1,200만원 확대는 국회 심의 중이라 미반영, 확정되면 갱신 필요)
 */
export const CREDIT_CARD_DEDUCTION_2026 = {
  /** 총급여의 이 비율을 초과해 쓴 금액부터 공제 대상 */
  minSpendingRatio: 0.25,
  creditCardRate: 0.15,
  checkCardOrCashReceiptRate: 0.3,
  traditionalMarketOrTransitRate: 0.4,
  /** 기본공제 한도(전통시장·대중교통 추가한도 제외), 총급여 구간별 */
  baseLimitBrackets: [
    { upTo: 70_000_000, limit: 3_000_000 },
    { upTo: 120_000_000, limit: 2_500_000 },
    { upTo: Infinity, limit: 2_000_000 },
  ],
  /**
   * 전통시장·대중교통·도서공연 등 각각 최대 100만원(총급여 7천만원 이하는 도서공연 포함
   * 최대 300만원)씩 별도 추가한도가 있으나, 이 계산기는 "전통시장·대중교통" 사용액을
   * 하나로 합쳐 입력받는 대신 추가한도도 합산 300만원으로 간이화했습니다.
   */
  extraLimit: 3_000_000,
} as const;

export const SPECIAL_TAX_CREDIT_RATES_2026 = {
  medicalExpense: {
    rate: 0.15,
    /** 총급여의 이 비율을 초과한 지출분만 공제 대상 */
    thresholdRatio: 0.03,
    /** 본인·65세 이상 부양가족·장애인·난임시술비 등은 한도 없음(간이화: 체크박스로 선택) */
    generalLimit: 7_000_000,
  },
  education: {
    rate: 0.15,
    /** 대학생(대학원 제외) 1인당 한도 */
    universityLimitPerPerson: 9_000_000,
    /** 취학전아동·초중고생 1인당 한도(본인은 전액 한도 없음이나 이 계산기는 부양가족 학비로 간주) */
    preCollegeLimitPerPerson: 3_000_000,
  },
  insurancePremium: {
    rate: 0.12,
    disabledRate: 0.15,
    limit: 1_000_000,
  },
  donation: {
    rate: 0.15,
    highRate: 0.3,
    highThreshold: 10_000_000,
  },
  pensionAccount: {
    /** 총급여 이 금액 이하면 15%, 초과하면 12% */
    highRateIncomeLimit: 55_000_000,
    highRate: 0.15,
    lowRate: 0.12,
    /** 연금저축+IRP 합산 한도 */
    totalLimit: 9_000_000,
    /** 연금저축 단독 한도(IRP 없이 연금저축만으로 채울 수 있는 최대치) */
    pensionSavingsOnlyLimit: 6_000_000,
  },
  monthlyRent: {
    /** 이 총급여를 넘으면 대상 제외 */
    eligibleIncomeLimit: 80_000_000,
    /** 이 총급여 이하면 17%, 초과(8천만원 이하까지)면 15% */
    highRateIncomeLimit: 55_000_000,
    highRate: 0.17,
    lowRate: 0.15,
    annualLimit: 10_000_000,
  },
} as const;

/** 표준세액공제(특별소득공제·특별세액공제를 신청하지 않았을 때 대신 적용) */
export const STANDARD_TAX_CREDIT_YEAR_END = 130_000;

/** 주택청약종합저축 소득공제(무주택 세대주, 총급여 7천만원 이하) */
export const HOUSING_SAVINGS_DEDUCTION_2026 = {
  incomeLimit: 70_000_000,
  rate: 0.4,
  contributionLimit: 3_000_000,
} as const;

export type MortgageTermType =
  | "over15FixedAndNonBullet"
  | "over15OneOfFixedOrNonBullet"
  | "over15Other"
  | "from10To15FixedOrNonBullet"
  | "from10To15Other";

/**
 * 장기주택저당차입금 이자상환액 소득공제 한도(상환기간·금리·상환방식별, 2024년 개정 기준).
 * 무주택(또는 1주택) 세대주가 취득 당시 기준시가 6억원 이하 주택을 담보로 한 대출만 대상.
 */
export const MORTGAGE_INTEREST_DEDUCTION_OPTIONS: {
  value: MortgageTermType;
  label: string;
  limit: number;
}[] = [
  {
    value: "over15FixedAndNonBullet",
    label: "상환기간 15년 이상 · 고정금리 + 비거치식분할상환",
    limit: 20_000_000,
  },
  {
    value: "over15OneOfFixedOrNonBullet",
    label: "상환기간 15년 이상 · 고정금리 또는 비거치식 중 하나만",
    limit: 18_000_000,
  },
  {
    value: "over15Other",
    label: "상환기간 15년 이상 · 그 외(변동금리+거치식 등)",
    limit: 8_000_000,
  },
  {
    value: "from10To15FixedOrNonBullet",
    label: "상환기간 10년~15년 미만 · 고정금리 또는 비거치식",
    limit: 6_000_000,
  },
  {
    value: "from10To15Other",
    label: "상환기간 10년~15년 미만 · 그 외",
    limit: 3_000_000,
  },
];

/**
 * 중소기업 취업자 소득세 감면(조세특례제한법 제30조, 2026-12-31까지 취업분 적용).
 * 청년(만 15~34세, 병역기간 최대 6년 차감)은 90%·5년, 60세 이상·장애인·경력단절여성은
 * 70%·3년 감면되며, 과세기간별 한도는 200만원으로 동일합니다.
 */
export const SME_TAX_REDUCTION_2026 = {
  youthRate: 0.9,
  otherRate: 0.7,
  annualLimit: 2_000_000,
} as const;
