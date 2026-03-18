import { ArrowLeft, FolderKanban, LogOut, MoonStar, Plus, Search, SunMedium, Trash2 } from 'lucide-react';

interface HeaderProps {
  boardName: string;
  totalTasks: number;
  userEmail: string;
  theme: 'light' | 'dark';
  onBack: () => void;
  onSignOut: () => void;
  onToggleTheme: () => void;
  onOpenFilters: () => void;
  onCreateTask: () => void;
  onClearAll: () => void;
}

export const Header = ({
  boardName,
  totalTasks,
  userEmail,
  theme,
  onBack,
  onSignOut,
  onToggleTheme,
  onOpenFilters,
  onCreateTask,
  onClearAll,
}: HeaderProps) => (
  <header className="rounded-[24px] border border-white/60 bg-white/85 p-4 shadow-panel backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500/30 dark:hover:text-sky-300"
          aria-label="К списку досок"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950">
            <FolderKanban size={18} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">{boardName}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{totalTasks} задач · {userEmail}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
        >
          <Search size={18} />
          Фильтры
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
          aria-label="Переключить тему"
        >
          {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
        >
          <Trash2 size={18} />
          Очистить
        </button>
        <button
          type="button"
          onClick={onCreateTask}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
        >
          <Plus size={18} />
          Задача
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </div>
    </div>
  </header>
);
