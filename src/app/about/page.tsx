import Link from "next/link";
import { tools, siteConfig } from "@/lib/tools";
import { buildStaticPageMetadata } from "@/lib/metadata";

export const metadata = buildStaticPageMetadata(
  "소개",
  `${siteConfig.name}가 어떤 사이트인지, 계산기를 왜 만들었는지 소개합니다.`,
  "/about"
);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">{siteConfig.name} 소개</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-black/75 dark:text-white/75">
        <section>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            어떤 사이트인가요?
          </h2>
          <p className="mt-2">
            {siteConfig.name}({siteConfig.domain})는 &ldquo;내 월급, 퇴직금, 보험료가 정확히
            얼마 남을까?&rdquo;라는 질문에서 출발한 실수령액 계산기 모음 사이트입니다.
            연봉·퇴직금·4대보험을 각각 다른 사이트에서 계산해야 하는 번거로움을 줄이려고
            세 계산기를 한곳에 모았습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            무엇이 다른가요?
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>결과만 딱 보여주고 끝나지 않고, 공제 내역을 항목별로 펼쳐서 투명하게 보여줍니다.</li>
            <li>계산기 세 개가 서로 연결되어 있어, 연봉을 계산한 뒤 바로 퇴직금·4대보험까지 이어서 확인할 수 있습니다.</li>
            <li>4대보험 요율과 세법 기준을 매년 최신 값으로 업데이트하려고 노력합니다.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/calculators/${tool.slug}`}
                className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
              >
                {tool.emoji} {tool.shortTitle}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            계산 결과, 얼마나 믿을 수 있나요?
          </h2>
          <p className="mt-2">
            4대보험료는 실제 요율을 그대로 적용해 정확도가 높습니다. 소득세·퇴직소득세는
            국세청이 공개한 계산 방식을 최대한 그대로 구현했지만, 실제 회사의 원천징수
            금액과는 소폭 차이가 날 수 있습니다. 이 사이트의 계산 결과는 참고용이며, 정확한
            금액은 회사 급여 담당자나 세무 전문가에게 확인하시길 권장합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-black dark:text-white">운영자 문의</h2>
          <p className="mt-2">
            오류 제보나 개선 제안은{" "}
            <Link href="/contact" className="underline underline-offset-4">
              문의 페이지
            </Link>
            를 통해 언제든 보내주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
