import type { ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  icon?: ReactNode;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  icon,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 z-10">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-stone-800 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            icon ? 'pl-10' : 'pl-3'
          } pr-10 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-300 focus:border-emerald-500 focus:ring-emerald-200'
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.description ? ` — ${option.description}` : ''}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
