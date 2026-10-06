import Link from "next/link";
import { CalculatorShell } from "@/components/calculator-shell";
import { SalaryTrustSection } from "@/components/calculators/salary-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import type { FaqItem } from "@/lib/calculators/faq";
import {
  SALARY_AMOUNTS_MAN,
  calculateStandardSalary,
  formatManLabel,
  salaryAmountPath,
} from "@/lib/calculators/salary-amounts";
import { formatWon } from "@/lib/format";
import { buildStaticPageMetadata } from "@/lib/metadata";

const firstLabel = formatManLabel(SALARY_AMOUNTS_MAN[0]);
const lastLabel = formatManLabel(SALARY_AMOUNTS_MAN[SALARY_AMOUNTS_MAN.length - 1]);

const title = "2026년 연봉 실수령액 표";
const description = `연봉 ${firstLabel}부터 ${lastLabel}까지, 2026년 4대보험 요율 기준 월 실수령액과 항목별 공제액을 표로 정리했습니다.`;

export const metadata = buildStaticPageMetadata(title, description, "/calculators/salary/table");

const tableFaq: FaqItem[] = [
  {
    question: "이 표는 어떤 조건으로 계산했나요?",
    answer:
      "2026년 4대보험 요율을 적용하고, 비과세 식대 월 20만원·부양가족 1명(본인)·20세 이하 자녀 0명인 경우를 기준으로 계산했습니다. 조건이 다르면 연봉을 눌러 들어간 페이지나 연봉 실수령액 계산기에서 직접 바꿔 계산할 수 있습니다.",
  },
  {
    question: "연봉이 오르면 실수령액도 같은 비율로 오르나요?",
    answer:
      "아니요. 소득세는 많이 벌수록 세율이 높아지는 누진세라서, 연봉이 오를수록 공제되는 비율도 커집니다. 그래서 연봉이 2배가 돼도 실수령액은 2배보다 적게 늘어납니다.",
  },
  {
    question: "표의 금액과 실제 월급이 다른 이유는 무엇인가요?",
    answer:
      "소득세는 국세청 근로소득 간이세액표를 계산식으로 근사한 값이라 실제 원천징수액과 월 1만~3만원 내외 차이가 날 수 있습니다. 상여금·성과급처럼 달마다 금액이 달라지는 급여가 있거나 비과세액·부양가족 수가 다르면 차이가 더 커질 수 있습니다.",
  },
];

export default function SalaryTablePage() {
  const rows = SALARY_AMOUNTS_MAN.map((man) => ({ man, result: calculateStandardSalary(man) }));

  return (
    <CalculatorShell activeSlug="salary" title={title} description={description}>
      <p className="text-sm leading-relaxed text-foreground/75">
        내 연봉과 같은 줄을 찾으면 한 달에 얼마가 통장에 들어오는지, 어떤 항목으로 얼마가 빠지는지
        한눈에 볼 수 있어요. 비과세 식대 월 20만원, 부양가족 1명(본인만), 20세 이하 자녀 0명인
        경우를 기준으로 만들었어요. 연봉을 누르면 그 금액의 자세한 설명을 볼 수 있고, 조건이
        다르면{" "}
        <Link
          href="/calculators/salary"
          className="underline decoration-primary/40 underline-offset-4 hover:text-primary"
        >
          연봉 실수령액 계산기
        </Link>
        에 직접 입력해 보세요.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-primary-soft/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">연봉</th>
              <th className="px-3 py-2 text-right font-medium">월 실수령액</th>
              <th className="px-3 py-2 text-right font-medium">세전 월급</th>
              <th className="px-3 py-2 text-right font-medium">국민연금</th>
              <th className="px-3 py-2 text-right font-medium">건강보험</th>
              <th className="px-3 py-2 text-right font-medium">장기요양</th>
              <th className="px-3 py-2 text-right font-medium">고용보험</th>
              <th className="px-3 py-2 text-right font-medium">소득세</th>
              <th className="px-3 py-2 text-right font-medium">지방소득세</th>
              <th className="px-3 py-2 text-right font-medium">공제 합계</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(({ man, result }) => (
              <tr key={man}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Link
                    href={salaryAmountPath(man)}
                    className="underline decoration-primary/40 underline-offset-4 hover:text-primary"
                  >
                    {formatManLabel(man)}
                  </Link>
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold">
                  {formatWon(result.monthlyNetSalary)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-foreground/60">
                  {formatWon(result.monthlyGrossSalary)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatWon(result.insurance.nationalPension)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatWon(result.insurance.healthInsurance)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatWon(result.insurance.longTermCare)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatWon(result.insurance.employmentInsurance)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatWon(result.tax.monthlyIncomeTax)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatWon(result.tax.monthlyLocalIncomeTax)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-foreground/60">
                  {formatWon(result.monthlyDeductionTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">금액은 모두 한 달 기준이에요. 화면이 좁으면 표를 옆으로 밀어서 볼 수 있어요.</p>

      <AdUnit slot={adSlots.afterResult} />
      <FaqSection items={tableFaq} />
      <div className="mt-10">
        <SalaryTrustSection />
      </div>
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
