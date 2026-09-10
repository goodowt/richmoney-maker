import { CalculatorShell } from "@/components/calculator-shell";
import { AnnualLeaveCalculatorForm } from "@/components/calculators/annual-leave-calculator-form";
import { AnnualLeaveInfoSections } from "@/components/calculators/annual-leave-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { annualLeaveFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("annual-leave")!;

export const metadata = buildToolMetadata(tool);

export default function AnnualLeaveCalculatorPage() {
  return (
    <CalculatorShell activeSlug="annual-leave">
      <AnnualLeaveCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <AnnualLeaveInfoSections />
      <FaqSection items={annualLeaveFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
