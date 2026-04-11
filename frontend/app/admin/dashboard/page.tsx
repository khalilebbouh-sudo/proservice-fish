'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { apiFetch, type MeResponse, type Product, type ProductsResponse } from '@/lib/api';
import { routing } from '@/i18n/routing';

type FormState = {
  name: string;
  price: string;
  description: string;
  stock: string;
  image?: File | null;
};

const emptyForm: FormState = {
  name: '',
  price: '0',
  description: '',
  stock: '0',
  image: null,
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await apiFetch<ProductsResponse>('/api/products');
      setProducts(data.products);
    } catch {
      setLoadError('Impossible de charger le catalogue. Réessayez plus tard.');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await apiFetch<MeResponse>('/api/auth/me');
        if (!me.user) {
          router.replace('/admin/login');
          return;
        }
        await refreshProducts();
      } catch {
        router.replace('/admin/login');
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, refreshProducts]);

  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    router.replace('/admin/login');
    router.refresh();
  }

  function startEdit(p: Product) {
    const id = p.id || p._id;
    if (!id) return;
    setEditingId(String(id));
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description,
      stock: String(p.stock),
      image: null,
    });
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('price', form.price);
      fd.append('description', form.description.trim());
      fd.append('stock', form.stock);
      if (form.image) fd.append('image', form.image);

      if (editingId) {
        await apiFetch(`/api/products/${editingId}`, {
          method: 'PUT',
          body: fd,
        });
      } else {
        await apiFetch('/api/products', {
          method: 'POST',
          body: fd,
        });
      }
      cancelEdit();
      await refreshProducts();
    } catch {
      setFormError(
        "Enregistrement impossible. Vérifiez les champs, l'image (JPEG/PNG/WebP/GIF, max 2 Mo) et votre session."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      await refreshProducts();
    } catch {
      alert('Suppression impossible pour le moment.');
    }
  }

  if (checking) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-slate-400 sm:px-6">
        Vérification de la session…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cream">Tableau de bord</h1>
          <p className="text-sm text-slate-400">Gestion des produits et du stock.</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-cream/15 px-4 py-2 text-sm text-slate-200 hover:bg-cream/5"
        >
          Déconnexion
        </button>
      </div>

      <section className="mt-10 glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cream">
          {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-300">Nom</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-cream/10 bg-ocean-900/50 px-3 py-2 text-cream"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Prix (MRU)</label>
            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-cream/10 bg-ocean-900/50 px-3 py-2 text-cream"
            />
            <p className="mt-1 text-xs text-slate-500">
              Mettre <strong>0</strong> pour afficher « prix sur demande » sur le site public.
            </p>
          </div>
          <div>
            <label className="text-sm text-slate-300">Stock</label>
            <input
              required
              type="number"
              min={0}
              step={1}
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-cream/10 bg-ocean-900/50 px-3 py-2 text-cream"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-300">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-cream/10 bg-ocean-900/50 px-3 py-2 text-cream"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-slate-300">
              Image {!editingId && <span className="text-rose-300">*</span>}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))
              }
              className="mt-1 w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ocean-950"
            />
            <p className="mt-1 text-xs text-slate-500">JPEG, PNG, WebP ou GIF — max 2 Mo.</p>
            {editingId && (
              <p className="mt-1 text-xs text-slate-500">
                Laisser vide pour conserver l&apos;image actuelle.
              </p>
            )}
          </div>
          {formError && (
            <p className="sm:col-span-2 rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-100">
              {formError}
            </p>
          )}
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving || (!editingId && !form.image)}
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-ocean-950 hover:bg-sky-400 disabled:opacity-50"
            >
              {saving ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-cream/15 px-5 py-2 text-sm text-slate-200 hover:bg-cream/5"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-cream">Produits</h2>
        {loadError && (
          <p className="mt-2 text-sm text-rose-300">{loadError}</p>
        )}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-cream/10">
          <table className="min-w-full divide-y divide-cream/10 text-left text-sm">
            <thead className="bg-black/20 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Visuel</th>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5">
              {products.map((p) => {
                const id = String(p.id || p._id);
                return (
                  <tr key={id} className="bg-ocean-950/40">
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md bg-ocean-900">
                        {p.image ? (
                          <Image src={p.image} alt="" fill className="object-cover" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-slate-500">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-cream">{p.name}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {p.price > 0 ? p.price : <span className="text-sky-200/80">Sur demande</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="rounded-lg bg-cream/5 px-2 py-1 text-xs text-sky-200 hover:bg-cream/10"
                        >
                          Éditer
                        </button>
                        <Link
                          href={`/${routing.defaultLocale}/products/${id}`}
                          className="rounded-lg bg-cream/5 px-2 py-1 text-xs text-slate-300 hover:bg-cream/10"
                        >
                          Voir
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(id)}
                          className="rounded-lg bg-rose-500/15 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/25"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && !loadError && (
            <p className="p-6 text-center text-slate-500">Aucun produit.</p>
          )}
        </div>
      </section>
    </div>
  );
}
