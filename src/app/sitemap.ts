import type { MetadataRoute } from "next";
import { tools, siteConfig } from "@/lib/tools";
import { SALARY_AMOUNTS_MAN, salaryAmountPath } from "@/lib/calculators/salary-amounts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const calculatorPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.url}/calculators/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const salaryAmountPages: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/calculators/salary/table`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...SALARY_AMOUNTS_MAN.map((man) => ({
      url: `${siteConfig.url}${salaryAmountPath(man)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticPages, ...calculatorPages, ...salaryAmountPages];
}
