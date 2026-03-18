import type { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../utils/task';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthConfigured, setIsAuthConfigured] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsAuthConfigured(false);
      setIsLoading(false);
      return;
    }

    const client = supabase;

    const init = async () => {
      setIsLoading(true);
      const { data, error: sessionError } = await client.auth.getSession();

      if (sessionError) {
        setError(getErrorMessage(sessionError, 'Не удалось получить сессию.'));
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setInfo(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(getErrorMessage(signInError, 'Не удалось войти.'));
    }

    setIsLoading(false);
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setInfo(null);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(getErrorMessage(signUpError, 'Не удалось создать аккаунт.'));
      setIsLoading(false);
      return;
    }

    if (!data.session) {
      setInfo('Аккаунт создан. Проверьте почту и подтвердите email, если в Supabase включено подтверждение.');
    }

    setIsLoading(false);
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setInfo(null);

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(getErrorMessage(signOutError, 'Не удалось выйти.'));
    }

    setIsLoading(false);
  };

  return {
    session,
    user,
    isLoading,
    isAuthConfigured,
    error,
    info,
    setError,
    setInfo,
    signIn,
    signUp,
    signOut,
  };
};
