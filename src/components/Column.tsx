import { Plus } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import type { ColumnDefinition } from '../types/board';
import type { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnDefinition;
  tasks: Task[];
  onCreateTask: (status: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const getTaskCountLabel = (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} задача`;
  }

  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} задачи`;
  }

  return `${count} задач`;
};

export const Column = ({ column, tasks, onCreateTask, onEditTask, onDeleteTask }: ColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'column', status: column.id },
  });

  return (
    <section className="flex min-h-[480px] flex-col rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-panel backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/75">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={clsx('h-11 w-2 rounded-full bg-gradient-to-b', column.accent)} />
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{column.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{getTaskCountLabel(tasks.length)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onCreateTask(column.id)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500/30 dark:hover:text-sky-300"
        >
          <Plus size={16} />
          Добавить
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={clsx(
          'flex flex-1 flex-col gap-3 rounded-3xl bg-board-grid bg-[size:18px_18px] p-2 transition',
          isOver && 'bg-sky-100/60 ring-2 ring-inset ring-sky-300 dark:bg-sky-500/10 dark:ring-sky-500/40',
        )}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-300/80 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Перетащи задачу сюда или создай новую для этой колонки.
          </div>
        )}
      </div>
    </section>
  );
};
