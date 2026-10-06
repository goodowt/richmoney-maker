import { calculateSalary, type SalaryCalculatorInput, type SalaryCalculatorResult } from "./salary";
import type { FaqItem } from "./faq";
import { formatWon } from "../format";

const MAN = 10_000;

function range(from: number, to: number, step: number): number[] {
  const values: number[] = [];
  for (let value = from; value <= to; value += step) values.push(value);
  return values;
}

/**
 * 금액별 실수령액 페이지(/calculators/salary/[amount])를 만드는 연봉 목록(만원 단위).
 * 이 목록이 곧 정적 생성 대상·사이트맵·실수령액 표의 행이 됩니다.
 *
 * 1억원 초과는 일부러 넣지 않았습니다. 월급여 1,000만원 초과 구간은 간이세액표가 별도
 * 산식을 쓰는데 salary.ts의 근사식은 이를 반영하지 않아, 타 사이트 표와 대조했을 때
 * 1억원까지는 월 3만원 안팎이던 차이가 1억 2,000만원에서 월 7만원대로 벌어집니다.
 */
export const SALARY_AMOUNTS_MAN: number[] = range(2400, 10_000, 100);

/** 홈·금액별 페이지에서 바로가기로 노출하는 대표 연봉(만원 단위). */
export const POPULAR_SALARY_AMOUNTS_MAN: number[] = [3000, 4000, 5000, 6000, 7000, 8000, 10_000];

/** 금액별 페이지와 실수령액 표가 공통으로 쓰는 기준 조건(연봉 계산기 기본값과 동일). */
export const STANDARD_SALARY_CONDITIONS = {
  monthlyNonTaxable: 200_000,
  dependents: 1,
  childrenUnder20: 0,
} satisfies Omit<SalaryCalculatorInput, "annualSalary">;

export function salaryAmountPath(man: number): string {
  return `/calculators/salary/${man}`;
}

/** URL의 [amount] 값이 목록에 있는 연봉이면 만원 단위 숫자로, 아니면 null을 돌려줍니다. */
export function parseSalaryAmount(param: string): number | null {
  if (!/^\d+$/.test(param)) return null;
  const man = Number(param);
  return SALARY_AMOUNTS_MAN.includes(man) ? man : null;
}

/** 화면 표시용: 4000 → "4,000만원", 10000 → "1억원", 12000 → "1억 2,000만원" */
export function formatManLabel(man: number): string {
  const eok = Math.floor(man / 10_000);
  const rest = man % 10_000;
  if (eok === 0) return `${rest.toLocaleString("ko-KR")}만원`;
  if (rest === 0) return `${eok}억원`;
  return `${eok}억 ${rest.toLocaleString("ko-KR")}만원`;
}

/** 검색어에 가까운 표기(타이틀용): 4000 → "4000만원", 10000 → "1억", 12000 → "1억 2000만원" */
export function formatManKeyword(man: number): string {
  const eok = Math.floor(man / 10_000);
  const rest = man % 10_000;
  if (eok === 0) return `${rest}만원`;
  if (rest === 0) return `${eok}억`;
  return `${eok}억 ${rest}만원`;
}

/** 원 단위 금액을 "약 293만원"처럼 만원 단위로 줄여 표기합니다. */
export function formatApproxMan(won: number): string {
  return `${Math.round(won / MAN).toLocaleString("ko-KR")}만원`;
}

/** 기준 조건으로 연봉(만원)의 실수령액을 계산합니다. 조건 일부만 바꿔 비교할 때는 overrides를 넘깁니다. */
export function calculateStandardSalary(
  man: number,
  overrides: Partial<Omit<SalaryCalculatorInput, "annualSalary">> = {}
): SalaryCalculatorResult {
  return calculateSalary({
    annualSalary: man * MAN,
    ...STANDARD_SALARY_CONDITIONS,
    ...overrides,
  });
}

/** 목록에서 바로 앞뒤 연봉을 count개씩 돌려줍니다(주변 연봉 비교표용). */
export function neighborSalaryAmounts(man: number, count = 2): { lower: number[]; higher: number[] } {
  const index = SALARY_AMOUNTS_MAN.indexOf(man);
  if (index === -1) return { lower: [], higher: [] };
  return {
    lower: SALARY_AMOUNTS_MAN.slice(Math.max(index - count, 0), index),
    higher: SALARY_AMOUNTS_MAN.slice(index + 1, index + 1 + count),
  };
}

export function buildSalaryAmountFaq(man: number): FaqItem[] {
  const label = formatManLabel(man);
  const result = calculateStandardSalary(man);
  const withFamily = calculateStandardSalary(man, { dependents: 3, childrenUnder20: 1 });
  const taxTotal = result.tax.monthlyIncomeTax + result.tax.monthlyLocalIncomeTax;

  return [
    {
      question: `연봉 ${label}의 월 실수령액은 얼마인가요?`,
      answer: `2026년 기준 연봉 ${label}의 월 실수령액은 약 ${formatWon(result.monthlyNetSalary)}입니다. 세전 월급 ${formatWon(result.monthlyGrossSalary)}에서 4대보험료 ${formatWon(result.insurance.total)}과 소득세·지방소득세 ${formatWon(taxTotal)}을 뺀 금액이며, 비과세 식대 월 20만원·부양가족 1명(본인) 기준입니다.`,
    },
    {
      question: `연봉 ${label}이면 세금과 4대보험으로 한 달에 얼마가 빠지나요?`,
      answer: `한 달에 약 ${formatWon(result.monthlyDeductionTotal)}이 공제됩니다. 국민연금 ${formatWon(result.insurance.nationalPension)}, 건강보험 ${formatWon(result.insurance.healthInsurance)}, 장기요양보험 ${formatWon(result.insurance.longTermCare)}, 고용보험 ${formatWon(result.insurance.employmentInsurance)}, 소득세 ${formatWon(result.tax.monthlyIncomeTax)}, 지방소득세 ${formatWon(result.tax.monthlyLocalIncomeTax)}입니다.`,
    },
    {
      question: `연봉 ${label}의 1년 실수령액은 얼마인가요?`,
      answer: `월 실수령액 ${formatWon(result.monthlyNetSalary)}을 12개월로 계산하면 1년 실수령액은 약 ${formatWon(result.annualNetSalary)}입니다. 연봉 ${label} 중 약 ${formatWon(result.monthlyDeductionTotal * 12)}이 1년 동안 4대보험료와 세금으로 빠집니다. 연말정산 결과에 따라 실제 금액은 달라질 수 있습니다.`,
    },
    {
      question: `부양가족이 있으면 연봉 ${label}의 실수령액이 달라지나요?`,
      answer: `네. 부양가족이 많을수록 소득세가 줄어 실수령액이 늘어납니다. 예를 들어 부양가족 3명(20세 이하 자녀 1명 포함)이면 월 실수령액은 약 ${formatWon(withFamily.monthlyNetSalary)}으로, 본인 1명일 때보다 약 ${formatWon(withFamily.monthlyNetSalary - result.monthlyNetSalary)} 많습니다. 4대보험료는 부양가족 수와 상관없이 같습니다.`,
    },
  ];
}
