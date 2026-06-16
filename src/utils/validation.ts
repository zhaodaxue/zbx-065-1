import type { SoilType, CalculatorInput, ValidationErrors } from '../types';
import { SOIL_COEFFICIENTS } from './calculator';

export const AREA_MIN = 0.01;
export const AREA_MAX = 1000;

export const DEPTH_MIN = 0.1;
export const DEPTH_MAX = 100;

export const DURATION_MIN = 0.1;
export const DURATION_MAX = 720;

export function validateArea(area: number | null): string | undefined {
  if (area === null || area === undefined || isNaN(area)) {
    return '请输入田块面积';
  }
  if (area <= 0) {
    return '面积必须为正数';
  }
  if (area < AREA_MIN || area > AREA_MAX) {
    return `面积应在 ${AREA_MIN} ~ ${AREA_MAX} 亩之间`;
  }
  return undefined;
}

export function validateDepth(depth: number | null): string | undefined {
  if (depth === null || depth === undefined || isNaN(depth)) {
    return '请输入水层深度';
  }
  if (depth <= 0) {
    return '深度必须为正数';
  }
  if (depth < DEPTH_MIN || depth > DEPTH_MAX) {
    return `深度应在 ${DEPTH_MIN} ~ ${DEPTH_MAX} cm 之间`;
  }
  return undefined;
}

export function validateSoilType(soilType: SoilType): string | undefined {
  if (!soilType || !SOIL_COEFFICIENTS[soilType]) {
    return '请选择土壤类型';
  }
  return undefined;
}

export function validateDuration(duration: number | null): string | undefined {
  if (duration === null || duration === undefined || isNaN(duration)) {
    return '请输入灌水时长';
  }
  if (duration <= 0) {
    return '时长必须为正数';
  }
  if (duration < DURATION_MIN || duration > DURATION_MAX) {
    return `时长应在 ${DURATION_MIN} ~ ${DURATION_MAX} 小时之间`;
  }
  return undefined;
}

export function validateAll(input: CalculatorInput): ValidationErrors {
  const errors: ValidationErrors = {};

  const areaError = validateArea(input.area);
  if (areaError) errors.area = areaError;

  const depthError = validateDepth(input.depth);
  if (depthError) errors.depth = depthError;

  const soilTypeError = validateSoilType(input.soilType);
  if (soilTypeError) errors.soilType = soilTypeError;

  const durationError = validateDuration(input.duration);
  if (durationError) errors.duration = durationError;

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
