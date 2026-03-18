export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type SortOption = 'createdAt' | 'dueDate' | 'priority';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  tags: string[];
  dueDate: string;
  estimate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  tags: string;
  dueDate: string;
  estimate: string;
  status: TaskStatus;
}

export interface FilterState {
  search: string;
  priority: 'all' | TaskPriority;
  status: 'all' | TaskStatus;
  tag: 'all' | string;
  sortBy: SortOption;
}

export interface BoardRecord {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
