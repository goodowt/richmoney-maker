import { ACQUISITION_TAX_RATES_2026 } from "./real-estate-rates";

export type AcquisitionCause = "trade" | "gift" | "inheritance" | "original";

export type AcquisitionTaxCalculatorInput = {
  /** 취득가격(원) */
  price: number;
  /** 취득원인 */
  cause: AcquisitionCause;
  /** 전용면적(㎡) */
  exclusiveArea: number;
  /** 취득 후 기준 보유주택수(1~4, 4는 "4주택 이상") — 매매일 때만 의미 있음 */
  houseCount: 1 | 2 | 3 | 4;
  /** 조정대상지역 여부 — 매매·다주택일 때만 의미 있음 */
  isAdjustedArea: boolean;
  /** 일시적 2주택(종전주택 처분 예정)이라 중과 제외 대상인지 */
  isTemporaryTwoHouse: boolean;
  /** 생애최초 주택구입 감면 대상인지(본인·배우자 모두 무주택이었고 매매·1주택인 경우만 유효) */
  isFirstTimeBuyer: boolean;
};

export type AcquisitionTaxCalculatorResult = {
  input: AcquisitionTaxCalculatorInput;
  /** 적용된 취득세율(중과 포함) */
  appliedRate: number;
  /** 중과세율이 적용됐는지 */
  isSurcharged: boolean;
  /** 감면 전 산출 취득세액 */
  calculatedAcquisitionTax: number;
  /** 생애최초 감면액 */
  firstTimeBuyerReduction: number;
  /** 감면 후 취득세액(실제 납부액) */
  acquisitionTax: number;
  localEducationTax: number;
  ruralSpecialTax: number;
  /** 전용면적 85㎡ 초과로 농어촌특별세 대상인지 */
  isRuralTaxApplicable: boolean;
  totalTax: number;
};

/** 6억 이하 1%, 6억초과~9억이하 구간비례, 9억초과 3% (주택 유상취득 표준세율) */
function standardTradeRate(price: number): number {
  const { lowUpTo, lowRate, midUpTo, highRate } = ACQUISITION_TAX_RATES_2026.standardRateBrackets;
  if (price <= lowUpTo) return lowRate;
  if (price <= midUpTo) {
    // 세율(%) = (취득가액×2/3억 - 3), 이를 소수로 환산
    return (price * 2) / 300_000_000 / 100 - 0.03;
  }
  return highRate;
}

/**
 * 아파트 취득세(+지방교육세+농어촌특별세)를 계산합니다.
 *
 * 2011년 지방세법 개정으로 옛 취득세·등록세가 하나로 통합되어, 소유권이전등기에는
 * 별도의 "등록세"가 없습니다(취득세만 납부). 매매(유상취득)는 6억/9억 구간별 표준세율
 * (1~3%)과 다주택자 중과세율(조정대상지역 2주택 8%·3주택이상 12%, 비조정대상지역
 * 3주택 8%·4주택이상 12%)을 적용하고, 증여·상속·원시취득은 각각 고정세율(3.5%·2.8%·
 * 2.8%)을 적용합니다. 지방교육세는 표준세율 구간에서 취득세액의 10%, 중과세율 구간에서
 * 과세표준의 0.4% 고정이며, 농어촌특별세는 전용면적 85㎡ 초과 주택에만 부과됩니다.
 *
 * 생애최초 주택구입 감면(한도 200만원, 취득가액 12억원 이하)은 매매·무주택자→1주택
 * 취득에만 적용되며, 감면은 취득세액에서만 차감하고(지방교육세·농어촌특별세는 그대로
 * 유지) 계산을 단순화했습니다.
 */
export function calculateAcquisitionTax(
  input: AcquisitionTaxCalculatorInput
): AcquisitionTaxCalculatorResult {
  const price = Math.max(input.price, 0);
  const area = Math.max(input.exclusiveArea, 0);
  const isRuralTaxApplicable = area > ACQUISITION_TAX_RATES_2026.ruralTaxAreaThreshold;

  let appliedRate: number;
  let isSurcharged = false;

  if (input.cause === "gift") {
    appliedRate = ACQUISITION_TAX_RATES_2026.giftRate;
  } else if (input.cause === "inheritance") {
    appliedRate = ACQUISITION_TAX_RATES_2026.inheritanceRate;
  } else if (input.cause === "original") {
    appliedRate = ACQUISITION_TAX_RATES_2026.originalAcquisitionRate;
  } else {
    // 매매(유상취득)
    const surchargeTable = input.isAdjustedArea
      ? ACQUISITION_TAX_RATES_2026.multiHouseSurchargeRate.adjusted
      : ACQUISITION_TAX_RATES_2026.multiHouseSurchargeRate.nonAdjusted;
    const surchargeRate = surchargeTable[input.houseCount];

    // 조정대상지역 2주택이라도 일시적 2주택(종전주택 처분 예정)이면 중과 제외
    const isTemporaryExempt =
      input.houseCount === 2 && input.isAdjustedArea && input.isTemporaryTwoHouse;

    if (surchargeRate !== undefined && !isTemporaryExempt) {
      appliedRate = surchargeRate;
      isSurcharged = true;
    } else {
      appliedRate = standardTradeRate(price);
    }
  }

  const calculatedAcquisitionTax = price * appliedRate;

  const isEligibleFirstTimeBuyer =
    input.cause === "trade" &&
    input.isFirstTimeBuyer &&
    input.houseCount === 1 &&
    price <= ACQUISITION_TAX_RATES_2026.firstTimeBuyer.priceLimit;
  const firstTimeBuyerReduction = isEligibleFirstTimeBuyer
    ? Math.min(calculatedAcquisitionTax, ACQUISITION_TAX_RATES_2026.firstTimeBuyer.creditLimit)
    : 0;
  const acquisitionTax = calculatedAcquisitionTax - firstTimeBuyerReduction;

  let localEducationTax: number;
  let ruralSpecialTax: number;

  if (input.cause === "trade") {
    if (isSurcharged) {
      localEducationTax = price * ACQUISITION_TAX_RATES_2026.localEduTaxRatioOnSurcharge;
      ruralSpecialTax = isRuralTaxApplicable
        ? price *
          (appliedRate >= 0.12
            ? ACQUISITION_TAX_RATES_2026.ruralTaxRatioOnSurcharge12
            : ACQUISITION_TAX_RATES_2026.ruralTaxRatioOnSurcharge8)
        : 0;
    } else {
      localEducationTax = calculatedAcquisitionTax * ACQUISITION_TAX_RATES_2026.localEduTaxRatioOnStandard;
      ruralSpecialTax = isRuralTaxApplicable ? price * ACQUISITION_TAX_RATES_2026.ruralTaxRatioOnStandard : 0;
    }
  } else {
    // 증여·상속·원시취득: 지방교육세 = (세율-2%)×20%
    localEducationTax =
      price *
      Math.max(appliedRate - ACQUISITION_TAX_RATES_2026.localEduTaxBaseRate, 0) *
      ACQUISITION_TAX_RATES_2026.localEduTaxMultiplier;
    ruralSpecialTax = isRuralTaxApplicable ? price * ACQUISITION_TAX_RATES_2026.ruralTaxRatioOnStandard : 0;
  }

  const totalTax = acquisitionTax + localEducationTax + ruralSpecialTax;

  return {
    input,
    appliedRate,
    isSurcharged,
    calculatedAcquisitionTax,
    firstTimeBuyerReduction,
    acquisitionTax,
    localEducationTax,
    ruralSpecialTax,
    isRuralTaxApplicable,
    totalTax,
  };
}
