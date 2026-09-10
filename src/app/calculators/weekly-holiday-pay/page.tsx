import { CalculatorShell } from "@/components/calculator-shell";
import { WeeklyHolidayPayCalculatorForm } from "@/components/calculators/weekly-holiday-pay-calculator-form";
import { WeeklyHolidayPayInfoSections } from "@/components/calculators/weekly-holiday-pay-info";
import { FaqSection } from "@/components/calculators/faq-section";
import { AdUnit } from "@/components/ad-unit";
import { adSlots } from "@/lib/ad-slots";
import { weeklyHolidayPayFaq } from "@/lib/calculators/faq";
import { getTool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/metadata";

const tool = getTool("weekly-holiday-pay")!;

export const metadata = buildToolMetadata(tool);

export default function WeeklyHolidayPayCalculatorPage() {
  return (
    <CalculatorShell activeSlug="weekly-holiday-pay">
      <WeeklyHolidayPayCalculatorForm />
      <AdUnit slot={adSlots.afterResult} />
      <WeeklyHolidayPayInfoSections />
      <FaqSection items={weeklyHolidayPayFaq} />
      <AdUnit slot={adSlots.pageBottom} />
    </CalculatorShell>
  );
}
