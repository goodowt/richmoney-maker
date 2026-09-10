import { CalculatorShell } from "@/components/calculator-shell";
import { FreelanceTaxCalculatorForm } from "@/components/calculators/freelance-tax-calculator-form";
import { FreelanceTaxInfoSections } from "@/components/calculators/freelance-tax-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { freelanceTaxFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("freelance-tax")!;

export const metadata = buildToolMetadata(tool);

export default function FreelanceTaxCalculatorPage() {
  return (
    <CalculatorShell activeSlug="freelance-tax">
      <FreelanceTaxCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <FreelanceTaxInfoSections />
      <FaqSection items={freelanceTaxFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
