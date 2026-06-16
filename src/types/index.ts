export type SoilType = 'sand' | 'loam' | 'clay';

export interface SoilTypeOption {
  value: SoilType;
  label: string;
  coefficient: number;
}

export interface CalculatorInput {
  area: number | null;
  depth: number | null;
  soilType: SoilType;
  duration: number | null;
}

export interface CalculatorResult {
  seepageVolume: number;
  inputWaterVolume: number;
  seepagePercentage: number;
}

export interface ValidationErrors {
  area?: string;
  depth?: string;
  soilType?: string;
  duration?: string;
}

export interface SavedScheme {
  id: string;
  name: string;
  area: number;
  depth: number;
  soilType: SoilType;
  duration: number;
  createdAt: number;
}

export interface SchemeStoreState {
  schemes: SavedScheme[];
  version: number;
}
