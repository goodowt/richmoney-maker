import { UNEMPLOYMENT_BENEFIT_2026, PRESCRIBED_BENEFIT_DAYS } from "@/lib/calculators/rates";
import { formatWon } from "@/lib/format";
import { TrustSection } from "@/components/calculators/trust-section";

const PERIOD_LABELS = ["1년 미만", "1년~3년", "3년~5년", "5년~10년", "10년 이상"];

export function UnemploymentBenefitInfoSections() {
  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>
            퇴사 전 3개월간 받은 임금총액을 그 기간의 총 일수로 나눈
            &ldquo;1일 평균임금&rdquo;을 입력해요.
          </li>
          <li>고용보험에 가입해서 일한 총 기간(년/개월)을 입력해요.</li>
          <li>50세 이상·장애인 여부와 이직 사유(비자발적 여부)를 체크해요.</li>
          <li>1일 구직급여액과 총 예상 수급액을 바로 확인할 수 있어요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          실업급여(구직급여)가 뭔가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          회사를 그만둔 뒤 새 일자리를 구하는 동안, 고용보험에서 일정 기간 생활비
          성격의 돈을 지원해주는 제도예요. 정식 명칭은 <strong>구직급여</strong>이고,
          흔히 실업급여라고 불러요. 다만 아무나 받을 수 있는 건 아니고, 본인 의사와
          무관하게 회사를 그만뒀는지(비자발적 이직) 등 여러 조건을 충족해야 해요.
        </p>
      </section>

      <section aria-labelledby="condition-heading">
        <h2 id="condition-heading" className="text-xl font-bold">
          받으려면 어떤 조건이 필요한가요?
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>
            이직일 이전 18개월 동안 고용보험에 가입해서 실제로 일한 날(피보험단위기간)이{" "}
            <strong>합쳐서 180일 이상</strong>이어야 해요.
          </li>
          <li>
            <strong>비자발적으로 이직</strong>해야 해요(권고사직, 해고, 계약만료,
            회사 폐업 등). 개인 사정으로 자진 퇴사하면 원칙적으로 대상이 아니지만,
            임금체불이나 근로조건 악화처럼 &ldquo;정당한 사유&rdquo;가 인정되면
            예외적으로 받을 수 있어요.
          </li>
          <li>
            적극적으로 재취업 활동(구직활동)을 하고 있다는 걸 고용센터에 계속
            증명해야 해요.
          </li>
        </ul>
      </section>

      <section aria-labelledby="formula-heading">
        <h2 id="formula-heading" className="text-xl font-bold">
          계산 공식은 어떻게 되나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          1일 구직급여액 = 이직 전 평균임금 × 60%예요. 다만 이 금액이 너무 크거나
          작지 않도록 2026년 기준 하루 <strong>{formatWon(UNEMPLOYMENT_BENEFIT_2026.dailyUpperLimit)}</strong>{" "}
          (상한액)를 넘을 수 없고, <strong>{formatWon(UNEMPLOYMENT_BENEFIT_2026.dailyLowerLimit)}</strong>{" "}
          (하한액) 밑으로 내려가지도 않아요. 총 예상 수급액은 이 1일 금액에
          &ldquo;소정급여일수&rdquo;(아래 표)를 곱해서 구해요.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          2026년은 최저임금 인상으로 하한액이 크게 올라 상한액과의 차이가 2,052원
          밖에 안 나요. 그래서 평균임금이 웬만큼 낮거나 높으면 1일 구직급여액이
          실제로는 상한액이나 하한액, 둘 중 하나로 정해지는 경우가 많아요.
        </p>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-xl font-bold">
          연령·가입기간별 소정급여일수
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          고용보험법 시행령 별표1에 따른 지급일수예요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">가입기간</th>
                <th className="px-4 py-2 text-right font-medium">50세 미만</th>
                <th className="px-4 py-2 text-right font-medium">50세 이상·장애인</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PRESCRIBED_BENEFIT_DAYS.map((bracket, i) => (
                <tr key={PERIOD_LABELS[i]}>
                  <td className="px-4 py-2">{PERIOD_LABELS[i]}</td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">
                    {bracket.under50}일
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">
                    {bracket.over50OrDisabled}일
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <TrustSection
        assumptions={[
          "1일 평균임금은 직접 입력한 값을 그대로 사용해요(퇴직 전 3개월 임금총액 ÷ 그 기간 총일수).",
          "이 계산기는 예상 수급액만 추정하고, 실제 수급자격(이직 사유의 정당성 인정 여부 등)은 고용센터가 최종 판단해요.",
        ]}
        legalBasis={[
          "고용보험법 제40조 — 구직급여 수급요건(피보험단위기간 180일 이상 등)",
          "고용보험법 제45·46조 — 구직급여일액 산정(평균임금의 60%, 상하한액)",
          "고용보험법 시행령 별표1 — 소정급여일수(연령·피보험기간별 120~270일)",
        ]}
        verifyLinks={[
          {
            label: "고용보험 홈페이지(ei.go.kr)",
            url: "https://www.ei.go.kr",
            note: "실업급여 모의계산으로 내 조건에 맞는 수급액을 직접 대조",
          },
          {
            label: "워크넷(work.go.kr)",
            url: "https://www.work.go.kr",
          },
          {
            label: "관할 고용센터",
            note: "수급자격 인정 여부는 방문·상담으로 최종 확인",
          },
        ]}
      />
    </div>
  );
}
