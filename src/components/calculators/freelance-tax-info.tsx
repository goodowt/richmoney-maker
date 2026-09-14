import { calculateFreelanceTax } from "@/lib/calculators/freelance-tax";
import { formatWon } from "@/lib/format";

const SAMPLE_AMOUNTS = [300_000, 500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000];

export function FreelanceTaxInfoSections() {
  const table = SAMPLE_AMOUNTS.map((amount) => ({
    amount,
    result: calculateFreelanceTax({ amount, mode: "gross" }),
  }));

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>
            계약서에 적힌 금액을 알고 있다면 &ldquo;세전 계약금액으로 계산&rdquo;을,
            내 통장에 들어올(들어온) 금액을 기준으로 계약금액을 알고 싶다면
            &ldquo;실수령액으로 계산&rdquo;을 선택해요.
          </li>
          <li>금액을 입력하면 원천징수세액과 실수령액이 바로 계산돼요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          프리랜서 3.3%가 뭔가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          회사에 소속되지 않은 프리랜서(사업소득)가 일을 해주고 돈을 받을 때, 돈을
          주는 쪽(회사)이 <strong>소득세 3%와 지방소득세 0.3%를 미리 떼고</strong>{" "}
          나머지 96.7%만 지급해요. 이렇게 미리 떼는 걸 <strong>원천징수</strong>라고
          하고, 뗀 세금은 회사가 대신 세무서에 신고·납부해요. 그래서 계약서에 적힌
          금액과 실제로 통장에 들어오는 금액이 달라요.
        </p>
      </section>

      <section aria-labelledby="formula-heading">
        <h2 id="formula-heading" className="text-xl font-bold">
          계산 공식은 어떻게 되나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          원천징수세액 = 계약금액 × 3%(소득세) + 소득세 × 10%(지방소득세) =
          계약금액의 3.3%예요. 실수령액 = 계약금액 - 원천징수세액(계약금액의
          96.7%)이에요. 예를 들어 계약금액이 100만원이면 소득세 3만원 + 지방소득세
          3천원 = 3만 3천원을 떼고, 96만 7천원을 받아요.
        </p>
      </section>

      <section aria-labelledby="settlement-heading">
        <h2 id="settlement-heading" className="text-xl font-bold">
          미리 뗀 세금은 나중에 어떻게 되나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          원천징수는 &ldquo;미리 내는 세금&rdquo;일 뿐, 최종 확정된 세금이
          아니에요. 다음 해 5월에 <strong>종합소득세 신고</strong>를 하면 실제로
          내야 할 세금이 정해지는데, 1년 동안 미리 낸 원천징수세액이 이보다 많으면
          차액을 <strong>환급</strong>받고, 적으면 차액을 <strong>추가로 납부</strong>
          해요. 그래서 프리랜서는 이 신고를 꼭 챙겨야 손해를 안 봐요.
        </p>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-xl font-bold">
          계약금액별 원천징수세액·실수령액
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          세전 계약금액을 기준으로 계산한 표예요. 실제 금액이 다르면 위 계산기에
          직접 입력해서 확인하세요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">세전 계약금액</th>
                <th className="px-4 py-2 text-right font-medium">원천징수세액(3.3%)</th>
                <th className="px-4 py-2 text-right font-medium">실수령액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {table.map(({ amount, result }) => (
                <tr key={amount}>
                  <td className="px-4 py-2">{formatWon(amount)}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-foreground/60">
                    {formatWon(result.totalWithholding)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium">
                    {formatWon(result.netAmount)}
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
