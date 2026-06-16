import type { ReactNode } from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  unit?: string;
  error?: string;
  icon?: ReactNode;
}

export default function InputField({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
  unit,
  error,
  icon,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-stone-800 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            icon ? 'pl-10' : 'pl-3'
          } ${unit ? 'pr-16' : 'pr-3'} ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-stone-300 focus:border-emerald-500 focus:ring-emerald-200'
          }`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
