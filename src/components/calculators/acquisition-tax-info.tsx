import { TrustSection } from "@/components/calculators/trust-section";

export function AcquisitionTaxInfoSections() {
  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl font-bold">
          이 계산기 사용법
        </h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>취득가격(매매가)과 취득원인(매매·증여·상속·원시취득)을 선택해요.</li>
          <li>전용면적을 입력해요. 85㎡를 넘으면 농어촌특별세가 추가로 붙어요.</li>
          <li>
            매매라면 취득 후 보유주택수와 조정대상지역 여부를 선택하고, 해당하면
            일시적 2주택·생애최초 주택구입도 체크해요.
          </li>
          <li>화면 오른쪽에서 취득세·지방교육세·농어촌특별세와 총 납부세액을 확인해요.</li>
        </ol>
      </section>

      <section aria-labelledby="basics-heading">
        <h2 id="basics-heading" className="text-xl font-bold">
          아파트 취득세, 등록세는 따로 안 내나요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          예전에는 취득세와 등록세를 따로 냈지만, 2011년 지방세법 개정으로 두 세금이
          <strong> 하나의 &ldquo;취득세&rdquo;</strong>로 합쳐졌어요. 그래서 아파트를 사고 나서
          소유권이전등기를 할 때 별도의 등록세는 없고, 취득세와 그 부가세금인
          지방교육세·농어촌특별세만 내면 됩니다. (저당권 설정 등기처럼 취득과 무관한
          등기에는 &ldquo;등록면허세&rdquo;라는 다른 세금이 붙는데, 아파트를 살 때는 해당
          없어요.)
        </p>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading" className="text-xl font-bold">
          2026년 아파트 취득세율표
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-primary-soft/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">취득원인 · 상황</th>
                <th className="px-4 py-2 text-right font-medium">취득세율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2">매매 · 6억원 이하</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">1%</td>
              </tr>
              <tr>
                <td className="px-4 py-2">매매 · 6억원 초과 ~ 9억원 이하</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">1~3% (구간비례)</td>
              </tr>
              <tr>
                <td className="px-4 py-2">매매 · 9억원 초과</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">3%</td>
              </tr>
              <tr>
                <td className="px-4 py-2">매매 · 조정대상지역 2주택 / 비조정 3주택</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">8%</td>
              </tr>
              <tr>
                <td className="px-4 py-2">매매 · 조정대상지역 3주택 이상 / 4주택 이상</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">12%</td>
              </tr>
              <tr>
                <td className="px-4 py-2">증여(무상취득)</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">3.5%</td>
              </tr>
              <tr>
                <td className="px-4 py-2">상속</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">2.8%</td>
              </tr>
              <tr>
                <td className="px-4 py-2">원시취득(신축 보존등기 등)</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium">2.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          여기에 지방교육세(표준세율 구간은 취득세액의 10%, 중과세율 구간은 과세표준의
          0.4% 고정)와, 전용면적 85㎡ 초과 시 농어촌특별세(표준세율 0.2%, 8% 중과 0.6%,
          12% 중과 1.0%)가 추가돼요.
        </p>
      </section>

      <section aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-xl font-bold">
          이 계산기가 다루지 않는 항목이 있나요?
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          <li>경기도·강원특별자치도 등 지방자치단체별 한시적 지역 특별감면</li>
          <li>신생아 출산가구 특례 감면(별도 요건·한도가 있어요)</li>
          <li>다주택자가 조정대상지역 내 공시가격 3억원 이상 주택을 증여하는 경우의 증여 중과(12%)</li>
          <li>공시가격 1억원 이하 주택, 상속 등으로 인한 일시적 다주택 등 세부 중과 제외 사유</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          해당 사항이 있다면 실제 세액과 차이가 날 수 있으니, 정확한 금액은 위택스나
          관할 시·군·구 세무부서에서 다시 확인하세요.
        </p>
      </section>

      <TrustSection
        assumptions={[
          "생애최초 감면(최대 200만원)만 반영하고, 그 외 지역별 한시 감면·신생아 특례 등 다른 감면은 없는 것으로 계산해요.",
          "생애최초 감면은 취득세 본세에서만 차감하고, 지방교육세·농어촌특별세는 감면 전 금액 그대로 계산해요.",
          "다주택 여부는 직접 입력한 보유주택수를 그대로 사용해요. 분양권·입주권·상속 지분처럼 주택 수 산정이 복잡한 경우는 반영하지 않아요.",
        ]}
        legalBasis={[
          "지방세법 제11조 제1항 제8호 — 주택 유상취득(매매) 표준세율(6억원 이하 1%, 6억~9억원 구간비례, 9억원 초과 3%)",
          "지방세법 제13조의2 — 다주택자 취득세 중과세율(조정대상지역 2주택 8%·3주택 이상 12%, 비조정대상지역 3주택 8%·4주택 이상 12%)",
          "지방세법 시행령 제28조의5 — 일시적 2주택 중과 제외(2026년 8월 4일 이후 신규 취득분부터 종전주택 처분기한 2년으로 단축)",
          "지방세특례제한법 제36조의3 — 생애최초 주택구입 취득세 감면(한도 200만원, 취득가액 12억원 이하, 2028년 말까지 한시)",
          "지방세법 제151조·지방세법 시행령 제130조의2 등 — 지방교육세·농어촌특별세(취득세 부가세)",
        ]}
        verifyLinks={[
          {
            label: "위택스(wetax.go.kr)",
            url: "https://www.wetax.go.kr",
            note: "지방세 미리계산으로 내 조건에 맞는 취득세를 직접 대조",
          },
          {
            label: "국가법령정보센터(law.go.kr)",
            url: "https://www.law.go.kr",
            note: "적용 법령 원문 확인",
          },
          {
            label: "관할 시·군·구 세무부서",
            note: "감면·중과 제외 요건처럼 사안에 따라 판단이 갈리는 부분은 직접 문의",
          },
        ]}
      />
    </div>
  );
}
