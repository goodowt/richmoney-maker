import { MINIMUM_WAGE_2026 } from "@/lib/calculators/rates";
import { calculateMinimumWage } from "@/lib/calculators/minimum-wage";
import { formatWon } from "@/lib/format";

const SAMPLE_HOURLY_WAGES = [10_320, 11_000, 12_000, 13_000, 15_000, 18_000, 20_000, 25_000];

export function MinimumWageInfoSections() {
  const wageTable = SAMPLE_HOURLY_WAGES.map((hourlyWage) => ({
    hourlyWage,
    result: calculateMinimumWage({ hourlyWage, dailyWorkHours: 8, weeklyWorkDays: 5 }),
  }));

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>시급(1시간당 받는 돈)을 &ldquo;시급&rdquo; 칸에 입력해요. 기본값은 2026년 최저시급이에요.</li>
          <li>하루에 몇 시간 일하는지 &ldquo;하루 근무시간&rdquo;에 입력해요.</li>
          <li>일주일에 며칠 일하는지 &ldquo;주 근무일수&rdquo;에 입력해요.</li>
          <li>내가 받아야 할 월급과, 최저임금법을 지키고 있는지 바로 확인할 수 있어요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          시급만 아는데 월급은 왜 다르게 나올까요? — 주휴수당
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          시급 × 하루 근무시간 × 주 근무일수 × 4.345주(한 달 평균 주 수)로 계산하면
          실제보다 적게 나와요. 일주일에 15시간 이상 일하면 하루는 <strong>일을 안 해도
          돈을 받는 &ldquo;주휴일&rdquo;</strong>이 생기고, 이때 받는 돈이 주휴수당이에요.
          그래서 실제 월급은 &ldquo;일한 시간&rdquo;이 아니라 &ldquo;일한 시간 + 주휴시간&rdquo;을
          기준으로 계산해요.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          예를 들어 하루 8시간, 주 5일(주 40시간)을 일하면 주휴시간 8시간이 더해져서
          한 달 유급 근로시간이 <strong>209시간</strong>이 돼요. 이 209시간에 시급을 곱한
          값이 월급이에요.
        </p>
      </section>

      <section aria-labelledby="rule-heading">
        <h2 id="rule-heading" className="text-xl font-bold">
          2026년 최저임금 — 얼마이고, 왜 중요한가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          2026년 최저임금은 시간급 <strong>{formatWon(MINIMUM_WAGE_2026.hourlyWage)}</strong>이에요
          (2025년보다 290원, 2.9% 올랐어요). 아르바이트든 정규직이든, 회사 규모나 업종에
          상관없이 이 금액보다 적게 주면 안 돼요. 만약 최저시급보다 적게 받고 있다면
          고용노동부에 신고해서 못 받은 차액을 청구할 수 있어요.
        </p>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-xl font-bold">
          시급별 월급 환산표 (주 5일, 하루 8시간 기준)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          가장 흔한 근무 형태인 주 40시간(하루 8시간 × 5일) 기준으로 계산한 표예요. 근무
          조건이 다르면 위 계산기에 직접 입력해서 정확한 값을 확인하세요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">시급</th>
                <th className="px-4 py-2 text-right font-medium">월급(세전)</th>
                <th className="px-4 py-2 text-right font-medium">연봉 환산</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {wageTable.map(({ hourlyWage, result }) => (
                <tr key={hourlyWage}>
                  <td className="px-4 py-2">
                    {formatWon(hourlyWage)}
                    {hourlyWage === MINIMUM_WAGE_2026.hourlyWage && (
                      <span className="ml-1.5 rounded bg-primary-soft px-1.5 py-0.5 text-xs text-foreground/60">
                        최저시급
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">
                    {formatWon(result.monthlyWage)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-foreground/60">
                    {formatWon(result.annualWage)}
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
