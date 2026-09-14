export type TrustVerifyLink = {
  label: string;
  /** 링크 없이 텍스트만 안내할 때(예: "관할 세무서 방문")는 생략 가능 */
  url?: string;
  note?: string;
};

/**
 * 계산기 하단에 "이 계산이 무엇을 근거로 했고, 무엇은 우리가 직접 정한 값이며,
 * 어디서 다시 확인할 수 있는지"를 밝히는 공통 신뢰도 섹션.
 *
 * assumptions: 법령·고시에서 가져온 값이 아니라 계산이 성립하도록 이 계산기가
 *   직접 정한 값(예: "지방소득세는 소득세의 10%로 계산").
 * legalBasis: 실제로 계산 로직에 반영한 법 조문·고시(파일마다 최상단 주석에
 *   이미 정리돼 있는 내용을 화면에도 노출).
 * verifyLinks: 수치의 출처가 아니라, 내 상황에 맞는 정확한 금액을 직접
 *   대조해볼 수 있는 공식 채널.
 */
export function TrustSection({
  assumptions,
  legalBasis,
  verifyLinks,
}: {
  assumptions: string[];
  legalBasis: string[];
  verifyLinks: TrustVerifyLink[];
}) {
  return (
    <section aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="text-xl font-bold">
        이 계산의 근거와 확인 방법
      </h2>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground">계산 가정값</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          아래 항목은 법령·고시에서 가져온 값이 아니라, 계산이 성립하도록 이 계산기가
          직접 정한 값이에요.
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          {assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-foreground">법령·제도 근거</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/75">
          {legalBasis.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-foreground">직접 확인하실 수 있는 곳</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          아래는 수치를 가져온 출처가 아니라, 내 상황에 맞는 정확한 금액을 직접
          대조해볼 수 있는 공식 채널이에요.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground/75">
          {verifyLinks.map((link) => (
            <li key={link.label}>
              {link.url ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {link.label}
                </a>
              ) : (
                <span className="font-medium">{link.label}</span>
              )}
              {link.note ? <span className="text-foreground/60"> — {link.note}</span> : null}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        이 계산기의 결과는 입력값과 공개된 세율·요율을 바탕으로 한 추정치이며, 실제
        금액은 개별 조건·시점에 따라 달라질 수 있어요. 중요한 금전 결정 전에는 위 공식
        채널이나 전문가 상담으로 한 번 더 확인하세요.
      </p>
    </section>
  );
}
