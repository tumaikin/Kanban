import type { TaskStatus, BoardRecord } from './task';

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  accent: string;
}

export interface BoardCardProps {
  board: BoardRecord;
  taskCount: number;
}
