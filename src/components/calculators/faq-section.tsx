import type { FaqItem } from "@/lib/calculators/faq";

export function FaqSection({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <h2 id="faq-heading" className="text-xl font-bold">
        자주 묻는 질문
      </h2>
      <div className="mt-4 divide-y divide-black/10 dark:divide-white/10">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="cursor-pointer select-none list-none font-medium marker:content-none">
              <span className="mr-2 text-black/40 dark:text-white/40">Q.</span>
              {item.question}
            </summary>
            <p className="mt-2 pl-5 text-sm leading-relaxed text-black/65 dark:text-white/65">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
