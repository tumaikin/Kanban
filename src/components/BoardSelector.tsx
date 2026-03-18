import { FolderKanban, LoaderCircle, LogOut, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { BoardRecord } from '../types/task';

interface BoardSelectorProps {
  boards: BoardRecord[];
  userEmail: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  onOpenBoard: (boardId: string) => void;
  onCreateBoard: (name: string) => void;
  onDeleteBoard: (board: BoardRecord) => void;
  onSignOut: () => void;
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

export const BoardSelector = ({ boards, userEmail, isLoading, isSaving, error, onOpenBoard, onCreateBoard, onDeleteBoard, onSignOut }: BoardSelectorProps) => {
  const [newBoardName, setNewBoardName] = useState('');

  const handleCreate = () => {
    const title = newBoardName.trim();
    if (!title || isSaving) {
      return;
    }

    onCreateBoard(title);
    setNewBoardName('');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-8 md:px-6">
      <div className="rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-panel backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 md:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950">
              <FolderKanban size={20} />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Доски</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{userEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            value={newBoardName}
            onChange={(event) => setNewBoardName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleCreate();
              }
            }}
            placeholder="Новая доска"
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            {isSaving ? <LoaderCircle size={18} className="animate-spin" /> : <Plus size={18} />}
            Добавить
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-[24px] border border-dashed border-slate-300/80 px-6 py-16 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <LoaderCircle size={18} className="mr-2 animate-spin" />
            Загрузка досок...
          </div>
        ) : boards.length === 0 ? (
          <div className="flex items-center justify-center rounded-[24px] border border-dashed border-slate-300/80 px-6 py-16 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Досок пока нет.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {boards.map((board) => (
              <button
                key={board.id}
                type="button"
                onClick={() => onOpenBoard(board.id)}
                className="group rounded-[24px] border border-slate-200/80 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-900/95 dark:hover:border-sky-500/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{board.name}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{getTaskCountLabel(board.tasks.length)}</p>
                  </div>
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteBoard(board);
                    }}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-300"
                    role="button"
                    aria-label="Удалить доску"
                  >
                    <Trash2 size={16} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
