import { MINIMUM_WAGE_2026 } from "@/lib/calculators/rates";
import { calculateWeeklyHolidayPay } from "@/lib/calculators/weekly-holiday-pay";
import { formatWon } from "@/lib/format";
import { TrustSection } from "@/components/calculators/trust-section";

const SAMPLE_WEEKLY_HOURS = [15, 20, 25, 30, 35, 40];

export function WeeklyHolidayPayInfoSections() {
  const hourlyWage = MINIMUM_WAGE_2026.hourlyWage;
  const hoursTable = SAMPLE_WEEKLY_HOURS.map((weeklyWorkHours) => ({
    weeklyWorkHours,
    result: calculateWeeklyHolidayPay({
      hourlyWage,
      dailyWorkHours: weeklyWorkHours / 5,
      weeklyWorkDays: 5,
      isFullAttendance: true,
    }),
  }));

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>시급(1시간당 받는 돈)을 &ldquo;시급&rdquo; 칸에 입력해요.</li>
          <li>하루에 몇 시간, 일주일에 며칠 일하는지 입력해요.</li>
          <li>
            이번 주에 결근 없이 다 나갔다면 &ldquo;개근했어요&rdquo; 체크박스를 그대로
            두고, 하루라도 결근했다면 체크를 해제해요.
          </li>
          <li>1주치 주휴수당과, 그걸 한 달·1년으로 환산한 금액을 바로 볼 수 있어요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          주휴수당이 뭔가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          주휴수당은 일주일 동안 정해진 날짜에 &ldquo;다 나와서 일한&rdquo; 근로자에게,
          <strong> 일하지 않아도 하루치 돈을 더 주는 제도</strong>예요(근로기준법 제55조).
          예를 들어 월~금 5일을 다 나와서 일했다면, 다음 한 주에 하루는 일을 안 해도
          그날 임금(주휴수당)을 받을 수 있어요. 시급제·아르바이트도 조건만 맞으면
          똑같이 받을 수 있는 법정 수당이에요.
        </p>
      </section>

      <section aria-labelledby="condition-heading">
        <h2 id="condition-heading" className="text-xl font-bold">
          주휴수당을 받으려면 어떤 조건이 필요한가요?
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>
            <strong>1주 소정근로시간이 15시간 이상</strong>이어야 해요. 예를 들어 주 3일,
            하루 4시간만 일한다면(주 12시간) 조건을 채우지 못해 주휴수당이 없어요.
          </li>
          <li>
            그 주에 <strong>결근 없이 개근</strong>해야 해요. 지각이나 조퇴는 괜찮지만,
            하루라도 결근하면 그 주의 주휴수당은 발생하지 않아요.
          </li>
          <li>
            다음 주에도 계속 근무하기로 되어 있어야 한다는 판례(대법원 2021다)도 있어서,
            퇴사하는 마지막 주에는 주휴수당이 안 나올 수 있어요. 회사마다 적용이 다를 수
            있으니 애매하면 노무 상담을 받아보는 게 안전해요.
          </li>
        </ul>
      </section>

      <section aria-labelledby="formula-heading">
        <h2 id="formula-heading" className="text-xl font-bold">
          계산 공식은 어떻게 되나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          주휴수당 = 주휴시간 × 시급이고, 주휴시간은 &ldquo;(주 근로시간 ÷ 40) × 8시간
          &rdquo;으로 구해요(최대 8시간). 주 40시간(하루 8시간×5일) 이상 일하면 주휴시간은
          꽉 채운 8시간이고, 그보다 적게 일하면 비례해서 줄어들어요.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          예를 들어 시급 {formatWon(hourlyWage)}, 주 40시간을 일했다면 주휴시간 8시간 ×
          시급 = <strong>{formatWon(hourlyWage * 8)}</strong>이 1주치 주휴수당이에요. 이걸
          한 달(약 4.345주)로 환산하면 매달 대략 그만큼 더 받는 셈이 돼요.
        </p>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-xl font-bold">
          주 근무시간별 주휴수당 (2026년 최저시급 기준)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          시급 {formatWon(hourlyWage)}, 개근을 기준으로 계산한 표예요. 실제 시급이나 근무
          형태가 다르면 위 계산기에 직접 입력해서 확인하세요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">주 근무시간</th>
                <th className="px-4 py-2 text-right font-medium">1주 주휴수당</th>
                <th className="px-4 py-2 text-right font-medium">월 환산</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hoursTable.map(({ weeklyWorkHours, result }) => (
                <tr key={weeklyWorkHours}>
                  <td className="px-4 py-2">
                    {weeklyWorkHours}시간
                    {weeklyWorkHours === 40 && (
                      <span className="ml-1.5 rounded bg-primary-soft px-1.5 py-0.5 text-xs text-foreground/60">
                        풀타임
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">
                    {formatWon(result.weeklyHolidayPay)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-foreground/60">
                    {formatWon(result.monthlyHolidayPay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <TrustSection
        assumptions={[
          "그 주에 결근이 없었는지는 입력한 체크박스 값을 그대로 사용해요. 지각·조퇴가 개근 인정에 영향을 주는지는 회사 취업규칙에 따라 다를 수 있어요.",
          "월 환산 금액은 1주치 주휴수당에 평균 주 수(4.345주)를 곱해 근사한 값이에요.",
        ]}
        legalBasis={[
          "근로기준법 제55조 — 주휴일 및 주휴수당",
          "근로기준법 시행령 제30조 — 개근 요건",
        ]}
        verifyLinks={[
          {
            label: "고용노동부(moel.go.kr)",
            url: "https://www.moel.go.kr",
          },
          {
            label: "고용노동부 고객상담센터(국번없이 1350)",
            note: "주휴수당 미지급 등 신고·상담",
          },
        ]}
      />
    </div>
  );
}
