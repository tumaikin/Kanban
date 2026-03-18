import type { BoardRecord } from '../types/task';
import { createDemoTasks } from './demoTasks';

export const createDemoBoards = (): BoardRecord[] => {
  const timestamp = new Date().toISOString();

  return [
    {
      id: crypto.randomUUID(),
      name: 'Личная доска',
      tasks: createDemoTasks(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: crypto.randomUUID(),
      name: 'Пет-проект',
      tasks: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
};
