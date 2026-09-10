import { CalculatorShell } from "@/components/calculator-shell";
import { MinimumWageCalculatorForm } from "@/components/calculators/minimum-wage-calculator-form";
import { MinimumWageInfoSections } from "@/components/calculators/minimum-wage-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { minimumWageFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("minimum-wage")!;

export const metadata = buildToolMetadata(tool);

export default function MinimumWageCalculatorPage() {
  return (
    <CalculatorShell activeSlug="minimum-wage">
      <MinimumWageCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <MinimumWageInfoSections />
      <FaqSection items={minimumWageFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
