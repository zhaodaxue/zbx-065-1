import { useState } from 'react';
import {
  Save,
  Trash2,
  Edit3,
  Check,
  X,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import type { SavedScheme, SoilType } from '../types';
import { SOIL_COEFFICIENTS } from '../utils/calculator';

const SOIL_LABELS: Record<SoilType, string> = {
  sand: '砂质土',
  loam: '壤土',
  clay: '黏土',
};

interface SchemeListProps {
  schemes: SavedScheme[];
  selectedIds: string[];
  canSave: boolean;
  maxSchemes: number;
  saveError?: string;
  onSave: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

export default function SchemeList({
  schemes,
  selectedIds,
  canSave,
  maxSchemes,
  saveError,
  onSave,
  onRename,
  onDelete,
  onToggleSelect,
}: SchemeListProps) {
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [localSaveError, setLocalSaveError] = useState<string | undefined>();

  const handleStartSave = () => {
    setShowSaveInput(true);
    setNewName('');
    setLocalSaveError(undefined);
  };

  const handleCancelSave = () => {
    setShowSaveInput(false);
    setNewName('');
    setLocalSaveError(undefined);
  };

  const handleConfirmSave = () => {
    if (!newName.trim()) {
      setLocalSaveError('方案名不可为空');
      return;
    }
    onSave(newName);
    setShowSaveInput(false);
    setNewName('');
    setLocalSaveError(undefined);
  };

  const handleStartEdit = (scheme: SavedScheme) => {
    setEditingId(scheme.id);
    setEditName(scheme.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleConfirmEdit = (id: string) => {
    if (!editName.trim()) {
      return;
    }
    onRename(id, editName);
    setEditingId(null);
    setEditName('');
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-emerald-600" />
          方案管理
        </h2>
        <div className="text-xs text-stone-500">
          {schemes.length} / {maxSchemes} 条
        </div>
      </div>

      {saveError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-600">{saveError}</span>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {schemes.length === 0 && !showSaveInput && (
          <div className="text-center py-6 text-stone-400 text-sm">
            暂无保存的方案
          </div>
        )}

        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className={`rounded-lg border p-3 transition-all duration-200 ${
              isSelected(scheme.id)
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isSelected(scheme.id)}
                onChange={() => onToggleSelect(scheme.id)}
                className="mt-1 w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1 min-w-0">
                {editingId === scheme.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmEdit(scheme.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button
                      onClick={() => handleConfirmEdit(scheme.id)}
                      className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="确认"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 rounded-md text-stone-500 hover:bg-stone-100 transition-colors"
                      title="取消"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="font-medium text-stone-800 text-sm truncate">
                      {scheme.name}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      面积 {scheme.area} 亩 · 深度 {scheme.depth} cm ·{' '}
                      {SOIL_LABELS[scheme.soilType]}(
                      {SOIL_COEFFICIENTS[scheme.soilType]} mm/h) ·{' '}
                      {scheme.duration} h
                    </div>
                  </>
                )}
              </div>
              {editingId !== scheme.id && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(scheme)}
                    className="p-1.5 rounded-md text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="重命名"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(scheme.id)}
                    className="p-1.5 rounded-md text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {showSaveInput && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="请输入方案名称"
                className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmSave();
                  if (e.key === 'Escape') handleCancelSave();
                }}
              />
              <button
                onClick={handleConfirmSave}
                className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                title="保存"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelSave}
                className="p-2 rounded-lg bg-white border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors"
                title="取消"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {localSaveError && (
              <p className="text-xs text-red-500">{localSaveError}</p>
            )}
          </div>
        )}
      </div>

      {!showSaveInput && (
        <button
          onClick={handleStartSave}
          disabled={!canSave}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
            canSave
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {canSave
            ? schemes.length >= maxSchemes
              ? '已达最大数量'
              : '保存当前方案'
            : '请先填写有效参数'}
        </button>
      )}
    </div>
  );
}
