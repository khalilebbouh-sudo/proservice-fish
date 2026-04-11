import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/PageShell';
import { ProductCard } from '@/components/ProductCard';
import { apiFetch, type ProductsResponse } from '@/lib/api';
import { homeHeroImageUrl } from '@/lib/homeHero';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('Home');
  let catalog: ProductsResponse['products'] = [];
  try {
    const data = await apiFetch<ProductsResponse>('/api/products');
    catalog = data.products;
  } catch {
    catalog = [];
  }

  const features = [
    { title: t('feature1Title'), desc: t('feature1Desc') },
    { title: t('feature2Title'), desc: t('feature2Desc') },
    { title: t('feature3Title'), desc: t('feature3Desc') },
  ];

  const heroSrc = homeHeroImageUrl(3840, 88);

  return (
    <PageShell>
      <section className="relative flex min-h-[min(78vh,820px)] items-center overflow-hidden bg-slate-900">
        <Image
          src={heroSrc}
          alt={t('heroImageAlt')}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(15,40,48,0.9)_0%,rgba(15,40,48,0.58)_48%,rgba(15,40,48,0.36)_100%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200/95 sm:text-sm">
            {t('heroEyebrow')}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.65rem]">
            {t('heroTitle')}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/88 sm:text-lg">{t('heroSubtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-950/25 transition hover:bg-brand-500"
            >
              {t('ctaProducts')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-lg border border-white/85 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
            >
              {t('ctaContact')}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-8 text-sm text-white/75">
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="font-semibold text-brand-100">{t('phoneLabel')}</p>
                <p className="mt-0.5">20 78 36 74 / 36 36 37 66</p>
              </div>
              <div>
                <p className="font-semibold text-brand-100">{t('waLabel')}</p>
                <p className="mt-0.5">00222 20 78 36 74</p>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-white/40 sm:text-xs">{t('heroPhotoCredit')}</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-14 px-4 pb-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 md:p-7"
            >
              <h2 className="text-lg font-bold text-brand-900">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t('catalogTitle')}</h2>
              <p className="mt-1 max-w-2xl text-slate-600">{t('catalogSubtitle')}</p>
            </div>
            <Link
              href="/products"
              className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-600"
            >
              {t('catalogPageLink')}
            </Link>
          </div>
          {catalog.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              {t('emptyCatalog')}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
