import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { apiFetch, type ProductResponse } from '@/lib/api';

type Props = { params: { locale: string; id: string } };

async function getProduct(id: string) {
  try {
    return await apiFetch<ProductResponse>(`/api/products/${id}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = params;
  const t = await getTranslations({ locale, namespace: 'ProductDetail' });
  const data = await getProduct(id);
  if (!data?.product) {
    return { title: t('notFoundTitle') };
  }
  const p = data.product;
  return {
    title: p.name,
    description: p.description.slice(0, 160),
    openGraph: p.image ? { images: [{ url: p.image }] } : undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const t = await getTranslations('ProductDetail');
  const tProducts = await getTranslations('Products');
  const data = await getProduct(id);
  if (!data?.product) notFound();

  const p = data.product;
  const available = p.stock > 0;
  const priceLine =
    p.price > 0
      ? t('waPriceShown', { amount: p.price.toLocaleString() })
      : t('waPriceOnRequest');
  const wa =
    'https://wa.me/22220783674?text=' +
    encodeURIComponent(t('waText', { name: p.name, priceLine }));

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link href="/products" className="text-sm font-semibold text-brand-700 hover:text-brand-600">
          {t('back')}
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md">
            {p.image ? (
              <Image src={p.image} alt={p.name} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">{t('noImage')}</div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {available ? t('inStock') : t('outStock')}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{p.name}</h1>
            {p.price > 0 ? (
              <p className="mt-4 text-4xl font-bold text-brand-700">{p.price.toLocaleString()} MRU</p>
            ) : (
              <p className="mt-4 text-2xl font-semibold text-brand-800">{tProducts('priceOnRequest')}</p>
            )}
            <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-600">{p.description}</p>
            <p className="mt-4 text-sm text-slate-500">{t('stock', { count: p.stock })}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500"
              >
                {t('waCta')}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-brand-300 hover:text-brand-800"
              >
                {t('otherContact')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
