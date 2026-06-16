import { useMemo } from 'react';
import {
  GitCompare,
  ArrowUp,
  ArrowDown,
  Upload,
  Droplets,
  Waves,
  Percent,
  Info,
} from 'lucide-react';
import type { SavedScheme, SoilType } from '../types';
import { calculateSeepage, SOIL_COEFFICIENTS } from '../utils/calculator';

const SOIL_LABELS: Record<SoilType, string> = {
  sand: '砂质土',
  loam: '壤土',
  clay: '黏土',
};

interface SchemeCompareViewProps {
  selectedSchemes: SavedScheme[];
  onLoadScheme: (scheme: SavedScheme) => void;
}

interface CompareRow {
  scheme: SavedScheme;
  seepageVolume: number;
  inputWaterVolume: number;
  seepagePercentage: number;
}

export default function SchemeCompareView({
  selectedSchemes,
  onLoadScheme,
}: SchemeCompareViewProps) {
  const compareData: CompareRow[] = useMemo(
    () =>
      selectedSchemes.map((scheme) => {
        const result = calculateSeepage(
          scheme.area,
          scheme.depth,
          scheme.soilType,
          scheme.duration
        );
        return {
          scheme,
          ...result,
        };
      }),
    [selectedSchemes]
  );

  const { maxId, minId } = useMemo(() => {
    if (compareData.length < 2) {
      return { maxId: null as string | null, minId: null as string | null };
    }
    let max = compareData[0];
    let min = compareData[0];
    for (const row of compareData) {
      if (row.seepagePercentage > max.seepagePercentage) max = row;
      if (row.seepagePercentage < min.seepagePercentage) min = row;
    }
    return {
      maxId: max.scheme.id,
      minId: min.scheme.id === max.scheme.id ? null : min.scheme.id,
    };
  }, [compareData]);

  const hasEnough = selectedSchemes.length >= 2 && selectedSchemes.length <= 3;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-emerald-600" />
          方案对比
        </h2>
        <div className="text-xs text-stone-500">
          已选 {selectedSchemes.length} / 2~3 条
        </div>
      </div>

      {!hasEnough ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
            <Info className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-stone-500 text-sm mb-1">
            {selectedSchemes.length === 0
              ? '请先在上方方案列表中勾选方案'
              : `已选择 ${selectedSchemes.length} 条方案`}
          </p>
          <p className="text-stone-400 text-xs">
            对比功能需要选择 2 ~ 3 条方案
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-2 px-3 font-medium text-stone-500 w-20">
                  指标
                </th>
                {compareData.map(({ scheme }) => (
                  <th
                    key={scheme.id}
                    className="text-left py-2 px-3 font-medium text-stone-700 min-w-[140px]"
                  >
                    <div className="truncate" title={scheme.name}>
                      {scheme.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-stone-100">
                <td className="py-2.5 px-3 text-stone-500">参数</td>
                {compareData.map(({ scheme }) => (
                  <td key={scheme.id} className="py-2.5 px-3 text-stone-600 text-xs">
                    <div>{scheme.area} 亩 · {scheme.depth} cm</div>
                    <div>
                      {SOIL_LABELS[scheme.soilType]}(
                      {SOIL_COEFFICIENTS[scheme.soilType]}) · {scheme.duration} h
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="py-2.5 px-3 text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-500" />
                    渗漏量
                  </div>
                </td>
                {compareData.map(({ scheme, seepageVolume }) => (
                  <td key={scheme.id} className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-stone-800">
                        {seepageVolume.toFixed(2)}
                      </span>
                      <span className="text-stone-400 text-xs">m³</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-stone-100">
                <td className="py-2.5 px-3 text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-emerald-500" />
                    输入水量
                  </div>
                </td>
                {compareData.map(({ scheme, inputWaterVolume }) => (
                  <td key={scheme.id} className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-stone-800">
                        {inputWaterVolume.toFixed(2)}
                      </span>
                      <span className="text-stone-400 text-xs">m³</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-amber-500" />
                    渗漏占比
                  </div>
                </td>
                {compareData.map(({ scheme, seepagePercentage }) => {
                  const isMax = scheme.id === maxId;
                  const isMin = scheme.id === minId;
                  return (
                    <td key={scheme.id} className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            isMax
                              ? 'text-red-600'
                              : isMin
                              ? 'text-emerald-600'
                              : 'text-stone-800'
                          }`}
                        >
                          {seepagePercentage.toFixed(2)}
                        </span>
                        <span className="text-stone-400 text-xs">%</span>
                        {isMax && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-red-50 text-red-600 border border-red-200">
                            <ArrowUp className="w-3 h-3" />
                            最高
                          </span>
                        )}
                        {isMin && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <ArrowDown className="w-3 h-3" />
                            最低
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isMax
                              ? 'bg-red-400'
                              : isMin
                              ? 'bg-emerald-400'
                              : 'bg-amber-400'
                          }`}
                          style={{
                            width: `${Math.min(seepagePercentage * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 px-3 text-stone-500">操作</td>
                {compareData.map(({ scheme }) => (
                  <td key={scheme.id} className="py-3 px-3">
                    <button
                      onClick={() => onLoadScheme(scheme)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      载入到主表单
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
