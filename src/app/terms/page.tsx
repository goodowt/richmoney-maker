import { siteConfig } from "@/lib/tools";
import { buildStaticPageMetadata } from "@/lib/metadata";

export const metadata = buildStaticPageMetadata(
  "이용약관",
  `${siteConfig.name} 계산기 서비스 이용에 관한 약관입니다.`,
  "/terms"
);

const EFFECTIVE_DATE = "2026년 9월 9일";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">이용약관</h1>
      <p className="mt-3 text-sm text-black/50 dark:text-white/50">시행일자: {EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-black/75 dark:text-white/75">
        <Section title="제1조 (목적)">
          <p>
            이 약관은 {siteConfig.name}(이하 &ldquo;사이트&rdquo;)가 제공하는 연봉·퇴직금·
            4대보험 계산기 등의 서비스(이하 &ldquo;서비스&rdquo;) 이용과 관련해 사이트와
            이용자의 권리·의무 및 책임사항을 정하는 것을 목적으로 합니다.
          </p>
        </Section>

        <Section title="제2조 (서비스의 내용)">
          <p>
            사이트는 이용자가 입력한 값을 바탕으로 예상 실수령액, 퇴직금, 4대보험료 등을
            계산해 참고용 정보로 제공합니다. 서비스는 별도 회원가입 없이 누구나 무료로
            이용할 수 있습니다.
          </p>
        </Section>

        <Section title="제3조 (계산 결과의 성격 및 면책)">
          <p>
            서비스가 제공하는 계산 결과는 일반적인 요율과 세법 규정을 바탕으로 한{" "}
            <strong>참고용 추정치</strong>이며, 법적 효력이 있는 공식 문서가 아닙니다.
            실제 급여, 퇴직금, 보험료는 개별 근로계약, 회사의 계산 방식, 세법 개정 등에
            따라 달라질 수 있습니다.
          </p>
          <p>
            사이트는 계산 결과의 완전성, 정확성을 보장하지 않으며, 이용자가 계산 결과를
            신뢰해 발생한 손해에 대해 법령이 허용하는 범위 내에서 책임을 지지 않습니다.
            중요한 의사결정 전에는 반드시 회사 급여 담당자, 세무사 등 전문가의 확인을
            거치시기 바랍니다.
          </p>
        </Section>

        <Section title="제4조 (이용자의 의무)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>서비스를 부정한 목적으로 이용하거나 시스템에 과도한 부하를 주는 행위를 하지 않습니다.</li>
            <li>서비스의 소스코드, 콘텐츠를 사이트의 동의 없이 무단으로 복제·배포하지 않습니다.</li>
          </ul>
        </Section>

        <Section title="제5조 (지적재산권)">
          <p>
            사이트에서 제공하는 계산 로직, 콘텐츠, 디자인 등에 대한 저작권은 사이트 운영자에게
            있습니다. 다만 계산에 사용되는 세율·요율 등 공개된 법령 정보 자체에는 별도의
            권리를 주장하지 않습니다.
          </p>
        </Section>

        <Section title="제6조 (광고 게재)">
          <p>
            사이트는 서비스 운영을 위해 Google AdSense 등을 통한 광고를 게재할 수 있습니다.
            광고 내용에 대한 책임은 해당 광고주 및 광고 플랫폼에 있습니다.
          </p>
        </Section>

        <Section title="제7조 (약관의 변경)">
          <p>
            이 약관은 필요 시 개정될 수 있으며, 개정된 약관은 사이트에 게시함으로써 효력이
            발생합니다.
          </p>
        </Section>

        <Section title="제8조 (문의)">
          <p>
            약관에 대한 문의는{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>
            로 연락해 주시기 바랍니다.
          </p>
        </Section>
      </div>
    </div>
  );
}
