import type { Metadata } from "next";
import { siteConfig, type Tool } from "./tools";

/** 계산기 페이지 공통 메타데이터(타이틀/설명/OG/트위터 카드/canonical)를 생성합니다. */
export function buildToolMetadata(tool: Tool): Metadata {
  const url = `${siteConfig.url}/calculators/${tool.slug}`;

  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
      url,
      siteName: siteConfig.name,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
    },
  };
}

export function buildStaticPageMetadata(title: string, description: string, path: string): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}
