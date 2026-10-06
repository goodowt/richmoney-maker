import {
  INSURANCE_RATES_2026,
  INCOME_TAX_CONSTANTS,
  LABOR_INCOME_DEDUCTION_BRACKETS,
  LABOR_INCOME_TAX_CREDIT_LIMITS,
  SIMPLIFIED_TAX_TABLE_2026,
  monthlyChildTaxCredit,
} from "./rates";
import { calcBracketed, progressiveTax, clamp } from "./tax-utils";

export type SalaryCalculatorInput = {
  /** 연봉(세전, 원) */
  annualSalary: number;
  /** 월 비과세액(식대 등, 원) */
  monthlyNonTaxable: number;
  /** 부양가족 수(본인 포함) — 간이세액표의 "공제대상가족의 수" */
  dependents: number;
  /** 8세 이상 20세 이하 자녀 수 */
  childrenUnder20: number;
};

/** 간이세액표 세액(자녀 공제 전)과 그 계산 과정 */
export type SimplifiedTaxTableResult = {
  /** 표에서 찾은 급여구간의 가운데 금액(1,000만원 이상이면 1,000만원) — 세액 계산의 기준 */
  tableMonthlySalary: number;
  /** tableMonthlySalary × 12 */
  annualizedGrossForTax: number;
  laborIncomeDeduction: number;
  laborIncome: number;
  basicDeduction: number;
  pensionPremiumDeduction: number;
  /** 특별소득공제 및 특별세액공제 중 일부(별표2 제1호 계산식) */
  specialDeduction: number;
  taxBase: number;
  calculatedTax: number;
  laborIncomeTaxCredit: number;
  determinedAnnualTax: number;
  /** 월급여 1,000만원 초과분에 대해 더해지는 세액(초과하지 않으면 0) */
  highIncomeAddition: number;
  /** 간이세액표의 해당 세액(자녀 공제 전, 월) */
  monthlyIncomeTaxBeforeChildCredit: number;
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
  tax: SimplifiedTaxTableResult & {
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

/**
 * 근로소득세액공제(한도 포함, 현행 소득세법 제59조). 연말정산 계산기(year-end-tax.ts)가 씁니다.
 * 간이세액표는 이 기준이 아니라 tableLaborIncomeTaxCredit의 기준으로 만들어져 있습니다.
 */
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

const TABLE = SIMPLIFIED_TAX_TABLE_2026;

/** 부동소수점 오차로 x.9999…가 한 단계 아래로 떨어지지 않게 보정한 뒤 10원 미만을 버립니다. */
function floorToTen(amount: number) {
  return Math.floor((amount + 1e-6) / 10) * 10;
}

/** 간이세액표가 쓰는 근로소득세액공제(연말정산용 laborIncomeTaxCredit과 기준이 다릅니다). */
function tableLaborIncomeTaxCredit(calculatedTax: number, annualGross: number) {
  const { threshold, lowRate, highRate } = TABLE.laborIncomeTaxCredit;
  const raw =
    calculatedTax <= threshold
      ? calculatedTax * lowRate
      : threshold * lowRate + (calculatedTax - threshold) * highRate;

  const limits = TABLE.laborIncomeTaxCreditLimits;
  const limitBracket = limits.find((b) => annualGross <= b.upTo) ?? limits[limits.length - 1];

  return Math.min(raw, limitBracket.calc(annualGross));
}

/** 특별소득공제 및 특별세액공제 중 일부(별표2 제1호 계산식) */
function tableSpecialDeduction(annualGross: number, dependents: number) {
  const { grossThresholds, phaseOutRate, byDependents } = TABLE.specialDeduction;
  const rule =
    byDependents.find((r) => dependents <= r.maxDependents) ?? byDependents[byDependents.length - 1];

  const bracketIndex = grossThresholds.findIndex((upTo) => annualGross <= upTo);
  const rate = rule.rates[bracketIndex === -1 ? grossThresholds.length : bracketIndex];

  let amount = rule.base + annualGross * rate;
  if (bracketIndex === 1) amount -= (annualGross - grossThresholds[0]) * phaseOutRate;
  if (annualGross > rule.extraOver) amount += (annualGross - rule.extraOver) * rule.extraRate;
  return amount;
}

/** 표의 한 칸(월급여 tableMonthlySalary, 가족 수 1~11명)을 별표2 제1호 방식 그대로 계산합니다. */
function tableCell(tableMonthlySalary: number, dependents: number) {
  const annualizedGrossForTax = tableMonthlySalary * 12;
  const deduction = laborIncomeDeduction(annualizedGrossForTax);
  const laborIncome = Math.max(annualizedGrossForTax - deduction, 0);

  const basicDeduction = INCOME_TAX_CONSTANTS.basicDeductionPerDependent * dependents;
  const pensionBase =
    Math.floor(Math.min(tableMonthlySalary, TABLE.pension.maxMonthlyBase) / 1_000) * 1_000;
  const pensionPremiumDeduction = floorToTen(pensionBase * TABLE.pension.rate) * 12;
  const specialDeduction = tableSpecialDeduction(annualizedGrossForTax, dependents);

  const taxBase = Math.max(
    laborIncome - basicDeduction - pensionPremiumDeduction - specialDeduction,
    0
  );

  const calculatedTax = progressiveTax(taxBase);
  const credit = tableLaborIncomeTaxCredit(calculatedTax, annualizedGrossForTax);
  const determinedAnnualTax = Math.max(calculatedTax - credit, 0);

  const monthlyTax = floorToTen(determinedAnnualTax / 12);

  return {
    breakdown: {
      tableMonthlySalary,
      annualizedGrossForTax,
      laborIncomeDeduction: deduction,
      laborIncome,
      basicDeduction,
      pensionPremiumDeduction,
      specialDeduction,
      taxBase,
      calculatedTax,
      laborIncomeTaxCredit: credit,
      determinedAnnualTax,
    },
    monthlyTax: monthlyTax < TABLE.minimumTax ? 0 : monthlyTax,
  };
}

/**
 * 근로소득 간이세액표(소득세법 시행령 별표2)의 해당 세액을 구합니다(자녀 공제 전).
 *
 * 표를 통째로 싣는 대신 표를 만든 계산식을 그대로 따라갑니다:
 *   1) 월급여(비과세 제외)가 속한 구간을 찾아 그 가운데 금액을 기준으로 삼음
 *      (예: 313만 3,333원 → "312만원 이상 314만원 미만" 구간 → 313만원)
 *   2) 기준 금액 × 12를 연간 총급여로 보고 근로소득공제 → 근로소득금액 산출
 *   3) 기본공제(가족 수 × 150만원), 연금보험료공제, 특별소득공제 등을 빼 과세표준 산출
 *   4) 8단계 누진세율로 산출세액 계산 → 근로소득세액공제 차감 → 12로 나눠 10원 미만 버림
 *   5) 월급여가 1,000만원을 넘으면 1,000만원일 때의 세액에 초과분 산식을 더함
 *
 * 2026-10-06에 국가법령정보센터의 별표2 원문과 대조해, 표의 7,106칸(646개 급여구간 ×
 * 가족 수 1~11명)과 1,000만원 행이 모두 원 단위까지 같은 것을 확인했습니다.
 */
export function simplifiedTaxTableAmount(
  monthlyTaxableSalary: number,
  dependents: number
): SimplifiedTaxTableResult {
  const salary = Math.max(monthlyTaxableSalary, 0);
  const family = Math.max(Math.floor(dependents), 1);

  const bracket = TABLE.bracketSteps.find((b) => salary < b.under);
  const tableMonthlySalary = bracket
    ? Math.floor(salary / bracket.step) * bracket.step + bracket.step / 2
    : TABLE.maxTableSalary;

  const cell = tableCell(tableMonthlySalary, Math.min(family, TABLE.maxTableDependents));
  let tableTax = cell.monthlyTax;

  // 가족 수가 11명을 넘으면(별표2 제4호): 11명 세액 - (10명 세액 - 11명 세액) × 초과 인원
  if (family > TABLE.maxTableDependents) {
    const oneFewer = tableCell(tableMonthlySalary, TABLE.maxTableDependents - 1).monthlyTax;
    tableTax = Math.max(tableTax - (oneFewer - tableTax) * (family - TABLE.maxTableDependents), 0);
  }

  let highIncomeAddition = 0;
  if (salary > TABLE.maxTableSalary) {
    const high =
      TABLE.highIncomeBrackets.find((b) => salary <= b.upTo) ??
      TABLE.highIncomeBrackets[TABLE.highIncomeBrackets.length - 1];
    highIncomeAddition = floorToTen(high.add + (salary - high.over) * high.factor * high.rate);
  }

  return {
    ...cell.breakdown,
    highIncomeAddition,
    monthlyIncomeTaxBeforeChildCredit: tableTax + highIncomeAddition,
  };
}

/**
 * 연봉 실수령액을 계산합니다.
 *
 * 4대보험은 2026년 요율을 그대로 적용하고, 소득세는 회사가 매달 월급에서 떼는 기준인
 * 근로소득 간이세액표(simplifiedTaxTableAmount)의 세액에서 8세 이상 20세 이하 자녀 수에
 * 따른 공제액을 뺀 금액입니다. 지방소득세는 소득세의 10%(10원 미만 버림)입니다.
 *
 * 간이세액표 세액 자체는 표와 같지만, 회사가 상여금을 따로 계산하거나 근로자가 원천징수
 * 비율(80%·120%)을 선택한 경우에는 실제 급여명세서와 달라집니다.
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

  const tableTax = simplifiedTaxTableAmount(monthlyTaxableSalary, input.dependents);
  const childTaxCredit = monthlyChildTaxCredit(input.childrenUnder20);
  const monthlyIncomeTax = Math.max(tableTax.monthlyIncomeTaxBeforeChildCredit - childTaxCredit, 0);
  const monthlyLocalIncomeTax = floorToTen(monthlyIncomeTax * INCOME_TAX_CONSTANTS.localTaxRate);

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
      ...tableTax,
      childTaxCredit,
      monthlyIncomeTax,
      monthlyLocalIncomeTax,
    },
    monthlyDeductionTotal,
    monthlyNetSalary,
    annualNetSalary: monthlyNetSalary * 12,
  };
}
