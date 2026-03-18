import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import type { TaskFormValues } from '../types/task';
import { parseTags } from '../utils/task';

interface TaskModalProps {
  open: boolean;
  initialValues: TaskFormValues;
  availableTags: string[];
  mode: 'create' | 'edit';
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

type ValidationErrors = Partial<Record<keyof TaskFormValues, string>>;

const STATUS_OPTIONS = [
  { label: 'Идеи', value: 'backlog' },
  { label: 'План', value: 'review' },
  { label: 'В работе', value: 'in-progress' },
  { label: 'Готово', value: 'done' },
] as const;

const PRIORITY_OPTIONS = [
  { label: 'Низкий', value: 'low' },
  { label: 'Средний', value: 'medium' },
  { label: 'Высокий', value: 'high' },
] as const;

const emptyErrors: ValidationErrors = {};

export const TaskModal = ({ open, initialValues, availableTags, mode, onClose, onSubmit }: TaskModalProps) => {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>(emptyErrors);

  useEffect(() => {
    setValues(initialValues);
    setErrors(emptyErrors);
  }, [initialValues, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const validate = () => {
    const nextErrors: ValidationErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = 'Введите название задачи.';
    }

    if (!values.dueDate) {
      nextErrors.dueDate = 'Укажи дедлайн.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    onSubmit(values);
  };

  const inputClassName = (field: keyof TaskFormValues) =>
    clsx(
      'w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20',
      errors[field]
        ? 'border-rose-300 dark:border-rose-500/40'
        : 'border-slate-200 dark:border-slate-700',
    );

  const tagParts = values.tags.split(',');
  const currentTagDraft = (tagParts[tagParts.length - 1] ?? '').trim().toLowerCase();
  const selectedTags = new Set(parseTags(values.tags).map((tag) => tag.toLowerCase()));
  const suggestedTags = availableTags.filter((tag) => {
    const normalizedTag = tag.toLowerCase();

    if (selectedTags.has(normalizedTag)) {
      return false;
    }

    return !currentTagDraft || normalizedTag.includes(currentTagDraft);
  });

  const appendTag = (tag: string) => {
    const nextTags = parseTags(values.tags);
    if (nextTags.some((existingTag) => existingTag.toLowerCase() === tag.toLowerCase())) {
      return;
    }

    setValues({
      ...values,
      tags: [...nextTags, tag].join(', '),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[30px] border border-white/60 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === 'create' ? 'Создать задачу' : 'Редактировать задачу'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Сохрани детали реализации, сроки и текущую колонку в одном месте.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Название</label>
              <input
                value={values.title}
                onChange={(event) => setValues({ ...values, title: event.target.value })}
                className={inputClassName('title')}
                placeholder="Настроить горячие клавиши на доске"
              />
              {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Описание</label>
              <textarea
                value={values.description}
                onChange={(event) => setValues({ ...values, description: event.target.value })}
                rows={4}
                className={inputClassName('description')}
                placeholder="Необязательно"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Приоритет</label>
              <select
                value={values.priority}
                onChange={(event) =>
                  setValues({ ...values, priority: event.target.value as TaskFormValues['priority'] })
                }
                className={inputClassName('priority')}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Статус</label>
              <select
                value={values.status}
                onChange={(event) => setValues({ ...values, status: event.target.value as TaskFormValues['status'] })}
                className={inputClassName('status')}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Дедлайн</label>
              <input
                type="date"
                value={values.dueDate}
                onChange={(event) => setValues({ ...values, dueDate: event.target.value })}
                className={inputClassName('dueDate')}
              />
              {errors.dueDate && <p className="mt-1 text-xs text-rose-500">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Оценка</label>
              <input
                value={values.estimate}
                onChange={(event) => setValues({ ...values, estimate: event.target.value })}
                className={inputClassName('estimate')}
                placeholder="Необязательно"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Теги</label>
              <input
                value={values.tags}
                onChange={(event) => setValues({ ...values, tags: event.target.value })}
                className={inputClassName('tags')}
                placeholder="фронтенд, ux, релиз"
              />
              {suggestedTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => appendTag(tag)}
                      className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/20"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Разделяй теги запятыми.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
            >
              {mode === 'create' ? 'Создать задачу' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
