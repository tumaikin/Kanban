import type { TaskStatus } from './task';

export interface BoardColumnConfig {
  id: TaskStatus;
  title: string;
  accent: string;
}

export type ColumnDefinition = BoardColumnConfig;
