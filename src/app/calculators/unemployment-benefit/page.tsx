import { CalculatorShell } from "@/components/calculator-shell";
import { UnemploymentBenefitCalculatorForm } from "@/components/calculators/unemployment-benefit-calculator-form";
import { UnemploymentBenefitInfoSections } from "@/components/calculators/unemployment-benefit-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { unemploymentBenefitFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("unemployment-benefit")!;

export const metadata = buildToolMetadata(tool);

export default function UnemploymentBenefitCalculatorPage() {
  return (
    <CalculatorShell activeSlug="unemployment-benefit">
      <UnemploymentBenefitCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <UnemploymentBenefitInfoSections />
      <FaqSection items={unemploymentBenefitFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
