export function YearEndTaxInfoSections() {
  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>총급여액(비과세 제외)과 1년간 이미 낸 원천징수세액을 입력해요.</li>
          <li>부양가족·자녀 수와 신용카드 등 사용액을 입력해요.</li>
          <li>
            의료비·교육비·보험료·기부금, 연금저축·IRP, 주택자금·월세 등 해당하는 항목만
            채워요. 해당 없는 항목은 0으로 두면 돼요.
          </li>
          <li>화면 오른쪽에서 예상 환급액(또는 추가납부액)을 바로 확인할 수 있어요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          연말정산이 뭔가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          회사는 매달 월급을 줄 때 국세청이 정한 &ldquo;간이세액표&rdquo;를 기준으로 소득세를
          대략 미리 떼어갑니다(원천징수). 그런데 이 금액은 어디까지나 추정치라서, 실제로 그해
          1년 동안 쓴 신용카드·의료비·교육비·기부금 같은 각종 공제 항목을 반영하지 않아요.
          그래서 다음 해 초(보통 1~2월)에 1년 치 소득과 공제 항목을 모두 모아서
          &ldquo;진짜 내야 할 세금&rdquo;을 다시 계산하고, 이미 낸 세금과 비교해 많이 냈으면
          돌려받고(환급) 적게 냈으면 더 내는(추가납부) 절차를 <strong>연말정산</strong>이라고
          해요. 환급받는 경우가 많아서 흔히 &ldquo;13월의 월급&rdquo;이라고도 불러요.
        </p>
      </section>

      <section aria-labelledby="flow-heading">
        <h2 id="flow-heading" className="text-xl font-bold">
          계산 흐름은 어떻게 되나요?
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>
            <strong>① 근로소득공제</strong>: 총급여에서 일종의 &ldquo;기본 경비&rdquo;를 구간별로
            빼서 &ldquo;근로소득금액&rdquo;을 구해요.
          </li>
          <li>
            <strong>② 소득공제</strong>: 근로소득금액에서 인적공제(부양가족 1인당 150만원),
            4대보험료, 신용카드 등 사용액, 주택청약저축·주담대이자 같은 항목을 빼서
            &ldquo;과세표준&rdquo;을 구해요. 소득공제는 세율을 곱하기 <em>전</em>에 소득 자체를
            줄여주는 항목이에요.
          </li>
          <li>
            <strong>③ 산출세액</strong>: 과세표준에 6~45% 누진세율을 적용해 세금을 계산해요.
          </li>
          <li>
            <strong>④ 세액감면·세액공제</strong>: 산출세액에서 중소기업 취업자 감면, 근로소득세액공제,
            자녀·보험료·의료비·교육비·기부금·연금계좌·월세 세액공제를 직접 빼요. 세액공제는 세율을
            곱한 <em>후</em>의 세금 자체를 깎아주는 항목이라, 같은 금액이면 소득공제보다 체감
            효과가 더 클 때가 많아요.
          </li>
          <li>
            <strong>⑤ 결정세액</strong>: 여기까지 계산한 최종 세금과, 1년간 이미 낸
            원천징수세액을 비교해 환급/추가납부를 결정해요.
          </li>
        </ul>
      </section>

      <section aria-labelledby="standard-heading">
        <h2 id="standard-heading" className="text-xl font-bold">
          표준세액공제는 뭔가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          보장성보험료·의료비·교육비·기부금(특별세액공제)이나 주택청약저축·주담대이자(특별소득공제)를
          하나도 신청하지 않은 근로자에게는 그 대신 <strong>연 13만원</strong>을 세액공제해줘요.
          반대로 저 항목 중 하나라도 신청하면 13만원 대신 실제로 계산된 공제액을 적용받아요.
          보통은 신용카드만 쓰고 의료비·보험료 등은 영수증을 챙기지 않은 경우 표준세액공제가
          유리하고, 병원비나 학원비를 꽤 썼다면 항목별로 신청하는 쪽이 더 유리해요.
        </p>
      </section>

      <section aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-xl font-bold">
          이 계산기가 다루지 않는 항목이 있나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          네, 정확한 계산을 위해 아래 항목은 이 계산기에 포함하지 않았어요. 해당 사항이 있다면
          실제 연말정산 결과와 차이가 날 수 있으니 참고해주세요.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>출산·입양 세액공제, 월세 청년 우대 공제율 등 특수 상황별 추가 혜택</li>
          <li>맞벌이 부부 인적공제 배분 최적화(부양가족을 누구에게 몰아줄지)</li>
          <li>중도 입/퇴사, 이직으로 인한 근무월수 안분 계산</li>
          <li>사업소득·기타소득 등 근로소득 외 다른 소득이 있는 경우의 종합과세</li>
        </ul>
      </section>
    </div>
  );
}
