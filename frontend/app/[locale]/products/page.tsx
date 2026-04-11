import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/PageShell';
import { ProductCard } from '@/components/ProductCard';
import { apiFetch, type ProductsResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'Products' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ProductsPage({ params }: Props) {
  const t = await getTranslations('Products');
  let products: ProductsResponse['products'] = [];
  let error: string | null = null;
  try {
    const data = await apiFetch<ProductsResponse>('/api/products');
    products = data.products;
  } catch (e) {
    error = e instanceof Error ? e.message : t('loadError');
  }

  return (
    <PageShell>
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h1>
            <p className="mt-2 max-w-2xl text-slate-600">{t('intro')}</p>
          </header>
          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">{error}</p>
          ) : products.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              {t('empty')}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
