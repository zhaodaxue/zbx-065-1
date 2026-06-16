import type { SoilType, CalculatorResult } from '../types';

export const MU_TO_SQUARE_METERS = 666.67;
export const CM_TO_METERS = 100;
export const MM_TO_METERS = 1000;

export const SOIL_COEFFICIENTS: Record<SoilType, number> = {
  sand: 1.2,
  loam: 0.6,
  clay: 0.3,
};

export function getSoilCoefficient(soilType: SoilType): number {
  return SOIL_COEFFICIENTS[soilType];
}

export function calculateSeepage(
  areaMu: number,
  depthCm: number,
  soilType: SoilType,
  durationHours: number
): CalculatorResult {
  const areaM2 = areaMu * MU_TO_SQUARE_METERS;
  const depthM = depthCm / CM_TO_METERS;
  const coefficient = getSoilCoefficient(soilType);

  const seepageVolume =
    (areaM2 * depthM * coefficient * durationHours) / MM_TO_METERS;

  const inputWaterVolume = (areaM2 * depthCm) / CM_TO_METERS;

  const seepagePercentage =
    inputWaterVolume > 0 ? (seepageVolume / inputWaterVolume) * 100 : 0;

  return {
    seepageVolume: roundToDecimal(seepageVolume, 4),
    inputWaterVolume: roundToDecimal(inputWaterVolume, 4),
    seepagePercentage: roundToDecimal(seepagePercentage, 2),
  };
}

function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
