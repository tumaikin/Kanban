import type { ColumnDefinition } from '../types/board';

export const BOARD_COLUMNS: ColumnDefinition[] = [
  { id: 'backlog', title: 'Бэклог', accent: 'from-slate-500 to-slate-400' },
  { id: 'in-progress', title: 'В работе', accent: 'from-sky-500 to-cyan-400' },
  { id: 'review', title: 'На проверке', accent: 'from-amber-500 to-orange-400' },
  { id: 'done', title: 'Готово', accent: 'from-emerald-500 to-teal-400' },
];
