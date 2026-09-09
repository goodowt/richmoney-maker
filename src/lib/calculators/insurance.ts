import { INSURANCE_RATES_2026, type CompanySize } from "./rates";
import { clamp } from "./tax-utils";

export type InsuranceCalculatorInput = {
  /** 월 보수액(원) — 4대보험 산정 기준 보수월액 */
  monthlySalary: number;
  companySize: CompanySize;
};

export type InsuranceLine = {
  employee: number;
  employer: number;
  total: number;
};

export type InsuranceCalculatorResult = {
  input: InsuranceCalculatorInput;
  nationalPension: InsuranceLine;
  healthInsurance: InsuranceLine;
  longTermCare: InsuranceLine;
  employmentInsurance: InsuranceLine;
  employeeTotal: number;
  employerTotal: number;
  grandTotal: number;
};

export function calculateInsurance(input: InsuranceCalculatorInput): InsuranceCalculatorResult {
  const rates = INSURANCE_RATES_2026;

  const pensionBase = clamp(
    input.monthlySalary,
    rates.nationalPension.minMonthlyBase,
    rates.nationalPension.maxMonthlyBase
  );
  const pensionEmployee = Math.round(pensionBase * rates.nationalPension.employeeRate);
  const pensionEmployer = pensionEmployee; // 근로자와 동일 요율

  const healthEmployee = Math.round(input.monthlySalary * rates.healthInsurance.employeeRate);
  const healthEmployer = healthEmployee;

  const longTermEmployee = Math.round(healthEmployee * rates.longTermCare.rateOfHealthInsurance);
  const longTermEmployer = Math.round(healthEmployer * rates.longTermCare.rateOfHealthInsurance);

  const employmentEmployee = Math.round(input.monthlySalary * rates.employmentInsurance.employeeRate);
  const employerStabilityRate =
    rates.employmentInsurance.employerStabilityRateByCompanySize[input.companySize];
  const employmentEmployer = Math.round(
    input.monthlySalary *
      (rates.employmentInsurance.employerUnemploymentRate + employerStabilityRate)
  );

  const line = (employee: number, employer: number): InsuranceLine => ({
    employee,
    employer,
    total: employee + employer,
  });

  const nationalPension = line(pensionEmployee, pensionEmployer);
  const healthInsurance = line(healthEmployee, healthEmployer);
  const longTermCare = line(longTermEmployee, longTermEmployer);
  const employmentInsurance = line(employmentEmployee, employmentEmployer);

  const employeeTotal =
    nationalPension.employee + healthInsurance.employee + longTermCare.employee + employmentInsurance.employee;
  const employerTotal =
    nationalPension.employer + healthInsurance.employer + longTermCare.employer + employmentInsurance.employer;

  return {
    input,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    employeeTotal,
    employerTotal,
    grandTotal: employeeTotal + employerTotal,
  };
}
