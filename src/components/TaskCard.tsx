import { CalendarClock, Clock3, Pencil, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import clsx from 'clsx';
import type { Task } from '../types/task';
import { formatDate, formatDateTime, getPriorityLabel } from '../utils/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  dragOverlay?: boolean;
}

const priorityStyles = {
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20',
  high: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20',
};

interface TaskCardBodyProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  className?: string;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

const TaskCardBody = ({ task, onEdit, onDelete, className, attributes, listeners }: TaskCardBodyProps) => {
  const hasDescription = Boolean(task.description.trim());
  const hasEstimate = Boolean(task.estimate.trim());

  return (
    <article
      className={clsx(
        'group rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/95',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onDoubleClick={() => onEdit(task)}
          className={clsx('flex-1 text-left', listeners && 'cursor-grab active:cursor-grabbing')}
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center gap-2">
            <span className={clsx('rounded-full px-2.5 py-1 text-xs font-semibold uppercase ring-1', priorityStyles[task.priority])}>
              {getPriorityLabel(task.priority)}
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{task.title}</h3>
          {hasDescription && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{task.description}</p>
          )}
        </button>

        <div className="flex gap-1 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-sky-300"
            aria-label="Редактировать задачу"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-300"
            aria-label="Удалить задачу"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/80 dark:text-slate-300">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock size={14} />
            Дедлайн
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-200">{formatDate(task.dueDate)}</span>
        </div>
        {hasEstimate && (
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              Оценка
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{task.estimate}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <span>Обновлено</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">{formatDateTime(task.updatedAt)}</span>
        </div>
      </div>
    </article>
  );
};

const SortableTaskCard = ({ task, onEdit, onDelete }: Omit<TaskCardProps, 'dragOverlay'>) => {
  const sortable = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <div ref={sortable.setNodeRef} style={style}>
      <TaskCardBody
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        className={sortable.isDragging ? 'rotate-[1deg] opacity-70 shadow-2xl ring-2 ring-sky-400/40' : undefined}
        attributes={sortable.attributes}
        listeners={sortable.listeners}
      />
    </div>
  );
};

export const TaskCard = ({ task, onEdit, onDelete, dragOverlay = false }: TaskCardProps) => {
  if (dragOverlay) {
    return <TaskCardBody task={task} onEdit={onEdit} onDelete={onDelete} className="w-[320px] shadow-2xl" />;
  }

  return <SortableTaskCard task={task} onEdit={onEdit} onDelete={onDelete} />;
};
