import type { BoardColumnConfig } from '../types/board';
import type { TaskStatus } from '../types/task';

export const DEFAULT_BOARD_COLUMNS: BoardColumnConfig[] = [
  { id: 'backlog', title: 'Идеи', accent: 'from-slate-500 to-slate-400' },
  { id: 'review', title: 'План', accent: 'from-amber-500 to-orange-400' },
  { id: 'in-progress', title: 'В работе', accent: 'from-sky-500 to-cyan-400' },
  { id: 'done', title: 'Готово', accent: 'from-emerald-500 to-teal-400' },
];

const DEFAULT_COLUMNS_BY_ID = new Map(DEFAULT_BOARD_COLUMNS.map((column) => [column.id, column]));

export const normalizeBoardColumns = (value: unknown): BoardColumnConfig[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_BOARD_COLUMNS;
  }

  const seen = new Set<TaskStatus>();
  const normalized = value.reduce<BoardColumnConfig[]>((columns, entry) => {
    if (!entry || typeof entry !== 'object') {
      return columns;
    }

    const candidate = entry as Partial<BoardColumnConfig>;
    if (!candidate.id || !DEFAULT_COLUMNS_BY_ID.has(candidate.id)) {
      return columns;
    }

    const id = candidate.id as TaskStatus;
    if (seen.has(id)) {
      return columns;
    }

    seen.add(id);
    const fallback = DEFAULT_COLUMNS_BY_ID.get(id)!;
    columns.push({
      id,
      title: typeof candidate.title === 'string' && candidate.title.trim() ? candidate.title.trim() : fallback.title,
      accent: fallback.accent,
    });
    return columns;
  }, []);

  if (normalized.length === DEFAULT_BOARD_COLUMNS.length) {
    return normalized;
  }

  return DEFAULT_BOARD_COLUMNS.map((column) => normalized.find((entry) => entry.id === column.id) ?? column);
};
