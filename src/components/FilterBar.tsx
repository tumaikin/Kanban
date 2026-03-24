import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { BoardColumnConfig } from '../types/board';
import type { FilterState, TaskPriority, TaskStatus } from '../types/task';

interface FilterBarProps {
  open: boolean;
  columns: BoardColumnConfig[];
  filters: FilterState;
  tags: string[];
  onChange: (next: FilterState) => void;
  onReset: () => void;
  onClose: () => void;
}

const PRIORITY_OPTIONS: Array<{ label: string; value: FilterState['priority'] }> = [
  { label: 'Все приоритеты', value: 'all' },
  { label: 'Высокий', value: 'high' },
  { label: 'Средний', value: 'medium' },
  { label: 'Низкий', value: 'low' },
];

const SORT_OPTIONS: Array<{ label: string; value: FilterState['sortBy'] }> = [
  { label: 'Ручной порядок', value: 'manual' },
  { label: 'Сначала новые', value: 'createdAt' },
  { label: 'Ближайший дедлайн', value: 'dueDate' },
  { label: 'Высокий приоритет', value: 'priority' },
];

const selectClassName =
  'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-500/20';

export const FilterBar = ({ open, columns, filters, tags, onChange, onReset, onClose }: FilterBarProps) => {
  if (!open) {
    return null;
  }

  const statusOptions: Array<{ label: string; value: FilterState['status'] }> = [
    { label: 'Все статусы', value: 'all' },
    ...columns.map((column) => ({ label: column.title, value: column.id })),
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className="w-full max-h-[92vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/95 sm:max-w-3xl sm:rounded-[28px] sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <SlidersHorizontal size={18} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Фильтры</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Закрыть фильтры"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <label className="relative block md:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={filters.search}
              onChange={(event) => onChange({ ...filters, search: event.target.value })}
              placeholder="Поиск"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
            />
          </label>

          <select
            value={filters.priority}
            onChange={(event) => onChange({ ...filters, priority: event.target.value as 'all' | TaskPriority })}
            className={selectClassName}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value as 'all' | TaskStatus })}
            className={selectClassName}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.tag}
            onChange={(event) => onChange({ ...filters, tag: event.target.value })}
            className={selectClassName}
          >
            <option value="all">Все теги</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(event) => onChange({ ...filters, sortBy: event.target.value as FilterState['sortBy'] })}
            className={selectClassName}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500/30 dark:hover:text-sky-300 sm:w-auto"
          >
            Сбросить
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 sm:w-auto"
          >
            Готово
          </button>
        </div>
      </section>
    </div>
  );
};
