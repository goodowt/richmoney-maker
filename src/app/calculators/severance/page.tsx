import { CalculatorShell } from "@/components/calculator-shell";
import { SeveranceCalculatorForm } from "@/components/calculators/severance-calculator-form";
import { SeveranceInfoSections } from "@/components/calculators/severance-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { severanceFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("severance")!;

export const metadata = buildToolMetadata(tool);

export default function SeveranceCalculatorPage() {
  return (
    <CalculatorShell activeSlug="severance">
      <SeveranceCalculatorForm />
      <SeveranceInfoSections />
      <FaqSection items={severanceFaq} />
    </CalculatorShell>
  );
}
