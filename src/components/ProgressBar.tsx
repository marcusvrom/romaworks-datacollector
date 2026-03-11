import type { ProspectProgress } from '../types/lead';

type ProgressBarProps = {
  progress: ProspectProgress | null;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  if (!progress) return null;
  const percent = progress.total ? Math.round((progress.processed / progress.total) * 100) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="mb-2 text-sm text-slate-700">{progress.message}</p>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{percent}%</p>
    </div>
  );
}
