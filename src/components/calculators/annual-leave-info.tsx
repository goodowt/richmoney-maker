import { calculateEntitledLeaveDays } from "@/lib/calculators/annual-leave";

const SAMPLE_SERVICE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 21];

export function AnnualLeaveInfoSections() {
  const yearsTable = SAMPLE_SERVICE_YEARS.map((years) => ({
    years,
    days: calculateEntitledLeaveDays(years * 12),
  }));

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-black/70 dark:text-white/70">
          <li>회사에 입사한 날짜를 &ldquo;입사일&rdquo;에 입력해요.</li>
          <li>
            연차를 계산하고 싶은 날짜(보통 오늘, 또는 퇴사 예정일)를 &ldquo;연차 산정
            기준일&rdquo;에 입력해요.
          </li>
          <li>월급과 하루 근무시간, 주 근무일수를 입력해요.</li>
          <li>지금까지 사용한 연차일수를 입력하면, 남은 연차와 연차수당이 나와요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          연차수당이 뭔가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
          연차(연차유급휴가)는 회사를 다니면서 <strong>돈을 받으면서 쉴 수 있는 날</strong>
          이에요. 그런데 회사 사정 등으로 이 연차를 다 못 쓰고 한 해가 지나가버리면,
          회사는 <strong>못 쓴 연차만큼 돈으로 돌려줘야</strong> 해요. 이 돈이
          연차수당이에요.
        </p>
      </section>

      <section aria-labelledby="condition-heading">
        <h2 id="condition-heading" className="text-xl font-bold">
          연차는 얼마나 생기나요?
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-black/70 dark:text-white/70">
          <li>
            <strong>입사 후 1년 미만</strong>일 때는 한 달을 개근할 때마다 연차가 1일씩
            생겨요. 최대 11일까지 모을 수 있어요.
          </li>
          <li>
            <strong>입사 후 1년이 지나면</strong> 15일의 연차가 새로 생겨요. 여기에
            3년차부터는 2년마다 1일씩 더해져서, 최대 25일까지 늘어나요.
          </li>
          <li>
            연차를 아예 못 쓰고 1년(또는 회사가 정한 기간)이 지나면, 남은 일수만큼
            연차수당으로 받을 수 있어요.
          </li>
        </ul>
      </section>

      <section aria-labelledby="formula-heading">
        <h2 id="formula-heading" className="text-xl font-bold">
          연차수당 계산 공식은 어떻게 되나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
          연차수당 = 남은(미사용) 연차일수 × 1일 통상임금이에요. 1일 통상임금은
          &ldquo;월급 ÷ 월 소정근로시간 × 하루 근무시간&rdquo;으로 구해요. 여기서 월
          소정근로시간은 최저임금·주휴수당 계산기와 같은 방식으로, 주휴시간까지 포함해서
          계산해요(하루 8시간·주 5일 근무라면 209시간).
        </p>
        <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
          예를 들어 월급 300만원, 하루 8시간·주 5일 근무라면 통상시급은 약 14,354원,
          1일 통상임금은 약 114,833원이에요. 못 쓴 연차가 5일 남았다면 연차수당은 약
          574,163원이 돼요.
        </p>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-xl font-bold">
          근속연수별 연차 발생일수
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-black/60 dark:text-white/60">
          근로기준법 제60조에 따른 법정 최소 연차일수예요. 회사 내규로 이보다 더 많이
          주는 경우도 있어요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[320px] text-sm">
            <thead className="bg-black/[.03] dark:bg-white/[.06]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">근속연수</th>
                <th className="px-4 py-2 text-right font-medium">연차일수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {yearsTable.map(({ years, days }) => (
                <tr key={years}>
                  <td className="px-4 py-2">
                    {years}년차
                    {years === 21 && (
                      <span className="ml-1.5 rounded bg-black/[.06] px-1.5 py-0.5 text-xs text-black/60 dark:bg-white/10 dark:text-white/60">
                        상한 도달
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">{days}일</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
