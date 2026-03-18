import type { FilterState, SortOption, Task, TaskFormValues, TaskPriority } from '../types/task';

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  priority: 'all',
  status: 'all',
  tag: 'all',
  sortBy: 'createdAt',
};

export const toTaskFormValues = (task?: Task): TaskFormValues => ({
  title: task?.title ?? '',
  description: task?.description ?? '',
  priority: task?.priority ?? 'medium',
  tags: task?.tags.join(', ') ?? '',
  dueDate: task?.dueDate ?? '',
  estimate: task?.estimate ?? '',
  status: task?.status ?? 'backlog',
});

export const parseTags = (value: string): string[] =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export const getPriorityWeight = (priority: TaskPriority) => PRIORITY_WEIGHT[priority];

export const getPriorityLabel = (priority: TaskPriority) => {
  if (priority === 'high') {
    return 'Высокий';
  }

  if (priority === 'medium') {
    return 'Средний';
  }

  return 'Низкий';
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error) {
    return fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object') {
    const candidate = error as { message?: string; details?: string; hint?: string; code?: string };
    const parts = [candidate.message, candidate.details, candidate.hint, candidate.code].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(' | ');
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};

export const getUniqueTags = (tasks: Task[]) =>
  Array.from(new Set(tasks.flatMap((task) => task.tags))).sort((left, right) => left.localeCompare(right, 'ru'));

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const compareTasks = (left: Task, right: Task, sortBy: SortOption) => {
  if (sortBy === 'priority') {
    return getPriorityWeight(right.priority) - getPriorityWeight(left.priority);
  }

  if (sortBy === 'dueDate') {
    return new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
  }

  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
};

export const filterAndSortTasks = (tasks: Task[], filters: FilterState) => {
  const query = filters.search.trim().toLowerCase();

  return tasks
    .filter((task) => {
      const matchesSearch =
        !query ||
        [task.title, task.description, task.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesTag = filters.tag === 'all' || task.tags.includes(filters.tag);

      return matchesSearch && matchesPriority && matchesStatus && matchesTag;
    })
    .sort((left, right) => compareTasks(left, right, filters.sortBy));
};
