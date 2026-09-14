export function SeveranceInfoSections() {
  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>회사에 처음 출근한 날을 &ldquo;입사일&rdquo;에 입력해요.</li>
          <li>회사를 그만두는(그만둔) 날을 &ldquo;퇴사일&rdquo;에 입력해요.</li>
          <li>
            &ldquo;1일 평균임금&rdquo;을 입력해요. 이건 아래에서 쉽게 구하는 방법을 알려드릴게요.
          </li>
          <li>세전 퇴직금과, 세금을 뗀 뒤 실제로 받는 퇴직금을 바로 확인해요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          퇴직금이 뭔가요? 얼마나 일해야 받을 수 있나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          퇴직금은 회사를 그만둘 때 회사가 그동안 일한 대가로 한 번에 주는 목돈이에요. 법으로
          정해진 최소 조건은 <strong>같은 회사에서 1년 이상 계속 일했고</strong>, 일주일에
          평균 15시간 이상 일한 경우예요. 이 조건을 채우면 회사는 반드시 퇴직금을 줘야 해요.
        </p>
        <p className="mt-3 rounded-lg bg-primary-soft/50 p-4 text-sm leading-relaxed text-foreground/75">
          가장 기본적인 계산 방법은 이렇게 요약할 수 있어요.
          <br />
          <span className="font-mono text-xs sm:text-sm">
            퇴직금 = 하루치 평균임금 × 30일 × (일한 기간(일수) ÷ 365)
          </span>
          <br />
          쉽게 말하면, 1년을 꽉 채워 일했다면 &ldquo;한 달치 월급(정확히는 30일치 평균임금)&rdquo;을
          퇴직금으로 받는다고 생각하면 돼요. 2년을 일했다면 두 달치, 6개월만 일했다면 반달치 정도가
          되는 식이에요.
        </p>
      </section>

      <section aria-labelledby="avg-wage-heading">
        <h2 id="avg-wage-heading" className="text-xl font-bold">
          &ldquo;1일 평균임금&rdquo;은 어떻게 구하나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          말 그대로 &ldquo;하루에 평균 얼마씩 벌었는지&rdquo;를 나타내는 숫자예요. 구하는 방법은
          간단해요.
        </p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>퇴직일 바로 전 3개월 동안 받은 월급을 모두 더해요(기본급, 각종 수당 포함).</li>
          <li>그 3개월의 달력 날짜 수(예: 92일)를 세요.</li>
          <li>①에서 구한 금액을 ②로 나누면 1일 평균임금이 나와요.</li>
        </ol>
        <p className="mt-2 text-xs text-muted">
          정확히 계산하려면 상여금·연차수당 일부도 포함해야 하지만, 대부분은 최근 3개월 월급의
          평균으로도 충분히 비슷한 값을 얻을 수 있어요.
        </p>
      </section>

      <section aria-labelledby="tax-basics-heading">
        <h2 id="tax-basics-heading" className="text-xl font-bold">
          퇴직금에도 세금을 내나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          네, 퇴직소득세와 지방소득세를 내요. 하지만 매달 받는 월급에 매기는 세금보다 훨씬
          적게 나오도록 특별히 계산해요. 오래 일했을수록(근속연수가 길수록) 세금을 깎아주는
          부분(근속연수공제)이 커지기 때문이에요. 그래서 퇴직금은 월급보다 세금 비율이 훨씬
          낮은 경우가 대부분이에요.
        </p>
      </section>

      <section aria-labelledby="deduction-table-heading">
        <h2 id="deduction-table-heading" className="text-xl font-bold">
          퇴직소득세 근속연수공제표
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          2020년부터 적용 중인 규정이에요. &ldquo;근속연수공제&rdquo;는 오래 일한 사람일수록
          세금을 매기는 금액에서 더 많이 빼주는 제도예요. 표에서 &ldquo;근속연수&rdquo;는 일한
          햇수(1년 미만이 남으면 1년으로 올려서 계산)를 뜻해요.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">근속연수</th>
                <th className="px-4 py-2 text-right font-medium">공제액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2">5년 이하</td>
                <td className="px-4 py-2 text-right">근속연수 × 100만원</td>
              </tr>
              <tr>
                <td className="px-4 py-2">5년 초과 ~ 10년 이하</td>
                <td className="px-4 py-2 text-right">500만원 + (근속연수-5) × 200만원</td>
              </tr>
              <tr>
                <td className="px-4 py-2">10년 초과 ~ 20년 이하</td>
                <td className="px-4 py-2 text-right">1,500만원 + (근속연수-10) × 250만원</td>
              </tr>
              <tr>
                <td className="px-4 py-2">20년 초과</td>
                <td className="px-4 py-2 text-right">4,000만원 + (근속연수-20) × 300만원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
