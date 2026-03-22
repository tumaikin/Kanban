import { MoonStar, Settings2, SunMedium, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface BoardSettingsModalProps {
  open: boolean;
  boardName: string;
  theme: 'light' | 'dark';
  onClose: () => void;
  onToggleTheme: () => void;
  onClearAll: () => void;
}

const CLEAR_CONFIRMATION = 'ОЧИСТИТЬ';

export const BoardSettingsModal = ({
  open,
  boardName,
  theme,
  onClose,
  onToggleTheme,
  onClearAll,
}: BoardSettingsModalProps) => {
  const [confirmationValue, setConfirmationValue] = useState('');

  useEffect(() => {
    if (open) {
      setConfirmationValue('');
    }
  }, [open]);

  const canClearBoard = useMemo(
    () => confirmationValue.trim().toUpperCase() === CLEAR_CONFIRMATION,
    [confirmationValue],
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className="w-full max-h-[92vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-2xl sm:rounded-[28px] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              <Settings2 size={20} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Настройки доски</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Доска «{boardName}».</p>
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

        <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
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
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
            >
              {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
              Переключить
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-rose-100 p-2.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
              <Trash2 size={18} />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-rose-900 dark:text-rose-100">Очистить задачи</h3>
              <div className="mt-3">
                <input
                  type="text"
                  value={confirmationValue}
                  onChange={(event) => setConfirmationValue(event.target.value)}
                  placeholder={CLEAR_CONFIRMATION}
                  className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-500/30 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-rose-400 dark:focus:ring-rose-500/20 sm:text-sm"
                />
              </div>

              <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={onClearAll}
                  disabled={!canClearBoard}
                  className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300 dark:disabled:bg-rose-900/50 sm:w-auto"
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
