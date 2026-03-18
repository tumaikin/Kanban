import { AlertCircle, Database, ExternalLink } from 'lucide-react';

export const SupabaseSetup = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-8 md:px-6">
    <div className="rounded-[28px] border border-white/60 bg-white/90 p-6 shadow-panel backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950">
          <Database size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Настрой Supabase</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Без URL и anon key приложение не сможет загрузить доски.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
        <p className="mb-3 font-medium">1. Создай файл `.env` в корне проекта</p>
        <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-4 text-slate-100">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
        <p className="mt-3 font-medium">2. Выполни SQL из `supabase/schema.sql` в SQL Editor</p>
        <p className="mt-2 font-medium">3. Перезапусти `npm run dev`</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
        >
          <ExternalLink size={16} />
          Открыть Supabase
        </a>
        <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <AlertCircle size={16} />
          Пример переменных лежит в `.env.example`
        </span>
      </div>
    </div>
  </div>
);
