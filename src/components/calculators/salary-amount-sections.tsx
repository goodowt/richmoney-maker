import Link from "next/link";
import type { ReactNode } from "react";
import { MINIMUM_WAGE_2026 } from "@/lib/calculators/rates";
import type { SalaryCalculatorResult } from "@/lib/calculators/salary";
import {
  POPULAR_SALARY_AMOUNTS_MAN,
  calculateStandardSalary,
  formatManLabel,
  neighborSalaryAmounts,
  salaryAmountPath,
} from "@/lib/calculators/salary-amounts";
import { formatWon } from "@/lib/format";

const linkClass = "underline decoration-primary/40 underline-offset-4 hover:text-primary";

const FAMILY_SCENARIOS = [
  { label: "1명 (본인만)", dependents: 1, childrenUnder20: 0 },
  { label: "2명", dependents: 2, childrenUnder20: 0 },
  { label: "3명 (8~20세 자녀 1명 포함)", dependents: 3, childrenUnder20: 1 },
  { label: "4명 (8~20세 자녀 2명 포함)", dependents: 4, childrenUnder20: 2 },
];

function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

/** 금액별 페이지 맨 위: 결론(월·연 실수령액)과 항목별 공제 내역 */
export function SalaryAmountSummary({ man }: { man: number }) {
  const label = formatManLabel(man);
  const result = calculateStandardSalary(man);
  const taxTotal = result.tax.monthlyIncomeTax + result.tax.monthlyLocalIncomeTax;

  const rows: { label: string; value: number; negative?: boolean; emphasis?: boolean }[] = [
    { label: "세전 급여", value: result.monthlyGrossSalary, emphasis: true },
    { label: "국민연금", value: result.insurance.nationalPension, negative: true },
    { label: "건강보험", value: result.insurance.healthInsurance, negative: true },
    { label: "장기요양보험", value: result.insurance.longTermCare, negative: true },
    { label: "고용보험", value: result.insurance.employmentInsurance, negative: true },
    { label: "소득세", value: result.tax.monthlyIncomeTax, negative: true },
    { label: "지방소득세", value: result.tax.monthlyLocalIncomeTax, negative: true },
    { label: "공제 합계", value: result.monthlyDeductionTotal, negative: true },
    { label: "실수령액", value: result.monthlyNetSalary, emphasis: true },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 lg:grid-cols-4">
        <div>
          <p className="text-sm text-foreground/55">월 실수령액</p>
          <p className="text-xl font-bold whitespace-nowrap text-primary-hover sm:text-3xl">
            {formatWon(result.monthlyNetSalary)}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/55">연 실수령액</p>
          <p className="text-xl font-bold whitespace-nowrap sm:text-3xl">
            {formatWon(result.annualNetSalary)}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/55">월 공제 합계</p>
          <p className="text-lg font-semibold sm:text-2xl">{formatWon(result.monthlyDeductionTotal)}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/55">세전 대비 실수령 비율</p>
          <p className="text-lg font-semibold sm:text-2xl">
            {formatPercent(result.monthlyNetSalary / result.monthlyGrossSalary)}
          </p>
        </div>
      </div>

      <section aria-labelledby="breakdown-heading">
        <h2 id="breakdown-heading" className="text-xl font-bold">
          연봉 {label}, 어디서 얼마가 빠질까요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          연봉 {label}을 12로 나누면 세전 월급은 {formatWon(result.monthlyGrossSalary)}이에요.
          여기서 4대보험료 {formatWon(result.insurance.total)}과 세금(소득세+지방소득세){" "}
          {formatWon(taxTotal)}, 합쳐서 {formatWon(result.monthlyDeductionTotal)}이 먼저 빠지고
          통장에는 {formatWon(result.monthlyNetSalary)}이 들어와요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">항목</th>
                <th className="px-4 py-2 text-right font-medium">한 달</th>
                <th className="px-4 py-2 text-right font-medium">1년</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.label} className={row.emphasis ? "font-semibold" : undefined}>
                  <td className="px-4 py-2">{row.label}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums">
                    {row.negative && row.value > 0 ? "-" : ""}
                    {formatWon(row.value)}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums text-foreground/60">
                    {row.negative && row.value > 0 ? "-" : ""}
                    {formatWon(row.value * 12)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">
          2026년 4대보험 요율 기준, 비과세 식대 월 20만원·부양가족 1명(본인)·8~20세 자녀 0명일 때의
          계산이에요.
        </p>
      </section>
    </div>
  );
}

function ComparisonTable({
  headers,
  rows,
}: {
  headers: [string, string, string, string];
  rows: { key: string; cells: [ReactNode, string, string, string]; highlight?: boolean }[];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-primary-soft/50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">{headers[0]}</th>
            <th className="px-4 py-2 text-right font-medium">{headers[1]}</th>
            <th className="px-4 py-2 text-right font-medium">{headers[2]}</th>
            <th className="px-4 py-2 text-right font-medium">{headers[3]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.key} className={row.highlight ? "bg-primary-soft/30 font-semibold" : undefined}>
              <td className="px-4 py-2">{row.cells[0]}</td>
              <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums">{row.cells[1]}</td>
              <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums font-medium">{row.cells[2]}</td>
              <td className="px-4 py-2 text-right whitespace-nowrap tabular-nums text-foreground/60">{row.cells[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDiff(diff: number): string {
  if (Math.round(diff) === 0) return "기준";
  return `${diff > 0 ? "+" : "-"}${formatWon(Math.abs(diff))}`;
}

function monthlyTax(result: SalaryCalculatorResult): number {
  return result.tax.monthlyIncomeTax + result.tax.monthlyLocalIncomeTax;
}

/** 금액별 페이지 본문: 조건(부양가족·비과세)별 비교, 시급 환산, 주변 연봉 비교 */
export function SalaryAmountDetailSections({ man }: { man: number }) {
  const label = formatManLabel(man);
  const base = calculateStandardSalary(man);

  const familyRows = FAMILY_SCENARIOS.map((scenario) => {
    const result = calculateStandardSalary(man, scenario);
    return {
      key: scenario.label,
      cells: [
        scenario.label,
        formatWon(monthlyTax(result)),
        formatWon(result.monthlyNetSalary),
        formatDiff(result.monthlyNetSalary - base.monthlyNetSalary),
      ] as [string, string, string, string],
    };
  });

  const noMealAllowance = calculateStandardSalary(man, { monthlyNonTaxable: 0 });
  const nonTaxableRows = [
    { label: "월 20만원 (식대 비과세)", result: base },
    { label: "없음 (0원)", result: noMealAllowance },
  ].map(({ label: rowLabel, result }) => ({
    key: rowLabel,
    cells: [
      rowLabel,
      formatWon(result.monthlyDeductionTotal),
      formatWon(result.monthlyNetSalary),
      formatDiff(result.monthlyNetSalary - base.monthlyNetSalary),
    ] as [string, string, string, string],
  }));

  const monthlyHours = MINIMUM_WAGE_2026.standardMonthlyHours;
  const hourlyWage = base.monthlyGrossSalary / monthlyHours;
  const minimumAnnualSalary = MINIMUM_WAGE_2026.hourlyWage * monthlyHours * 12;
  const belowMinimumWage = man * 10_000 < minimumAnnualSalary;

  const { lower, higher } = neighborSalaryAmounts(man);
  const neighborRows = [...lower, man, ...higher].map((amount) => {
    const result = amount === man ? base : calculateStandardSalary(amount);
    return {
      key: String(amount),
      highlight: amount === man,
      cells: [
        amount === man ? (
          formatManLabel(amount)
        ) : (
          <Link href={salaryAmountPath(amount)} className={linkClass}>
            {formatManLabel(amount)}
          </Link>
        ),
        formatWon(result.monthlyDeductionTotal),
        formatWon(result.monthlyNetSalary),
        formatDiff(result.monthlyNetSalary - base.monthlyNetSalary),
      ] as [ReactNode, string, string, string],
    };
  });

  const next = higher[0];
  const nextResult = next ? calculateStandardSalary(next) : null;

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="family-heading">
        <h2 id="family-heading" className="text-xl font-bold">
          부양가족 수에 따라 달라지는 실수령액
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          같은 연봉 {label}이라도 책임지는 가족이 많으면 소득세를 덜 내서 통장에 들어오는 돈이
          늘어나요. 4대보험료는 가족 수와 상관없이 똑같아요.
        </p>
        <ComparisonTable
          headers={["부양가족 수(본인 포함)", "세금(월)", "월 실수령액", "본인만일 때와 차이"]}
          rows={familyRows}
        />
      </section>

      <section aria-labelledby="nontaxable-heading">
        <h2 id="nontaxable-heading" className="text-xl font-bold">
          비과세 식대가 없으면 얼마나 줄어들까요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          식대처럼 세금을 매기지 않는 돈(비과세액)이 월급에 포함돼 있으면 그만큼 4대보험료와 세금을
          덜 내요. 연봉 {label}에 비과세 식대가 전혀 없다면 월 실수령액은{" "}
          {formatWon(noMealAllowance.monthlyNetSalary)}으로, 식대 20만원이 있을 때보다{" "}
          {formatWon(base.monthlyNetSalary - noMealAllowance.monthlyNetSalary)} 적어요.
        </p>
        <ComparisonTable
          headers={["비과세액", "공제 합계(월)", "월 실수령액", "차이"]}
          rows={nonTaxableRows}
        />
      </section>

      <section aria-labelledby="hourly-heading">
        <h2 id="hourly-heading" className="text-xl font-bold">
          연봉 {label}을 시급으로 바꾸면?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          주 40시간 일하는 직장인은 주휴시간을 포함해 한 달을 {monthlyHours}시간으로 계산해요. 세전
          월급 {formatWon(base.monthlyGrossSalary)}을 {monthlyHours}시간으로 나누면 시급은 약{" "}
          <strong>{formatWon(hourlyWage)}</strong>이에요. 2026년 최저시급(
          {formatWon(MINIMUM_WAGE_2026.hourlyWage)})의 약{" "}
          {(hourlyWage / MINIMUM_WAGE_2026.hourlyWage).toFixed(1)}배예요.
        </p>
        {belowMinimumWage && (
          <p className="mt-3 rounded-xl bg-primary-soft/50 px-4 py-3 text-sm leading-relaxed text-foreground/80">
            주 40시간 전일제 기준으로 2026년 최저임금을 1년 치로 바꾸면{" "}
            {formatWon(minimumAnnualSalary)}이에요. 연봉 {label}은 이보다 적어서, 전일제로 일하고
            있다면 최저임금에 못 미칠 수 있어요.{" "}
            <Link href="/calculators/minimum-wage" className={linkClass}>
              최저임금 계산기
            </Link>
            로 내 근무시간에 맞춰 확인해 보세요.
          </p>
        )}
        <p className="mt-2 text-xs text-muted">
          연봉 전체가 매달 똑같이 나오는 기본급이라고 보고 계산한 값이에요. 상여금·성과급이 연봉에
          포함돼 있거나 근무시간이 다르면 실제 시급은 달라져요.
        </p>
      </section>

      <section aria-labelledby="neighbor-heading">
        <h2 id="neighbor-heading" className="text-xl font-bold">
          비슷한 연봉과 비교하기
        </h2>
        {next && nextResult && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/75">
            연봉이 {formatManLabel(next)}으로 {formatManLabel(next - man)} 오르면 월 실수령액은{" "}
            {formatWon(nextResult.monthlyNetSalary - base.monthlyNetSalary)} 늘어요. 오른 연봉 중 약{" "}
            {formatPercent(
              (nextResult.annualNetSalary - base.annualNetSalary) / ((next - man) * 10_000)
            )}
            만 실제로 손에 들어오는 셈이에요. 나머지는 4대보험료와 세금으로 빠져요.
          </p>
        )}
        <ComparisonTable
          headers={["연봉", "공제 합계(월)", "월 실수령액", `${label}과 차이`]}
          rows={neighborRows}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {POPULAR_SALARY_AMOUNTS_MAN.filter((amount) => amount !== man).map((amount) => (
            <Link
              key={amount}
              href={salaryAmountPath(amount)}
              className="rounded-full bg-primary-soft/40 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary-soft"
            >
              연봉 {formatManLabel(amount)}
            </Link>
          ))}
          <Link
            href="/calculators/salary/table"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary-hover"
          >
            전체 연봉 실수령액 표 →
          </Link>
        </div>
      </section>
    </div>
  );
}
