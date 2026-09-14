import {
  INSURANCE_RATES_2026,
  INCOME_TAX_CONSTANTS,
  CREDIT_CARD_DEDUCTION_2026,
  SPECIAL_TAX_CREDIT_RATES_2026,
  STANDARD_TAX_CREDIT_YEAR_END,
  HOUSING_SAVINGS_DEDUCTION_2026,
  MORTGAGE_INTEREST_DEDUCTION_OPTIONS,
  SME_TAX_REDUCTION_2026,
  annualChildTaxCredit,
  type MortgageTermType,
} from "./rates";
import { laborIncomeDeduction, laborIncomeTaxCredit } from "./salary";
import { progressiveTax, clamp } from "./tax-utils";

export type SmeTaxReductionType = "none" | "youth" | "other";

export type YearEndTaxCalculatorInput = {
  /** 총급여액(비과세 제외, 연간) */
  annualGrossSalary: number;
  /** 연간 기납부세액(원천징수영수증 결정세액 합계, 소득세+지방소득세) */
  totalWithheldTax: number;
  /** 부양가족 수(본인 포함, 기본공제 인원) */
  dependents: number;
  /** 8세~20세 기본공제대상 자녀 수 */
  childrenUnder20: number;
  /** 경로우대·장애인·한부모 공제 등 그 밖의 인적공제 합계(연간, 직접 입력) */
  additionalPersonalDeduction: number;

  /** 신용카드 사용액(연간) */
  creditCardSpending: number;
  /** 체크카드·현금영수증 사용액(연간) */
  checkCardAndCashReceiptSpending: number;
  /** 전통시장·대중교통 사용액(연간) */
  traditionalMarketAndTransitSpending: number;

  /** 의료비 지출액(연간) */
  medicalExpense: number;
  /** 본인·65세 이상 부양가족·장애인·난임시술비 등 한도 없는 대상인지 */
  isMedicalExpenseUnlimited: boolean;
  /** 취학전아동·초중고생 교육비(1인당 한도 적용 전 합계) */
  educationExpensePreCollege: number;
  /** 대학생(대학원 제외) 교육비 */
  educationExpenseUniversity: number;
  /** 보장성보험료(연간) */
  insurancePremium: number;
  /** 장애인전용보장성보험인지 */
  isDisabledInsurance: boolean;
  /** 기부금(연간) */
  donation: number;

  /** 연금저축 납입액(연간) */
  pensionSavingsContribution: number;
  /** IRP(개인형퇴직연금) 납입액(연간) */
  irpContribution: number;

  /** 무주택 세대주인지 */
  isNoHouseHousehold: boolean;
  /** 주택청약종합저축 납입액(연간) */
  housingSavingsContribution: number;
  /** 장기주택저당차입금 이자상환액(연간) */
  mortgageInterestPaid: number;
  /** 대출 상환기간·금리·상환방식 구분 */
  mortgageTermType: MortgageTermType;

  /** 월세액(연간 합계) */
  monthlyRentPaid: number;

  /** 중소기업 취업자 소득세 감면 대상 여부/유형 */
  smeTaxReductionType: SmeTaxReductionType;
};

export type YearEndTaxCalculatorResult = {
  input: YearEndTaxCalculatorInput;
  earnedIncomeDeduction: number;
  earnedIncome: number;
  insurance: {
    nationalPension: number;
    healthInsurance: number;
    longTermCare: number;
    employmentInsurance: number;
    total: number;
  };
  incomeDeductions: {
    basicDeduction: number;
    additionalPersonalDeduction: number;
    pensionPremiumDeduction: number;
    specialDeductionInsurance: number;
    creditCardDeduction: number;
    housingSavingsDeduction: number;
    mortgageInterestDeduction: number;
    total: number;
  };
  taxBase: number;
  calculatedTax: number;
  smeTaxReduction: number;
  taxCredits: {
    laborIncomeTaxCredit: number;
    childTaxCredit: number;
    /** 표준세액공제 또는 (보험료+의료비+교육비+기부금) 세액공제 중 실제 적용된 값 */
    standardOrItemizedCredit: number;
    insuranceCredit: number;
    medicalCredit: number;
    educationCredit: number;
    donationCredit: number;
    pensionAccountCredit: number;
    monthlyRentCredit: number;
    total: number;
  };
  determinedTax: number;
  localIncomeTax: number;
  totalDeterminedTaxWithLocal: number;
  /** 기납부세액 - 결정세액(지방소득세 포함). 양수면 환급, 음수면 추가납부 */
  refundOrDueAmount: number;
};

/** 신용카드 등 사용액 소득공제(소득세법 제126조의2). 최저사용금액(총급여 25%)을 공제율이
 * 낮은 항목(신용카드→체크카드/현금영수증→전통시장/대중교통 순)부터 채워 소진한 뒤,
 * 남은 초과분에 각 공제율을 적용합니다(가장 유리한 방식으로 국세청이 정산하는 것과 동일).
 */
function calculateCreditCardDeduction(params: {
  grossSalary: number;
  creditCardSpending: number;
  checkCardAndCashReceiptSpending: number;
  traditionalMarketAndTransitSpending: number;
}): number {
  const creditCardSpending = Math.max(params.creditCardSpending, 0);
  const checkCardSpending = Math.max(params.checkCardAndCashReceiptSpending, 0);
  const marketSpending = Math.max(params.traditionalMarketAndTransitSpending, 0);
  const totalSpending = creditCardSpending + checkCardSpending + marketSpending;

  const threshold = Math.max(params.grossSalary, 0) * CREDIT_CARD_DEDUCTION_2026.minSpendingRatio;
  if (totalSpending <= threshold) return 0;

  let remainingThreshold = threshold;
  const creditCardUsedForThreshold = Math.min(creditCardSpending, remainingThreshold);
  remainingThreshold -= creditCardUsedForThreshold;
  const creditCardExcess = creditCardSpending - creditCardUsedForThreshold;

  const checkCardUsedForThreshold = Math.min(checkCardSpending, remainingThreshold);
  remainingThreshold -= checkCardUsedForThreshold;
  const checkCardExcess = checkCardSpending - checkCardUsedForThreshold;

  const marketUsedForThreshold = Math.min(marketSpending, remainingThreshold);
  const marketExcess = marketSpending - marketUsedForThreshold;

  const baseLimitBracket =
    CREDIT_CARD_DEDUCTION_2026.baseLimitBrackets.find((b) => params.grossSalary <= b.upTo) ??
    CREDIT_CARD_DEDUCTION_2026.baseLimitBrackets[CREDIT_CARD_DEDUCTION_2026.baseLimitBrackets.length - 1];

  const baseCredit = Math.min(
    creditCardExcess * CREDIT_CARD_DEDUCTION_2026.creditCardRate +
      checkCardExcess * CREDIT_CARD_DEDUCTION_2026.checkCardOrCashReceiptRate,
    baseLimitBracket.limit
  );
  const extraCredit = Math.min(
    marketExcess * CREDIT_CARD_DEDUCTION_2026.traditionalMarketOrTransitRate,
    CREDIT_CARD_DEDUCTION_2026.extraLimit
  );

  return baseCredit + extraCredit;
}

/**
 * 연말정산(근로소득세 정산) 예상 결과를 계산합니다.
 *
 * 계산 순서(소득세법 기준을 근사): 총급여 → 근로소득공제 → 근로소득금액 → 종합소득공제
 * (인적공제 + 4대보험료 전액 + 신용카드 등 사용액 + 주택자금) → 과세표준 → 산출세액(8단계
 * 누진세율) → 세액감면(중소기업 취업자) → 세액공제(근로소득·자녀·보험료·의료비·교육비·
 * 기부금·연금계좌·월세) → 결정세액 → 지방소득세(10%) → 기납부세액과 비교해 환급/추가납부
 * 판정.
 *
 * 4대보험료는 salary.ts와 동일하게 "총급여÷12"를 월 보수액으로 간주해 근사하며, 인적공제는
 * 기본공제·자녀세액공제 외의 세부 항목(경로우대·장애인·한부모 등)은 "추가 인적공제" 입력값을
 * 그대로 소득공제에 더하는 방식으로 간이화했습니다. 실제 원천징수영수증과는 차이가 날 수
 * 있는 근사치입니다.
 */
export function calculateYearEndTax(input: YearEndTaxCalculatorInput): YearEndTaxCalculatorResult {
  const gross = Math.max(input.annualGrossSalary, 0);

  // 4대보험료(연간 근사): 월 보수액 = 총급여 ÷ 12
  const monthlyGross = gross / 12;
  const pensionBase = clamp(
    monthlyGross,
    INSURANCE_RATES_2026.nationalPension.minMonthlyBase,
    INSURANCE_RATES_2026.nationalPension.maxMonthlyBase
  );
  const nationalPension = Math.round(pensionBase * INSURANCE_RATES_2026.nationalPension.employeeRate) * 12;
  const healthInsurance = Math.round(monthlyGross * INSURANCE_RATES_2026.healthInsurance.employeeRate) * 12;
  const longTermCare = Math.round((healthInsurance / 12) * INSURANCE_RATES_2026.longTermCare.rateOfHealthInsurance) * 12;
  const employmentInsurance = Math.round(monthlyGross * INSURANCE_RATES_2026.employmentInsurance.employeeRate) * 12;
  const insuranceTotal = nationalPension + healthInsurance + longTermCare + employmentInsurance;

  // 근로소득공제 → 근로소득금액
  const earnedIncomeDeduction = laborIncomeDeduction(gross);
  const earnedIncome = Math.max(gross - earnedIncomeDeduction, 0);

  // 종합소득공제
  const basicDeduction = INCOME_TAX_CONSTANTS.basicDeductionPerDependent * Math.max(input.dependents, 0);
  const additionalPersonalDeduction = Math.max(input.additionalPersonalDeduction, 0);
  const pensionPremiumDeduction = nationalPension;
  const specialDeductionInsurance = healthInsurance + longTermCare + employmentInsurance;

  const creditCardDeduction = calculateCreditCardDeduction({
    grossSalary: gross,
    creditCardSpending: input.creditCardSpending,
    checkCardAndCashReceiptSpending: input.checkCardAndCashReceiptSpending,
    traditionalMarketAndTransitSpending: input.traditionalMarketAndTransitSpending,
  });

  const housingSavingsDeduction =
    input.isNoHouseHousehold && gross <= HOUSING_SAVINGS_DEDUCTION_2026.incomeLimit
      ? Math.min(Math.max(input.housingSavingsContribution, 0), HOUSING_SAVINGS_DEDUCTION_2026.contributionLimit) *
        HOUSING_SAVINGS_DEDUCTION_2026.rate
      : 0;

  const mortgageLimit =
    MORTGAGE_INTEREST_DEDUCTION_OPTIONS.find((o) => o.value === input.mortgageTermType)?.limit ?? 0;
  const mortgageInterestDeduction = input.isNoHouseHousehold
    ? Math.min(Math.max(input.mortgageInterestPaid, 0), mortgageLimit)
    : 0;

  const totalIncomeDeduction =
    basicDeduction +
    additionalPersonalDeduction +
    pensionPremiumDeduction +
    specialDeductionInsurance +
    creditCardDeduction +
    housingSavingsDeduction +
    mortgageInterestDeduction;

  const taxBase = Math.max(earnedIncome - totalIncomeDeduction, 0);
  const calculatedTax = progressiveTax(taxBase);

  // 세액감면: 중소기업 취업자 소득세 감면(청년 90%·5년 / 그 외 70%·3년, 과세기간 한도 200만원)
  const smeRate =
    input.smeTaxReductionType === "youth"
      ? SME_TAX_REDUCTION_2026.youthRate
      : input.smeTaxReductionType === "other"
        ? SME_TAX_REDUCTION_2026.otherRate
        : 0;
  const smeTaxReduction = Math.min(calculatedTax * smeRate, SME_TAX_REDUCTION_2026.annualLimit);

  // 세액공제
  const laborCredit = laborIncomeTaxCredit(calculatedTax, gross);
  const childCredit = annualChildTaxCredit(input.childrenUnder20);

  const insuranceCredit =
    Math.min(Math.max(input.insurancePremium, 0), SPECIAL_TAX_CREDIT_RATES_2026.insurancePremium.limit) *
    (input.isDisabledInsurance
      ? SPECIAL_TAX_CREDIT_RATES_2026.insurancePremium.disabledRate
      : SPECIAL_TAX_CREDIT_RATES_2026.insurancePremium.rate);

  const medicalExcess = Math.max(
    Math.max(input.medicalExpense, 0) - gross * SPECIAL_TAX_CREDIT_RATES_2026.medicalExpense.thresholdRatio,
    0
  );
  const medicalCappedExcess = input.isMedicalExpenseUnlimited
    ? medicalExcess
    : Math.min(medicalExcess, SPECIAL_TAX_CREDIT_RATES_2026.medicalExpense.generalLimit);
  const medicalCredit = medicalCappedExcess * SPECIAL_TAX_CREDIT_RATES_2026.medicalExpense.rate;

  const educationCredit =
    (Math.min(Math.max(input.educationExpensePreCollege, 0), SPECIAL_TAX_CREDIT_RATES_2026.education.preCollegeLimitPerPerson) +
      Math.min(Math.max(input.educationExpenseUniversity, 0), SPECIAL_TAX_CREDIT_RATES_2026.education.universityLimitPerPerson)) *
    SPECIAL_TAX_CREDIT_RATES_2026.education.rate;

  const donation = Math.max(input.donation, 0);
  const donationCredit =
    donation <= SPECIAL_TAX_CREDIT_RATES_2026.donation.highThreshold
      ? donation * SPECIAL_TAX_CREDIT_RATES_2026.donation.rate
      : SPECIAL_TAX_CREDIT_RATES_2026.donation.highThreshold * SPECIAL_TAX_CREDIT_RATES_2026.donation.rate +
        (donation - SPECIAL_TAX_CREDIT_RATES_2026.donation.highThreshold) *
          SPECIAL_TAX_CREDIT_RATES_2026.donation.highRate;

  // 특별소득공제(주택자금)·특별세액공제(보험료·의료비·교육비·기부금)를 하나라도 신청했다면
  // 표준세액공제(13만원) 대신 실제 공제액 합계를 적용합니다.
  const hasItemizedSpecialDeductions =
    input.housingSavingsContribution > 0 ||
    input.mortgageInterestPaid > 0 ||
    input.insurancePremium > 0 ||
    input.medicalExpense > 0 ||
    input.educationExpensePreCollege > 0 ||
    input.educationExpenseUniversity > 0 ||
    input.donation > 0;
  const itemizedSpecialCreditSum = insuranceCredit + medicalCredit + educationCredit + donationCredit;
  const standardOrItemizedCredit = hasItemizedSpecialDeductions
    ? itemizedSpecialCreditSum
    : STANDARD_TAX_CREDIT_YEAR_END;

  const pensionRate =
    gross <= SPECIAL_TAX_CREDIT_RATES_2026.pensionAccount.highRateIncomeLimit
      ? SPECIAL_TAX_CREDIT_RATES_2026.pensionAccount.highRate
      : SPECIAL_TAX_CREDIT_RATES_2026.pensionAccount.lowRate;
  const eligiblePensionSavings = Math.min(
    Math.max(input.pensionSavingsContribution, 0),
    SPECIAL_TAX_CREDIT_RATES_2026.pensionAccount.pensionSavingsOnlyLimit
  );
  const eligiblePensionTotal = Math.min(
    eligiblePensionSavings + Math.max(input.irpContribution, 0),
    SPECIAL_TAX_CREDIT_RATES_2026.pensionAccount.totalLimit
  );
  const pensionAccountCredit = eligiblePensionTotal * pensionRate;

  const rentEligible =
    input.isNoHouseHousehold && gross <= SPECIAL_TAX_CREDIT_RATES_2026.monthlyRent.eligibleIncomeLimit;
  const rentRate =
    gross <= SPECIAL_TAX_CREDIT_RATES_2026.monthlyRent.highRateIncomeLimit
      ? SPECIAL_TAX_CREDIT_RATES_2026.monthlyRent.highRate
      : SPECIAL_TAX_CREDIT_RATES_2026.monthlyRent.lowRate;
  const monthlyRentCredit = rentEligible
    ? Math.min(Math.max(input.monthlyRentPaid, 0), SPECIAL_TAX_CREDIT_RATES_2026.monthlyRent.annualLimit) * rentRate
    : 0;

  const totalTaxCredits =
    laborCredit + childCredit + standardOrItemizedCredit + pensionAccountCredit + monthlyRentCredit;

  const determinedTax = Math.max(calculatedTax - smeTaxReduction - totalTaxCredits, 0);
  const localIncomeTax = Math.round(determinedTax * INCOME_TAX_CONSTANTS.localTaxRate);
  const totalDeterminedTaxWithLocal = determinedTax + localIncomeTax;

  const refundOrDueAmount = Math.max(input.totalWithheldTax, 0) - totalDeterminedTaxWithLocal;

  return {
    input,
    earnedIncomeDeduction,
    earnedIncome,
    insurance: {
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      total: insuranceTotal,
    },
    incomeDeductions: {
      basicDeduction,
      additionalPersonalDeduction,
      pensionPremiumDeduction,
      specialDeductionInsurance,
      creditCardDeduction,
      housingSavingsDeduction,
      mortgageInterestDeduction,
      total: totalIncomeDeduction,
    },
    taxBase,
    calculatedTax,
    smeTaxReduction,
    taxCredits: {
      laborIncomeTaxCredit: laborCredit,
      childTaxCredit: childCredit,
      standardOrItemizedCredit,
      insuranceCredit,
      medicalCredit,
      educationCredit,
      donationCredit,
      pensionAccountCredit,
      monthlyRentCredit,
      total: totalTaxCredits,
    },
    determinedTax,
    localIncomeTax,
    totalDeterminedTaxWithLocal,
    refundOrDueAmount,
  };
}
