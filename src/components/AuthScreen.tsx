import { LoaderCircle, LockKeyhole, LogIn, Mail, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface AuthScreenProps {
  isLoading: boolean;
  error: string | null;
  info: string | null;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

export const AuthScreen = ({ isLoading, error, info, onSignIn, onSignUp }: AuthScreenProps) => {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Введите email.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Пароль должен быть не короче 6 символов.');
      return;
    }

    if (mode === 'sign-in') {
      await onSignIn(email.trim(), password);
      return;
    }

    await onSignUp(email.trim(), password);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-6 md:px-6 md:py-8">
      <div className="rounded-[28px] border border-white/60 bg-white/90 p-5 shadow-panel backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950">
            <LockKeyhole size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Вход</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Email и пароль через Supabase Auth.</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('sign-in')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${mode === 'sign-in' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Войти
          </button>
          <button
            type="button"
            onClick={() => setMode('sign-up')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${mode === 'sign-up' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Регистрация
          </button>
        </div>

        {(localError || error) && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            {localError ?? error}
          </div>
        )}

        {info && (
          <div className="mb-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
            {info}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20 sm:text-sm"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20 sm:text-sm"
              placeholder="Минимум 6 символов"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            {isLoading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : mode === 'sign-in' ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {mode === 'sign-in' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>
      </div>
    </div>
  );
};
