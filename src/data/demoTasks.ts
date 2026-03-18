import type { Task } from '../types/task';

const now = new Date('2026-03-18T09:00:00.000Z');

const offsetDate = (days: number) => {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const offsetDateTime = (days: number, hours = 0) => {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(date.getUTCHours() + hours);
  return date.toISOString();
};

export const createDemoTasks = (): Task[] => [
  {
    id: 'task-demo-1',
    title: 'Рефакторинг обработки ошибок API-клиента',
    description:
      'Объединить типизированную обработку ошибок для fetch-обёрток и показывать более понятные сообщения при проблемах с авторизацией и лимитами.',
    priority: 'high',
    tags: ['фронтенд', 'api', 'техдолг'],
    dueDate: offsetDate(2),
    estimate: '4ч',
    status: 'backlog',
    createdAt: offsetDateTime(-5),
    updatedAt: offsetDateTime(-2),
  },
  {
    id: 'task-demo-2',
    title: 'Горячие клавиши для действий на доске',
    description:
      'Добавить быстрые сочетания для создания задачи, фокуса на поиске и закрытия диалогов, чтобы ежедневное планирование было быстрее.',
    priority: 'medium',
    tags: ['ux', 'продуктивность'],
    dueDate: offsetDate(5),
    estimate: '3ч',
    status: 'in-progress',
    createdAt: offsetDateTime(-4),
    updatedAt: offsetDateTime(-1, 3),
  },
  {
    id: 'task-demo-3',
    title: 'Проверить pull request по изменениям CI',
    description:
      'Проверить стратегию кеширования, убедиться, что матричные задачи выполняются параллельно, и оставить комментарии до слияния.',
    priority: 'high',
    tags: ['ревью', 'devops'],
    dueDate: offsetDate(1),
    estimate: '1.5ч',
    status: 'review',
    createdAt: offsetDateTime(-2),
    updatedAt: offsetDateTime(-1),
  },
  {
    id: 'task-demo-4',
    title: 'Выпустить виджет аналитики задач',
    description:
      'Добавить сводку по недельной пропускной способности на дашборд и зафиксировать ожидаемые метрики для заметок к релизу.',
    priority: 'low',
    tags: ['дашборд', 'релиз'],
    dueDate: offsetDate(-1),
    estimate: '2ч',
    status: 'done',
    createdAt: offsetDateTime(-8),
    updatedAt: offsetDateTime(-1, 2),
  },
];
