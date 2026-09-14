import { CalculatorShell } from "@/components/calculator-shell";
import { YearEndTaxCalculatorForm } from "@/components/calculators/year-end-tax-calculator-form";
import { YearEndTaxInfoSections } from "@/components/calculators/year-end-tax-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { yearEndTaxFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("year-end-tax")!;

export const metadata = buildToolMetadata(tool);

export default function YearEndTaxCalculatorPage() {
  return (
    <CalculatorShell activeSlug="year-end-tax">
      <YearEndTaxCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <YearEndTaxInfoSections />
      <FaqSection items={yearEndTaxFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
