import { CalculatorShell } from "@/components/calculator-shell";
import { InsuranceCalculatorForm } from "@/components/calculators/insurance-calculator-form";
import { InsuranceInfoSections } from "@/components/calculators/insurance-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { insuranceFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("insurance")!;

export const metadata = buildToolMetadata(tool);

export default function InsuranceCalculatorPage() {
  return (
    <CalculatorShell activeSlug="insurance">
      <InsuranceCalculatorForm />
      <InsuranceInfoSections />
      <FaqSection items={insuranceFaq} />
    </CalculatorShell>
  );
}
