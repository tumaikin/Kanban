import { Settings2, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface BoardSettingsModalProps {
  open: boolean;
  boardName: string;
  onClose: () => void;
  onClearAll: () => void;
}

const CLEAR_CONFIRMATION = 'ОЧИСТИТЬ';

export const BoardSettingsModal = ({ open, boardName, onClose, onClearAll }: BoardSettingsModalProps) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <section className="w-full max-w-2xl rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
              <Settings2 size={20} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Настройки доски</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Управление доской «{boardName}» и действия, которые влияют на все задачи сразу.
              </p>
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

        <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50/70 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
          <div className="flex items-start gap-3">
            <span className="rounded-2xl bg-rose-100 p-2.5 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
              <Trash2 size={18} />
            </span>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-rose-900 dark:text-rose-100">Очистить все задачи</h3>
              <p className="mt-1 text-sm leading-6 text-rose-700/90 dark:text-rose-200/90">
                Это действие удалит все задачи на текущей доске. Чтобы случайно не очистить данные, введи слово{' '}
                <span className="font-semibold">{CLEAR_CONFIRMATION}</span>.
              </p>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-rose-900 dark:text-rose-100">
                  Подтверждение очистки
                </label>
                <input
                  type="text"
                  value={confirmationValue}
                  onChange={(event) => setConfirmationValue(event.target.value)}
                  placeholder={CLEAR_CONFIRMATION}
                  className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-500/30 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-rose-400 dark:focus:ring-rose-500/20"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={onClearAll}
                  disabled={!canClearBoard}
                  className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300 dark:disabled:bg-rose-900/50"
                >
                  Очистить все задачи
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
