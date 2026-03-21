import { ArrowLeft, FolderKanban, LogOut, MoonStar, Plus, Search, Settings2, SunMedium } from 'lucide-react';

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
  onOpenBoardSettings: () => void;
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
  onOpenBoardSettings,
}: HeaderProps) => (
  <header className="rounded-[22px] border border-white/60 bg-white/85 p-3 shadow-panel backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500/30 dark:hover:text-sky-300"
          aria-label="К списку досок"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950">
            <FolderKanban size={17} />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white md:text-2xl">{boardName}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">{totalTasks} задач · {userEmail}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
        >
          <Search size={16} />
          Фильтры
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
          aria-label="Переключить тему"
        >
          {theme === 'dark' ? <SunMedium size={16} /> : <MoonStar size={16} />}
        </button>
        <button
          type="button"
          onClick={onOpenBoardSettings}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
        >
          <Settings2 size={16} />
          Настройки
        </button>
        <button
          type="button"
          onClick={onCreateTask}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
        >
          <Plus size={16} />
          Задача
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
        >
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </div>
  </header>
);
