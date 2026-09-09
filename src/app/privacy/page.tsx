import { siteConfig } from "@/lib/tools";
import { buildStaticPageMetadata } from "@/lib/metadata";

export const metadata = buildStaticPageMetadata(
  "개인정보처리방침",
  `${siteConfig.name}의 개인정보 수집·이용, 쿠키 및 광고 서비스 운영에 관한 방침입니다.`,
  "/privacy"
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

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">개인정보처리방침</h1>
      <p className="mt-3 text-sm text-black/50 dark:text-white/50">시행일자: {EFFECTIVE_DATE}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-black/75 dark:text-white/75">
        <Section title="1. 총칙">
          <p>
            {siteConfig.name}(이하 &ldquo;사이트&rdquo;)는 이용자의 개인정보를 중요하게
            생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 방침은 사이트가
            제공하는 계산기 서비스 이용과 관련해 어떤 정보가 어떻게 처리되는지 안내합니다.
          </p>
        </Section>

        <Section title="2. 계산기 입력값 처리 방식">
          <p>
            연봉·퇴직금·4대보험 계산기에 입력하는 연봉, 입사일, 평균임금 등의 값은{" "}
            <strong>사이트 서버로 전송되지 않고, 이용자의 브라우저 안에서만 계산</strong>
            됩니다. 계산 결과는 저장되지 않으며, 페이지를 새로고침하거나 닫으면 사라집니다.
          </p>
        </Section>

        <Section title="3. 자동으로 수집되는 정보">
          <p>
            사이트는 서비스 개선과 광고 게재를 위해 Google Analytics, Google AdSense 등
            외부 서비스를 이용할 수 있습니다. 이 과정에서 쿠키(Cookie)를 통해 접속 IP,
            브라우저 정보, 방문 페이지, 체류 시간 등의 정보가 자동으로 수집될 수 있습니다.
          </p>
        </Section>

        <Section title="4. 쿠키 및 광고 서비스 안내">
          <p>
            사이트는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google을 포함한
            제3자 광고 제공업체는 쿠키를 사용해 이용자가 사이트 및 다른 사이트를 방문한
            기록을 바탕으로 맞춤 광고를 게재할 수 있습니다.
          </p>
          <p>
            이용자는{" "}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Google 광고 설정
            </a>{" "}
            또는{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              aboutads.info
            </a>
            에서 맞춤형 광고 수신을 거부할 수 있으며, 브라우저 설정에서 쿠키 저장을
            차단하거나 삭제할 수 있습니다. 다만 쿠키 저장을 차단할 경우 일부 서비스 이용에
            어려움이 있을 수 있습니다.
          </p>
        </Section>

        <Section title="5. 개인정보의 보유 및 이용 기간">
          <p>
            사이트는 별도의 회원가입이나 개인정보 수집 절차 없이 운영되며, 자동 수집되는
            접속 정보는 Google 등 해당 서비스의 정책에 따라 처리·보관됩니다.
          </p>
        </Section>

        <Section title="6. 개인정보 보호책임자 및 문의">
          <p>
            개인정보 처리와 관련한 문의사항은 아래 이메일로 연락해 주시기 바랍니다.
          </p>
          <p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </Section>

        <Section title="7. 방침의 변경">
          <p>
            본 개인정보처리방침은 법령, 정책 또는 서비스 변경에 따라 수정될 수 있으며,
            변경 시 사이트를 통해 공지합니다.
          </p>
        </Section>
      </div>
    </div>
  );
}
