import type { BoardRecord } from '../types/task';
import { DEFAULT_BOARD_COLUMNS } from './columns';
import { createDemoTasks } from './demoTasks';

export const createDemoBoards = (): BoardRecord[] => {
  const timestamp = new Date().toISOString();

  return [
    {
      id: crypto.randomUUID(),
      name: 'Личная доска',
      columns: DEFAULT_BOARD_COLUMNS,
      tasks: createDemoTasks(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: crypto.randomUUID(),
      name: 'Пет-проект',
      columns: DEFAULT_BOARD_COLUMNS,
      tasks: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
};
