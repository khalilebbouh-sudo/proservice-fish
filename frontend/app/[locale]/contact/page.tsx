import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/PageShell';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

const wa = 'https://wa.me/22220783674';

export default async function ContactPage(_props: Props) {
  const t = await getTranslations('Contact');

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h1>
        <p className="mt-2 text-slate-600">{t('intro')}</p>
        <div className="mt-10 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{t('name')}</p>
            <p className="mt-1 text-lg font-medium text-slate-900">Proservice_fish</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{t('phone')}</p>
            <p className="mt-1 text-lg font-medium text-slate-900">20 78 36 74 / 36 36 37 66</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{t('email')}</p>
            <a
              href="mailto:proservice986@gmail.com"
              className="mt-1 block text-lg font-medium text-brand-700 hover:underline"
            >
              proservice986@gmail.com
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{t('whatsapp')}</p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex text-lg font-semibold text-emerald-700 hover:text-emerald-600"
            >
              00222 20 78 36 74 →
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
