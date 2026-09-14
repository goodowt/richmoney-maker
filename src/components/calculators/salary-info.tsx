import { INSURANCE_RATES_2026 } from "@/lib/calculators/rates";
import { calculateSalary } from "@/lib/calculators/salary";
import { formatWon } from "@/lib/format";

const SAMPLE_ANNUAL_SALARIES_MAN = [
  2400, 2800, 3200, 3600, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 10000,
];

function formatManLabel(man: number): string {
  if (man >= 10_000 && man % 10_000 === 0) {
    return `${man / 10_000}억원`;
  }
  return `${man.toLocaleString("ko-KR")}만원`;
}

export function SalaryInfoSections() {
  const rates = INSURANCE_RATES_2026;

  const salaryTable = SAMPLE_ANNUAL_SALARIES_MAN.map((man) => {
    const result = calculateSalary({
      annualSalary: man * 10_000,
      monthlyNonTaxable: 200_000,
      dependents: 1,
      childrenUnder20: 0,
    });
    return { man, result };
  });

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>회사와 계약할 때 정한 1년치 월급(세전 연봉)을 &ldquo;연봉&rdquo; 칸에 입력해요.</li>
          <li>
            밥값처럼 세금을 매기지 않는 돈이 있다면 &ldquo;비과세액&rdquo; 칸에 입력해요. 잘 모르면
            기본값(20만원)을 그대로 둬도 괜찮아요.
          </li>
          <li>나를 포함해서 내가 책임지고 있는 가족 수를 &ldquo;부양가족 수&rdquo;에 입력해요.</li>
          <li>결과 화면의 &ldquo;공제 내역 펼쳐보기&rdquo;를 누르면 어디에 돈이 빠져나가는지 하나씩 볼 수 있어요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          왜 월급이 연봉의 1/12보다 적게 들어올까요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          연봉이 4,000만원이면 한 달 월급은 4,000만원 ÷ 12 = 약 333만원이에요. 그런데 통장에는
          그보다 적은 돈이 들어와요. 회사가 월급을 주기 전에 두 가지를 미리 떼어 나라에 대신
          내주기 때문이에요.
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/75">
          <li>
            <strong>① 4대보험료</strong> — 아프거나, 나이 들거나, 회사를 그만뒀을 때를 대비해서
            미리 조금씩 모아두는 보험료예요.
          </li>
          <li>
            <strong>② 소득세 + 지방소득세</strong> — 돈을 번 것에 대해 나라와 사는 지역에 내는
            세금이에요.
          </li>
        </ul>
      </section>

      <section aria-labelledby="rate-heading">
        <h2 id="rate-heading" className="text-xl font-bold">
          2026년 기준 4대보험료율 — 각각 무엇인가요?
        </h2>
        <dl className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/75">
          <div>
            <dt className="font-medium text-foreground">국민연금</dt>
            <dd>지금 낸 돈을 나중에 나이가 들었을 때(보통 만 65세부터) 매달 연금으로 돌려받아요.</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">건강보험</dt>
            <dd>병원에 갈 때 진료비·약값을 훨씬 싸게 내도록 도와주는 보험이에요.</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">장기요양보험</dt>
            <dd>
              나이가 많이 들어 혼자 씻거나 움직이기 힘들 때 도움을 받을 수 있는 보험이에요.
              건강보험료에 일정 비율을 더해서 함께 걷어요.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">고용보험</dt>
            <dd>회사를 그만두고 다음 일자리를 구하는 동안 &ldquo;실업급여&rdquo;를 받을 수 있게 해줘요.</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-foreground/60">
          아래 표는 근로자(나)가 내는 비율입니다. 국민연금과 건강보험은 회사(사업주)도 나와
          똑같은 비율만큼 따로 내줘요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">항목</th>
                <th className="px-4 py-2 text-right font-medium">근로자 부담률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2">국민연금</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {(rates.nationalPension.employeeRate * 100).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">건강보험</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {(rates.healthInsurance.employeeRate * 100).toFixed(3)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">장기요양보험(건강보험료 대비)</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {(rates.longTermCare.rateOfHealthInsurance * 100).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">고용보험(실업급여분)</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {(rates.employmentInsurance.employeeRate * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">
          국민연금은 아무리 월급이 많아도 일정 금액까지만 보험료를 매겨요. 그 최대 기준이
          {" "}
          {formatWon(rates.nationalPension.maxMonthlyBase)}
          (2026년 7월~2027년 6월 기준), 최소 기준이 {formatWon(rates.nationalPension.minMonthlyBase)}
          예요.
        </p>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-xl font-bold">
          연봉별 실수령액표
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          내 연봉과 비슷한 줄을 찾아보면 대략 얼마가 통장에 들어오는지 감을 잡을 수 있어요.
          아래 표는 비과세액 월 20만원, 부양가족 1인(본인만), 20세 이하 자녀 0명인 경우를
          기준으로 만들었어요. 조건이 다르면 위 계산기에 직접 입력해서 더 정확한 값을
          확인하세요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">연봉</th>
                <th className="px-4 py-2 text-right font-medium">월 실수령액</th>
                <th className="px-4 py-2 text-right font-medium">공제 합계(월)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {salaryTable.map(({ man, result }) => (
                <tr key={man}>
                  <td className="px-4 py-2">{formatManLabel(man)}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">
                    {formatWon(result.monthlyNetSalary)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-foreground/60">
                    {formatWon(result.monthlyDeductionTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
