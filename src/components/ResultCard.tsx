import type { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  value: string;
  unit: string;
  icon: ReactNode;
  accentColor?: 'emerald' | 'blue' | 'amber';
}

export default function ResultCard({
  title,
  value,
  unit,
  icon,
  accentColor = 'emerald',
}: ResultCardProps) {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
      value: 'text-emerald-700',
    },
    blue: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      icon: 'text-sky-600',
      value: 'text-sky-700',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      value: 'text-amber-700',
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} p-5 shadow-sm`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={colors.icon}>{icon}</div>
        <span className="text-sm font-medium text-stone-600">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${colors.value}`}>{value}</span>
        <span className="text-sm text-stone-500">{unit}</span>
      </div>
    </div>
  );
}
