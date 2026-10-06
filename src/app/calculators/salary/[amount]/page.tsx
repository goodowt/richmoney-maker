import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorShell } from "@/components/calculator-shell";
import { SalaryCalculatorForm } from "@/components/calculators/salary-calculator-form";
import {
  SalaryAmountDetailSections,
  SalaryAmountSummary,
} from "@/components/calculators/salary-amount-sections";
import { SalaryTrustSection } from "@/components/calculators/salary-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import {
  SALARY_AMOUNTS_MAN,
  buildSalaryAmountFaq,
  calculateStandardSalary,
  formatApproxMan,
  formatManKeyword,
  formatManLabel,
  parseSalaryAmount,
  salaryAmountPath,
} from "@/lib/calculators/salary-amounts";
import { formatWon } from "@/lib/format";
import { buildStaticPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/tools";

// 목록(SALARY_AMOUNTS_MAN)에 있는 연봉만 정적으로 만들고, 그 밖의 주소는 404로 보냅니다.
export const dynamicParams = false;

export function generateStaticParams() {
  return SALARY_AMOUNTS_MAN.map((man) => ({ amount: String(man) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/calculators/salary/[amount]">): Promise<Metadata> {
  const { amount } = await params;
  const man = parseSalaryAmount(amount);
  if (man === null) return {};

  const result = calculateStandardSalary(man);
  return buildStaticPageMetadata(
    `연봉 ${formatManKeyword(man)} 실수령액 월 ${formatApproxMan(result.monthlyNetSalary)} (2026년)`,
    `2026년 기준 연봉 ${formatManLabel(man)}의 월 실수령액은 ${formatWon(result.monthlyNetSalary)}입니다. 4대보험·소득세 공제 내역과 부양가족 수별 실수령액, 시급 환산까지 한 번에 확인하세요.`,
    salaryAmountPath(man)
  );
}

export default async function SalaryAmountPage({
  params,
}: PageProps<"/calculators/salary/[amount]">) {
  const { amount } = await params;
  const man = parseSalaryAmount(amount);
  if (man === null) notFound();

  const label = formatManLabel(man);
  const result = calculateStandardSalary(man);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "연봉 실수령액 계산기",
        item: `${siteConfig.url}/calculators/salary`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `연봉 ${label} 실수령액`,
        item: `${siteConfig.url}${salaryAmountPath(man)}`,
      },
    ],
  };

  return (
    <CalculatorShell
      activeSlug="salary"
      title={`연봉 ${label} 실수령액 (2026년)`}
      description={`연봉 ${label}이면 4대보험료와 세금을 떼고 한 달에 약 ${formatApproxMan(result.monthlyNetSalary)}이 통장에 들어와요.`}
    >
      <SalaryAmountSummary man={man} />
      <AdUnit slot={adSlots.afterResult} />
      <SalaryAmountDetailSections man={man} />

      <section aria-labelledby="custom-heading" className="mt-10">
        <h2 id="custom-heading" className="text-xl font-bold">
          내 조건으로 직접 계산해보기
        </h2>
        <p className="mt-3 mb-4 text-sm leading-relaxed text-foreground/75">
          연봉 {label}이 미리 입력돼 있어요. 비과세액이나 부양가족 수를 내 상황에 맞게 바꾸면
          결과가 바로 달라져요.
        </p>
        <SalaryCalculatorForm initialAnnualSalaryMan={man} />
      </section>

      <FaqSection items={buildSalaryAmountFaq(man)} />
      <div className="mt-10">
        <SalaryTrustSection />
      </div>
      <AdUnit slot={adSlots.pageBottom} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </CalculatorShell>
  );
}
