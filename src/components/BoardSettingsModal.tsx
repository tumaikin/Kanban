import { ArrowDown, ArrowUp, MoonStar, Settings2, SunMedium, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BoardColumnConfig } from '../types/board';

interface BoardSettingsModalProps {
  open: boolean;
  boardName: string;
  columns: BoardColumnConfig[];
  theme: 'light' | 'dark';
  onClose: () => void;
  onSaveSettings: (name: string, columns: BoardColumnConfig[]) => Promise<void> | void;
  onToggleTheme: () => void;
  onClearAll: () => void;
}

const CLEAR_CONFIRMATION = 'ОЧИСТИТЬ';

export const BoardSettingsModal = ({
  open,
  boardName,
  columns,
  theme,
  onClose,
  onSaveSettings,
  onToggleTheme,
  onClearAll,
}: BoardSettingsModalProps) => {
  const [nameValue, setNameValue] = useState(boardName);
  const [columnValues, setColumnValues] = useState(columns);
  const [confirmationValue, setConfirmationValue] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setNameValue(boardName);
    setColumnValues(columns);
    setConfirmationValue('');
  }, [boardName, columns, open]);

  const canClearBoard = useMemo(
    () => confirmationValue.trim().toUpperCase() === CLEAR_CONFIRMATION,
    [confirmationValue],
  );

  const canSave = useMemo(() => {
    if (!nameValue.trim()) {
      return false;
    }

    return columnValues.every((column) => column.title.trim());
  }, [columnValues, nameValue]);

  if (!open) {
    return null;
  }

  const updateColumnTitle = (index: number, title: string) => {
    setColumnValues((current) =>
      current.map((column, currentIndex) => (currentIndex === index ? { ...column, title } : column)),
    );
  };

  const moveColumn = (index: number, direction: -1 | 1) => {
    setColumnValues((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [column] = next.splice(index, 1);
      next.splice(nextIndex, 0, column);
      return next;
    });
  };

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    await onSaveSettings(
      nameValue.trim(),
      columnValues.map((column) => ({ ...column, title: column.title.trim() })),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className="w-full max-h-[92vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-2xl sm:rounded-[28px] sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              <Settings2 size={20} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Настройки доски</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Название, колонки и основные действия.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Закрыть настройки доски"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-700 dark:bg-slate-800/50">
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Название доски</label>
            <input
              type="text"
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
              placeholder="Название доски"
            />
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Колонки</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Переименование и порядок.</p>
              </div>
            </div>

            <div className="space-y-2">
              {columnValues.map((column, index) => (
                <div
                  key={column.id}
                  className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 dark:border-slate-700 dark:bg-slate-900/70"
                >
                  <div className={`h-9 w-2 rounded-full bg-gradient-to-b ${column.accent}`} />
                  <input
                    type="text"
                    value={column.title}
                    onChange={(event) => updateColumnTitle(index, event.target.value)}
                    className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveColumn(index, -1)}
                      disabled={index === 0}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
                      aria-label="Переместить колонку выше"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveColumn(index, 1)}
                      disabled={index === columnValues.length - 1}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
                      aria-label="Переместить колонку ниже"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Тема интерфейса</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Сейчас: {theme === 'dark' ? 'тёмная' : 'светлая'}
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
              >
                {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
                Переключить
              </button>
            </div>
          </div>

          <div className="rounded-[22px] border border-rose-200 bg-rose-50/70 p-3.5 dark:border-rose-500/20 dark:bg-rose-500/10">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-rose-100 p-2.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                <Trash2 size={18} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-rose-900 dark:text-rose-100">Очистить задачи</h3>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300">
                    {CLEAR_CONFIRMATION}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={confirmationValue}
                    onChange={(event) => setConfirmationValue(event.target.value)}
                    placeholder={CLEAR_CONFIRMATION}
                    className="flex-1 rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-500/30 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-rose-400 dark:focus:ring-rose-500/20"
                  />
                  <button
                    type="button"
                    onClick={onClearAll}
                    disabled={!canClearBoard}
                    className="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300 dark:disabled:bg-rose-900/50"
                  >
                    Очистить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave}
            className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 sm:w-auto"
          >
            Сохранить
          </button>
        </div>
      </section>
    </div>
  );
};
