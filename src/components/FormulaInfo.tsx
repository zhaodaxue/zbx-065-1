import { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

export default function FormulaInfo() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <span className="font-medium text-stone-700">计算公式说明</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-stone-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 space-y-4 text-sm text-stone-600">
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
            <p className="font-medium text-emerald-700 mb-2">渗漏量计算公式</p>
            <p className="font-mono text-emerald-800">
              渗漏量 (m³) = 面积(亩) × 666.67 × 深度(m) × 系数 × 时长(h) / 1000
            </p>
          </div>
          <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
            <p className="font-medium text-sky-700 mb-2">输入水量计算公式</p>
            <p className="font-mono text-sky-800">
              输入水量 (m³) = 面积(亩) × 666.67 × 深度(cm) / 100
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <p className="font-medium text-amber-700 mb-2">渗漏占比计算公式</p>
            <p className="font-mono text-amber-800">
              渗漏占比 (%) = 渗漏量 / 输入水量 × 100%
            </p>
          </div>
          <div className="pt-2 border-t border-stone-100">
            <p className="font-medium text-stone-700 mb-2">土壤渗漏系数参考</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-stone-50 rounded-lg py-2">
                <p className="text-stone-600">砂质土</p>
                <p className="text-lg font-bold text-stone-800">1.2</p>
                <p className="text-xs text-stone-500">mm/h</p>
              </div>
              <div className="bg-stone-50 rounded-lg py-2">
                <p className="text-stone-600">壤土</p>
                <p className="text-lg font-bold text-stone-800">0.6</p>
                <p className="text-xs text-stone-500">mm/h</p>
              </div>
              <div className="bg-stone-50 rounded-lg py-2">
                <p className="text-stone-600">黏土</p>
                <p className="text-lg font-bold text-stone-800">0.3</p>
                <p className="text-xs text-stone-500">mm/h</p>
              </div>
            </div>
          </div>
          <div className="text-xs text-stone-500">
            <p>注：1 亩 = 666.67 平方米；深度 cm 转 m 需除以 100；渗漏系数 mm 转 m 需除以 1000</p>
          </div>
        </div>
      )}
    </div>
  );
}
