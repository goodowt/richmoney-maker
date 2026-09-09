import { CalculatorShell } from "@/components/calculator-shell";
import { SalaryCalculatorForm } from "@/components/calculators/salary-calculator-form";
import { SalaryInfoSections } from "@/components/calculators/salary-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { salaryFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("salary")!;

export const metadata = buildToolMetadata(tool);

export default function SalaryCalculatorPage() {
  return (
    <CalculatorShell activeSlug="salary">
      <SalaryCalculatorForm />
      <SalaryInfoSections />
      <FaqSection items={salaryFaq} />
    </CalculatorShell>
  );
}
