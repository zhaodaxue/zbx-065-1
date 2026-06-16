import type { SavedScheme, SchemeStoreState, SoilType } from '../types';

const STORAGE_KEY = 'seepage-calculator-schemes';
const MAX_SCHEMES = 5;
const STORE_VERSION = 1;

const VALID_SOIL_TYPES: SoilType[] = ['sand', 'loam', 'clay'];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isValidScheme(scheme: unknown): scheme is SavedScheme {
  if (!scheme || typeof scheme !== 'object') return false;
  const s = scheme as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    typeof s.area === 'number' &&
    s.area > 0 &&
    typeof s.depth === 'number' &&
    s.depth > 0 &&
    typeof s.soilType === 'string' &&
    VALID_SOIL_TYPES.includes(s.soilType as SoilType) &&
    typeof s.duration === 'number' &&
    s.duration > 0 &&
    typeof s.createdAt === 'number'
  );
}

function isValidStoreState(state: unknown): state is SchemeStoreState {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  if (s.version !== STORE_VERSION) return false;
  if (!Array.isArray(s.schemes)) return false;
  return (s.schemes as unknown[]).every(isValidScheme);
}

function getDefaultState(): SchemeStoreState {
  return {
    schemes: [],
    version: STORE_VERSION,
  };
}

export function loadSchemes(): { state: SchemeStoreState; corrupted: boolean } {
  try {
    if (typeof localStorage === 'undefined') {
      return { state: getDefaultState(), corrupted: false };
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return { state: getDefaultState(), corrupted: false };
    }
    const parsed = JSON.parse(raw);
    if (isValidStoreState(parsed)) {
      return { state: parsed, corrupted: false };
    }
    localStorage.removeItem(STORAGE_KEY);
    return { state: getDefaultState(), corrupted: true };
  } catch {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    return { state: getDefaultState(), corrupted: true };
  }
}

export function saveSchemesToStorage(state: SchemeStoreState): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // ignore
  }
}

export function canAddScheme(state: SchemeStoreState): boolean {
  return state.schemes.length < MAX_SCHEMES;
}

export function isNameDuplicate(
  state: SchemeStoreState,
  name: string,
  excludeId?: string
): boolean {
  const trimmed = name.trim();
  return state.schemes.some(
    (s) => s.name.trim() === trimmed && s.id !== excludeId
  );
}

export function validateSchemeName(
  state: SchemeStoreState,
  name: string,
  excludeId?: string
): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) {
    return '方案名不可为空';
  }
  if (trimmed.length > 20) {
    return '方案名长度不超过20个字符';
  }
  if (isNameDuplicate(state, trimmed, excludeId)) {
    return '方案名已存在';
  }
  return undefined;
}

export function addScheme(
  state: SchemeStoreState,
  params: {
    name: string;
    area: number;
    depth: number;
    soilType: SoilType;
    duration: number;
  }
): { state: SchemeStoreState; scheme: SavedScheme; error?: string } {
  const nameError = validateSchemeName(state, params.name);
  if (nameError) {
    return { state, scheme: {} as SavedScheme, error: nameError };
  }
  if (!canAddScheme(state)) {
    return {
      state,
      scheme: {} as SavedScheme,
      error: `最多只能保存 ${MAX_SCHEMES} 条方案`,
    };
  }
  const newScheme: SavedScheme = {
    id: generateId(),
    name: params.name.trim(),
    area: params.area,
    depth: params.depth,
    soilType: params.soilType,
    duration: params.duration,
    createdAt: Date.now(),
  };
  const newState: SchemeStoreState = {
    ...state,
    schemes: [...state.schemes, newScheme],
  };
  saveSchemesToStorage(newState);
  return { state: newState, scheme: newScheme };
}

export function renameScheme(
  state: SchemeStoreState,
  id: string,
  newName: string
): { state: SchemeStoreState; error?: string } {
  const scheme = state.schemes.find((s) => s.id === id);
  if (!scheme) {
    return { state, error: '方案不存在' };
  }
  const nameError = validateSchemeName(state, newName, id);
  if (nameError) {
    return { state, error: nameError };
  }
  const newState: SchemeStoreState = {
    ...state,
    schemes: state.schemes.map((s) =>
      s.id === id ? { ...s, name: newName.trim() } : s
    ),
  };
  saveSchemesToStorage(newState);
  return { state: newState };
}

export function deleteScheme(
  state: SchemeStoreState,
  id: string
): SchemeStoreState {
  const newState: SchemeStoreState = {
    ...state,
    schemes: state.schemes.filter((s) => s.id !== id),
  };
  saveSchemesToStorage(newState);
  return newState;
}

export function schemeToInput(scheme: SavedScheme): {
  area: number;
  depth: number;
  soilType: SoilType;
  duration: number;
} {
  return {
    area: scheme.area,
    depth: scheme.depth,
    soilType: scheme.soilType,
    duration: scheme.duration,
  };
}

export { MAX_SCHEMES };