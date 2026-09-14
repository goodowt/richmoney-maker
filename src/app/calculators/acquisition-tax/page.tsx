import { CalculatorShell } from "@/components/calculator-shell";
import { AcquisitionTaxCalculatorForm } from "@/components/calculators/acquisition-tax-calculator-form";
import { AcquisitionTaxInfoSections } from "@/components/calculators/acquisition-tax-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { acquisitionTaxFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("acquisition-tax")!;

export const metadata = buildToolMetadata(tool);

export default function AcquisitionTaxCalculatorPage() {
  return (
    <CalculatorShell activeSlug="acquisition-tax">
      <AcquisitionTaxCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <AcquisitionTaxInfoSections />
      <FaqSection items={acquisitionTaxFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
