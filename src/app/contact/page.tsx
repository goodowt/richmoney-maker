import { siteConfig } from "@/lib/tools";
import { buildStaticPageMetadata } from "@/lib/metadata";

export const metadata = buildStaticPageMetadata(
  "문의",
  `${siteConfig.name} 운영자에게 오류 제보, 개선 제안, 광고 문의를 보내는 방법을 안내합니다.`,
  "/contact"
);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">문의</h1>
      <p className="mt-4 text-sm leading-relaxed text-black/75 dark:text-white/75">
        계산 결과 오류 제보, 요율 업데이트 제안, 새로운 계산기 아이디어, 광고/제휴 문의 등
        무엇이든 아래 이메일로 보내주세요. 가능한 한 빠르게 확인하겠습니다.
      </p>

      <div className="mt-6 rounded-xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-sm text-black/50 dark:text-white/50">이메일</p>
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="mt-1 block text-lg font-semibold underline underline-offset-4"
        >
          {siteConfig.contactEmail}
        </a>
      </div>

      <div className="mt-8 space-y-3 text-sm leading-relaxed text-black/75 dark:text-white/75">
        <p className="font-medium text-black dark:text-white">문의할 때 이렇게 적어주시면 더 빨리 도와드릴 수 있어요.</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>어떤 계산기에서 발생한 문제인지(연봉/퇴직금/4대보험)</li>
          <li>입력했던 값(연봉, 입사일 등)과 화면에 나온 결과</li>
          <li>기대했던 결과나, 참고한 다른 자료가 있다면 함께</li>
        </ul>
      </div>
    </div>
  );
}
