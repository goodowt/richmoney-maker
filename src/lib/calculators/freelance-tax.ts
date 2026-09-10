import { FREELANCE_WITHHOLDING_INCOME_TAX_RATE, INCOME_TAX_CONSTANTS } from "./rates";

/** 소득세 3% + 지방소득세(소득세의 10%) = 지급액의 3.3% */
const TOTAL_WITHHOLDING_RATE =
  FREELANCE_WITHHOLDING_INCOME_TAX_RATE * (1 + INCOME_TAX_CONSTANTS.localTaxRate);

export type FreelanceTaxCalculatorInput = {
  /** 입력한 금액(원) */
  amount: number;
  /** "gross": 세전 계약금액을 입력, "net": 실수령액(입금액)을 입력 */
  mode: "gross" | "net";
};

export type FreelanceTaxCalculatorResult = {
  input: FreelanceTaxCalculatorInput;
  /** 세전 계약금액(용역비) */
  grossAmount: number;
  /** 소득세(3%, 원 단위 절사) */
  incomeTax: number;
  /** 지방소득세(소득세의 10%, 원 단위 절사) */
  localIncomeTax: number;
  /** 원천징수세액 합계(소득세+지방소득세) */
  totalWithholding: number;
  /** 실수령액(입금액) */
  netAmount: number;
  /** 이 금액을 매달 받는다고 가정했을 때의 연간 환산 */
  annualEquivalent: {
    grossAmount: number;
    totalWithholding: number;
    netAmount: number;
  };
};

function withholdingFor(grossAmount: number) {
  const incomeTax = Math.floor(grossAmount * FREELANCE_WITHHOLDING_INCOME_TAX_RATE);
  const localIncomeTax = Math.floor(incomeTax * INCOME_TAX_CONSTANTS.localTaxRate);
  return { incomeTax, localIncomeTax, netAmount: grossAmount - incomeTax - localIncomeTax };
}

/**
 * 원 단위 절사 때문에 "세전 금액 ÷ (1 - 3.3%)"로 근사한 값이 실제로는 원하는
 * 실수령액과 1원 정도 어긋날 수 있어, 근사값 주변을 탐색해 정확히 그 실수령액이
 * 나오는 세전 금액을 찾습니다. 절사가 겹치는 드문 경우 같은 실수령액을 만드는
 * 세전 금액이 여러 개 나올 수 있는데, 그중 근사값에 가장 가까운(=자연스러운
 * 계약금액에 가까운) 값을 선택합니다.
 */
function findGrossForNetAmount(targetNet: number, approxGross: number): number {
  let bestGross = approxGross;
  let bestNetDiff = Infinity;
  let bestGrossDiff = Infinity;
  for (let gross = Math.max(approxGross - 3, 0); gross <= approxGross + 3; gross++) {
    const netDiff = Math.abs(withholdingFor(gross).netAmount - targetNet);
    const grossDiff = Math.abs(gross - approxGross);
    if (netDiff < bestNetDiff || (netDiff === bestNetDiff && grossDiff < bestGrossDiff)) {
      bestNetDiff = netDiff;
      bestGrossDiff = grossDiff;
      bestGross = gross;
    }
  }
  return bestGross;
}

/**
 * 프리랜서(사업소득) 용역비의 3.3% 원천징수세액과 실수령액을 계산합니다.
 *
 * mode가 "gross"면 입력한 금액을 세전 계약금액으로 보고 원천징수세액을 뺀
 * 실수령액을 구하고, "net"이면 입력한 금액을 실수령액(내 통장에 들어올 돈)으로
 * 보고 역산해서 세전 계약금액을 구합니다.
 *
 * 소득세·지방소득세는 각각 원 단위 미만을 절사합니다(원천징수 실무 관행).
 *
 * 예: 세전 100만원 → 소득세 30,000원 + 지방소득세 3,000원 = 33,000원 원천징수,
 * 실수령액 967,000원.
 */
export function calculateFreelanceTax(
  input: FreelanceTaxCalculatorInput
): FreelanceTaxCalculatorResult {
  const amount = Math.max(input.amount, 0);
  const grossAmount =
    input.mode === "gross"
      ? amount
      : findGrossForNetAmount(amount, Math.round(amount / (1 - TOTAL_WITHHOLDING_RATE)));

  const { incomeTax, localIncomeTax, netAmount } = withholdingFor(grossAmount);
  const totalWithholding = incomeTax + localIncomeTax;

  return {
    input,
    grossAmount,
    incomeTax,
    localIncomeTax,
    totalWithholding,
    netAmount,
    annualEquivalent: {
      grossAmount: grossAmount * 12,
      totalWithholding: totalWithholding * 12,
      netAmount: netAmount * 12,
    },
  };
}
