export type Tool = {
  slug: "salary" | "severance" | "insurance" | "minimum-wage" | "weekly-holiday-pay";
  title: string;
  shortTitle: string;
  description: string;
  emoji: string;
};

export const tools: Tool[] = [
  {
    slug: "salary",
    title: "연봉 실수령액 계산기",
    shortTitle: "연봉 계산기",
    description:
      "연봉에서 4대보험료와 세금을 제외하고 실제로 받는 월급을 계산합니다.",
    emoji: "💰",
  },
  {
    slug: "severance",
    title: "퇴직금 계산기",
    shortTitle: "퇴직금 계산기",
    description:
      "입사일과 퇴사일, 평균임금을 입력하면 예상 퇴직금을 계산합니다.",
    emoji: "📦",
  },
  {
    slug: "insurance",
    title: "4대보험 계산기",
    shortTitle: "4대보험 계산기",
    description:
      "국민연금·건강보험·장기요양·고용보험의 근로자·사업주 부담액을 각각 계산합니다.",
    emoji: "🏥",
  },
  {
    slug: "minimum-wage",
    title: "최저임금 계산기",
    shortTitle: "최저임금 계산기",
    description:
      "시급을 입력하면 주휴수당을 포함한 월급을 계산하고, 2026년 최저임금 위반 여부를 확인합니다.",
    emoji: "⏱️",
  },
  {
    slug: "weekly-holiday-pay",
    title: "주휴수당 계산기",
    shortTitle: "주휴수당 계산기",
    description:
      "시급과 근무일수·개근 여부를 입력하면 1주치 주휴수당과 월·연 환산 금액을 계산합니다.",
    emoji: "🛌",
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export const siteConfig = {
  name: "리치머니메이커",
  domain: "richmoney-maker.kr",
  url: "https://richmoney-maker.kr",
  description: "내 월급, 퇴직금, 보험료가 정확히 얼마 남을까? 실수령액 계산기 허브",
  /**
   * 문의/개인정보처리방침 페이지에 공개로 노출되는 연락처.
   * TODO: 도메인 이메일(예: contact@richmoney-maker.kr)이 준비되면 이 값만 바꾸면 됩니다.
   */
  contactEmail: "contact@richmoney-maker.kr",
  /** Google Analytics 4 측정 ID */
  gaMeasurementId: "G-FK11LNQ1C9",
  /** Google 애드센스 게시자 ID */
  adsensePublisherId: "ca-pub-4652077022263362",
};
