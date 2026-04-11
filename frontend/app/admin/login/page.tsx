'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch, type MeResponse } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const me = await apiFetch<MeResponse>('/api/auth/me');
      if (!me.user) {
        throw new Error('Session non établie');
      }
      router.replace('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Identifiants incorrects ou serveur indisponible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-cream">Connexion administrateur</h1>
      <p className="mt-2 text-sm text-slate-400">
        Accès réservé. Les tentatives répétées sont limitées pour protéger le compte.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 glass rounded-2xl p-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-cream/10 bg-ocean-900/60 px-3 py-2 text-cream outline-none ring-sky-500/40 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-cream/10 bg-ocean-900/60 px-3 py-2 text-cream outline-none ring-sky-500/40 focus:ring-2"
          />
        </div>
        {error && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-sm text-rose-100">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-sky-500 py-2.5 text-sm font-semibold text-ocean-950 transition hover:bg-sky-400 disabled:opacity-60"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
