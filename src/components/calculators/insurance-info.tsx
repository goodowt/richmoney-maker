import { COMPANY_SIZE_OPTIONS, INSURANCE_RATES_2026 } from "@/lib/calculators/rates";

export function InsuranceInfoSections() {
  const rates = INSURANCE_RATES_2026;

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>세금을 떼기 전 한 달 급여를 &ldquo;월 보수액&rdquo;에 입력해요.</li>
          <li>
            내가 다니는(또는 운영하는) 회사의 규모를 골라요. 잘 모르겠으면 대부분의 중소기업이
            해당하는 &ldquo;상시 150인 미만&rdquo;을 선택하면 돼요.
          </li>
          <li>표에서 &ldquo;근로자&rdquo; 칸이 내 월급에서 실제로 빠지는 금액이에요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          4대보험, 누가 얼마씩 내는 건가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          4대보험료는 나(근로자) 혼자 내는 게 아니에요. 회사(사업주)도 나를 위해 똑같이 돈을
          보태서 함께 내줘요. 즉, 내 월급에서 빠져나가는 돈과 거의 비슷한 금액을 회사도 추가로
          부담하는 셈이에요.
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/75">
          <li>
            <strong>국민연금·건강보험(장기요양보험 포함)</strong> — 나와 회사가 정확히 반반씩
            내요.
          </li>
          <li>
            <strong>고용보험</strong> — 실업급여를 위한 부분(0.9%)은 나와 회사가 똑같이 내지만,
            &ldquo;고용안정·직업능력개발사업&rdquo;이라는 부분은 회사만 내요. 이 부분은 회사
            크기(직원 수)에 따라 요율이 달라져요. 회사가 클수록 이 요율이 조금 더 높아요.
          </li>
          <li>
            <strong>산재보험</strong> — 일하다 다쳤을 때를 대비한 보험인데, 이건 회사가
            100% 다 내서 내 월급에서는 전혀 빠지지 않아요. 그래서 이 계산기에는 포함하지
            않았어요.
          </li>
        </ul>
      </section>

      <section aria-labelledby="company-size-heading">
        <h2 id="company-size-heading" className="text-xl font-bold">
          사업장 규모별 고용보험료율(사업주 부담분)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          아래 표는 회사가 내는 고용보험료 비율이에요. 직원 수가 많은 회사일수록 &ldquo;고용안정·
          직업능력개발사업&rdquo; 요율이 조금씩 높아지는 걸 볼 수 있어요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">사업장 규모</th>
                <th className="px-4 py-2 text-right font-medium">고용안정·직업능력개발사업</th>
                <th className="px-4 py-2 text-right font-medium">실업급여 포함 합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPANY_SIZE_OPTIONS.map((option) => {
                const stabilityRate =
                  rates.employmentInsurance.employerStabilityRateByCompanySize[option.value];
                const total = rates.employmentInsurance.employerUnemploymentRate + stabilityRate;
                return (
                  <tr key={option.value}>
                    <td className="px-4 py-2">{option.label}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {(stabilityRate * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums font-medium">
                      {(total * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">
          근로자 부담분(실업급여 {(rates.employmentInsurance.employeeRate * 100).toFixed(1)}%)은
          회사 규모와 상관없이 누구나 똑같아요.
        </p>
      </section>
    </div>
  );
}
