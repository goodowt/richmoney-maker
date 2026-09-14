import {
  INSURANCE_RATES_2026,
  INCOME_TAX_CONSTANTS,
  LABOR_INCOME_DEDUCTION_BRACKETS,
  LABOR_INCOME_TAX_CREDIT_LIMITS,
  monthlyChildTaxCredit,
} from "./rates";
import { calcBracketed, progressiveTax, clamp } from "./tax-utils";

export type SalaryCalculatorInput = {
  /** 연봉(세전, 원) */
  annualSalary: number;
  /** 월 비과세액(식대 등, 원) */
  monthlyNonTaxable: number;
  /** 부양가족 수(본인 포함) */
  dependents: number;
  /** 20세 이하 자녀 수 */
  childrenUnder20: number;
};

export type SalaryCalculatorResult = {
  input: SalaryCalculatorInput;
  monthlyGrossSalary: number;
  monthlyTaxableSalary: number;
  insurance: {
    nationalPension: number;
    healthInsurance: number;
    longTermCare: number;
    employmentInsurance: number;
    total: number;
  };
  tax: {
    /** 연간화한 과세대상 급여(월급여액×12) — 간이세액표 계산의 기준 */
    annualizedGrossForTax: number;
    laborIncomeDeduction: number;
    laborIncome: number;
    basicDeduction: number;
    pensionPremiumDeduction: number;
    specialDeduction: number;
    taxBase: number;
    calculatedTax: number;
    laborIncomeTaxCredit: number;
    standardTaxCredit: number;
    determinedAnnualTax: number;
    monthlyIncomeTaxBeforeChildCredit: number;
    childTaxCredit: number;
    monthlyIncomeTax: number;
    monthlyLocalIncomeTax: number;
  };
  monthlyDeductionTotal: number;
  monthlyNetSalary: number;
  annualNetSalary: number;
};

/** 근로소득공제(연간 총급여 기준). 연말정산 계산기(year-end-tax.ts)에서도 재사용합니다. */
export function laborIncomeDeduction(annualGross: number) {
  const amount = calcBracketed(annualGross, LABOR_INCOME_DEDUCTION_BRACKETS);
  // 근로소득공제는 2,000만원을 한도로 함
  return Math.min(amount, 20_000_000);
}

/** 근로소득세액공제(한도 포함). 연말정산 계산기(year-end-tax.ts)에서도 재사용합니다. */
export function laborIncomeTaxCredit(calculatedTax: number, annualGross: number) {
  const raw =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 1_300_000 * 0.55 + (calculatedTax - 1_300_000) * 0.3;

  const limitBracket =
    LABOR_INCOME_TAX_CREDIT_LIMITS.find((b) => annualGross <= b.upTo) ??
    LABOR_INCOME_TAX_CREDIT_LIMITS[LABOR_INCOME_TAX_CREDIT_LIMITS.length - 1];
  const limit = limitBracket.calc(annualGross);

  return Math.min(raw, limit);
}

/**
 * 연봉 실수령액을 계산합니다.
 *
 * 4대보험은 실제 요율을 그대로 적용하고, 소득세는 국세청 근로소득 간이세액표를
 * 다음 방식으로 근사합니다:
 *   1) 이번 달 과세대상 급여(비과세 제외) × 12를 "연간 급여"로 간주
 *   2) 근로소득공제 → 근로소득금액 산출
 *   3) 기본공제(부양가족×150만원), 연금보험료공제(국민연금 전액),
 *      특별소득공제(건강보험·장기요양보험·고용보험 전액)를 차감해 과세표준 산출
 *      — 이 두 공제는 실제로 전액 소득공제되는 항목이라, 이미 계산해 둔
 *        4대보험 근로자 부담액을 그대로 재사용합니다.
 *   4) 8단계 누진세율표로 산출세액 계산
 *   5) 근로소득세액공제(한도 포함) + 표준세액공제(13만원)를 차감해 결정세액 산출
 *   6) 결정세액을 12로 나눠 월 소득세로 환산, 자녀세액공제를 월 단위로 차감
 *
 * 실제 간이세액표는 국세청이 급여구간별로 별도 산정한 조견표이므로, 이 계산은
 * 근사치이며 실제 원천징수세액과 소폭(통상 월 1만~3만원 이내) 차이가 날 수 있습니다.
 */
export function calculateSalary(input: SalaryCalculatorInput): SalaryCalculatorResult {
  const monthlyGrossSalary = input.annualSalary / 12;
  const monthlyTaxableSalary = Math.max(monthlyGrossSalary - input.monthlyNonTaxable, 0);

  const pensionBase = clamp(
    monthlyTaxableSalary,
    INSURANCE_RATES_2026.nationalPension.minMonthlyBase,
    INSURANCE_RATES_2026.nationalPension.maxMonthlyBase
  );
  const nationalPension = Math.round(pensionBase * INSURANCE_RATES_2026.nationalPension.employeeRate);
  const healthInsurance = Math.round(
    monthlyTaxableSalary * INSURANCE_RATES_2026.healthInsurance.employeeRate
  );
  const longTermCare = Math.round(
    healthInsurance * INSURANCE_RATES_2026.longTermCare.rateOfHealthInsurance
  );
  const employmentInsurance = Math.round(
    monthlyTaxableSalary * INSURANCE_RATES_2026.employmentInsurance.employeeRate
  );
  const insuranceTotal = nationalPension + healthInsurance + longTermCare + employmentInsurance;

  const annualizedGrossForTax = monthlyTaxableSalary * 12;
  const deduction = laborIncomeDeduction(annualizedGrossForTax);
  const laborIncome = Math.max(annualizedGrossForTax - deduction, 0);

  const basicDeduction = INCOME_TAX_CONSTANTS.basicDeductionPerDependent * Math.max(input.dependents, 0);
  const pensionPremiumDeduction = nationalPension * 12;
  const specialDeduction = (healthInsurance + longTermCare + employmentInsurance) * 12;

  const taxBase = Math.max(
    laborIncome - basicDeduction - pensionPremiumDeduction - specialDeduction,
    0
  );

  const calculatedTax = progressiveTax(taxBase);
  const creditRaw = laborIncomeTaxCredit(calculatedTax, annualizedGrossForTax);
  const standardTaxCredit = Math.min(INCOME_TAX_CONSTANTS.standardTaxCredit, Math.max(calculatedTax - creditRaw, 0));
  const determinedAnnualTax = Math.max(calculatedTax - creditRaw - standardTaxCredit, 0);

  const monthlyIncomeTaxBeforeChildCredit = determinedAnnualTax / 12;
  const childTaxCredit = monthlyChildTaxCredit(Math.max(input.childrenUnder20, 0));
  const monthlyIncomeTax = Math.round(
    Math.max(monthlyIncomeTaxBeforeChildCredit - childTaxCredit, 0)
  );
  const monthlyLocalIncomeTax = Math.round(monthlyIncomeTax * INCOME_TAX_CONSTANTS.localTaxRate);

  const monthlyDeductionTotal = insuranceTotal + monthlyIncomeTax + monthlyLocalIncomeTax;
  const monthlyNetSalary = monthlyGrossSalary - monthlyDeductionTotal;

  return {
    input,
    monthlyGrossSalary,
    monthlyTaxableSalary,
    insurance: {
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      total: insuranceTotal,
    },
    tax: {
      annualizedGrossForTax,
      laborIncomeDeduction: deduction,
      laborIncome,
      basicDeduction,
      pensionPremiumDeduction,
      specialDeduction,
      taxBase,
      calculatedTax,
      laborIncomeTaxCredit: creditRaw,
      standardTaxCredit,
      determinedAnnualTax,
      monthlyIncomeTaxBeforeChildCredit,
      childTaxCredit,
      monthlyIncomeTax,
      monthlyLocalIncomeTax,
    },
    monthlyDeductionTotal,
    monthlyNetSalary,
    annualNetSalary: monthlyNetSalary * 12,
  };
}
