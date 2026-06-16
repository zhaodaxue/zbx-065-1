import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MapPin,
  Droplets,
  Layers,
  Clock,
  RotateCcw,
  TrendingDown,
  Waves,
  Percent,
  Calculator as CalculatorIcon,
  AlertTriangle,
} from 'lucide-react';
import type { SoilType, CalculatorResult, SavedScheme, SchemeStoreState } from '../types';
import { calculateSeepage } from '../utils/calculator';
import {
  validateArea,
  validateDepth,
  validateDuration,
  hasErrors,
} from '../utils/validation';
import {
  loadSchemes,
  addScheme,
  renameScheme,
  deleteScheme,
  schemeToInput,
  canAddScheme,
  MAX_SCHEMES,
} from '../utils/schemeStore';
import InputField from './InputField';
import SelectField from './SelectField';
import ResultCard from './ResultCard';
import FormulaInfo from './FormulaInfo';
import SchemeList from './SchemeList';
import SchemeCompareView from './SchemeCompareView';

const soilOptions = [
  { value: 'sand', label: '砂质土', description: '渗漏系数 1.2 mm/h' },
  { value: 'loam', label: '壤土', description: '渗漏系数 0.6 mm/h' },
  { value: 'clay', label: '黏土', description: '渗漏系数 0.3 mm/h' },
];

export default function Calculator() {
  const [areaStr, setAreaStr] = useState('');
  const [depthStr, setDepthStr] = useState('');
  const [soilType, setSoilType] = useState<SoilType>('loam');
  const [durationStr, setDurationStr] = useState('');
  const [touched, setTouched] = useState({
    area: false,
    depth: false,
    soilType: false,
    duration: false,
  });

  const [storeState, setStoreState] = useState<SchemeStoreState>(() => ({
    schemes: [],
    version: 1,
  }));
  const [storeCorrupted, setStoreCorrupted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | undefined>();

  useEffect(() => {
    const { state, corrupted } = loadSchemes();
    setStoreState(state);
    setStoreCorrupted(corrupted);
  }, []);

  const area = areaStr ? parseFloat(areaStr) : null;
  const depth = depthStr ? parseFloat(depthStr) : null;
  const duration = durationStr ? parseFloat(durationStr) : null;

  const areaError = validateArea(area);
  const depthError = validateDepth(depth);
  const durationError = validateDuration(duration);

  const errors = useMemo(() => {
    const e: Record<string, string | undefined> = {};
    if (areaError) e.area = areaError;
    if (depthError) e.depth = depthError;
    if (durationError) e.duration = durationError;
    return e;
  }, [areaError, depthError, durationError]);

  const isValid = !hasErrors(errors);

  const result: CalculatorResult | null = useMemo(() => {
    if (!isValid || area === null || depth === null || duration === null) {
      return null;
    }
    return calculateSeepage(area, depth, soilType, duration);
  }, [isValid, area, depth, soilType, duration]);

  const canSave = isValid && canAddScheme(storeState);

  const handleClear = () => {
    setAreaStr('');
    setDepthStr('');
    setSoilType('loam');
    setDurationStr('');
    setTouched({
      area: false,
      depth: false,
      soilType: false,
      duration: false,
    });
  };

  const handleSaveScheme = useCallback(
    (name: string) => {
      if (
        area === null ||
        depth === null ||
        duration === null ||
        !isValid
      ) {
        setSaveError('参数无效，无法保存');
        return;
      }
      const { state, error } = addScheme(storeState, {
        name,
        area,
        depth,
        soilType,
        duration,
      });
      if (error) {
        setSaveError(error);
        return;
      }
      setSaveError(undefined);
      setStoreState(state);
    },
    [storeState, area, depth, soilType, duration, isValid]
  );

  const handleRenameScheme = useCallback(
    (id: string, name: string) => {
      const { state, error } = renameScheme(storeState, id, name);
      if (error) {
        setSaveError(error);
        return;
      }
      setSaveError(undefined);
      setStoreState(state);
    },
    [storeState]
  );

  const handleDeleteScheme = useCallback(
    (id: string) => {
      const newState = deleteScheme(storeState, id);
      setStoreState(newState);
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      setSaveError(undefined);
    },
    [storeState]
  );

  const handleToggleSelect = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((sid) => sid !== id);
        }
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, id];
      });
    },
    []
  );

  const handleLoadScheme = useCallback((scheme: SavedScheme) => {
    const input = schemeToInput(scheme);
    setAreaStr(String(input.area));
    setDepthStr(String(input.depth));
    setSoilType(input.soilType);
    setDurationStr(String(input.duration));
    setTouched({
      area: true,
      depth: true,
      soilType: true,
      duration: true,
    });
  }, []);

  const selectedSchemes = useMemo(
    () =>
      selectedIds
        .map((id) => storeState.schemes.find((s) => s.id === id))
        .filter((s): s is SavedScheme => s !== undefined),
    [selectedIds, storeState.schemes]
  );

  const dismissCorruptedNotice = () => setStoreCorrupted(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white mb-4 shadow-lg shadow-emerald-200">
            <Droplets className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">
            丘陵梯田灌区渗漏损失计算器
          </h1>
          <p className="text-stone-500 text-sm md:text-base">
            快速估算单田块日渗漏损失，辅助灌溉决策
          </p>
        </div>

        {storeCorrupted && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 max-w-2xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                本地数据损坏，已清空方案库
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                检测到存储数据格式异常，为保障使用安全已重置。您可以重新创建方案。
              </p>
            </div>
            <button
              onClick={dismissCorruptedNotice}
              className="text-amber-500 hover:text-amber-700 text-xs px-2 py-1 rounded hover:bg-amber-100 transition-colors"
            >
              知道了
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-stone-800 mb-5 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                计算参数
              </h2>
              <div className="space-y-4">
                <InputField
                  label="田块面积"
                  value={areaStr}
                  onChange={(v) => {
                    setAreaStr(v);
                    setTouched((t) => ({ ...t, area: true }));
                  }}
                  placeholder="请输入面积"
                  unit="亩"
                  error={touched.area ? areaError : undefined}
                  icon={<MapPin className="w-5 h-5" />}
                />
                <InputField
                  label="水层深度"
                  value={depthStr}
                  onChange={(v) => {
                    setDepthStr(v);
                    setTouched((t) => ({ ...t, depth: true }));
                  }}
                  placeholder="请输入深度"
                  unit="cm"
                  error={touched.depth ? depthError : undefined}
                  icon={<Waves className="w-5 h-5" />}
                />
                <SelectField
                  label="土壤类型"
                  value={soilType}
                  onChange={(v) => {
                    setSoilType(v as SoilType);
                    setTouched((t) => ({ ...t, soilType: true }));
                  }}
                  options={soilOptions}
                  error={touched.soilType ? undefined : undefined}
                  icon={<Layers className="w-5 h-5" />}
                />
                <InputField
                  label="灌水时长"
                  value={durationStr}
                  onChange={(v) => {
                    setDurationStr(v);
                    setTouched((t) => ({ ...t, duration: true }));
                  }}
                  placeholder="请输入时长"
                  unit="h"
                  error={touched.duration ? durationError : undefined}
                  icon={<Clock className="w-5 h-5" />}
                />
              </div>
              <button
                onClick={handleClear}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-600 font-medium hover:bg-stone-50 hover:border-stone-400 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                一键清空
              </button>
            </div>

            <SchemeList
              schemes={storeState.schemes}
              selectedIds={selectedIds}
              canSave={canSave}
              maxSchemes={MAX_SCHEMES}
              saveError={saveError}
              onSave={handleSaveScheme}
              onRename={handleRenameScheme}
              onDelete={handleDeleteScheme}
              onToggleSelect={handleToggleSelect}
            />

            <FormulaInfo />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-stone-800 mb-5 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
                计算结果
              </h2>

              {result ? (
                <div className="space-y-4">
                  <ResultCard
                    title="渗漏量"
                    value={result.seepageVolume.toFixed(2)}
                    unit="m³"
                    icon={<Droplets className="w-5 h-5" />}
                    accentColor="blue"
                  />
                  <ResultCard
                    title="输入水量"
                    value={result.inputWaterVolume.toFixed(2)}
                    unit="m³"
                    icon={<Waves className="w-5 h-5" />}
                    accentColor="emerald"
                  />
                  <ResultCard
                    title="渗漏占比"
                    value={result.seepagePercentage.toFixed(2)}
                    unit="%"
                    icon={<Percent className="w-5 h-5" />}
                    accentColor="amber"
                  />

                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-stone-500">渗漏占比示意</span>
                      <span className="font-medium text-amber-600">
                        {result.seepagePercentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(result.seepagePercentage, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-stone-400 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                    <CalculatorIcon className="w-8 h-8 text-stone-400" />
                  </div>
                  <p className="text-stone-400 text-sm">
                    请输入有效参数后查看结果
                  </p>
                </div>
              )}
            </div>

            <SchemeCompareView
              selectedSchemes={selectedSchemes}
              onLoadScheme={handleLoadScheme}
            />
          </div>
        </div>

        <div className="text-center mt-8 text-stone-400 text-xs">
          仅供参考，实际渗漏量受多种因素影响
        </div>
      </div>
    </div>
  );
}
