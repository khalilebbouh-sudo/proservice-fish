import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/PageShell';

export default async function ProductNotFound() {
  const t = await getTranslations('NotFound');

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="mt-2 text-slate-600">{t('body')}</p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-600"
        >
          {t('cta')}
        </Link>
      </div>
    </PageShell>
  );
}
