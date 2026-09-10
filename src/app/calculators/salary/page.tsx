import { CalculatorShell } from "@/components/calculator-shell";
import { SalaryCalculatorForm } from "@/components/calculators/salary-calculator-form";
import { SalaryInfoSections } from "@/components/calculators/salary-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { salaryFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("salary")!;

export const metadata = buildToolMetadata(tool);

export default function SalaryCalculatorPage() {
  return (
    <CalculatorShell activeSlug="salary">
      <SalaryCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <SalaryInfoSections />
      <FaqSection items={salaryFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
