import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LocaleHtmlLang } from '@/components/LocaleHtmlLang';

type Props = { children: React.ReactNode; params: { locale: string } };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    description: t('siteDescription'),
    openGraph: {
      title: 'ProService Fish',
      description: t('ogDescription'),
      url: siteUrl(locale),
      siteName: 'ProService Fish',
      locale: locale === 'fr' ? 'fr_MR' : locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [{ url: '/assets/company-logo.png', alt: 'ProService Fish' }],
    },
    robots: { index: true, follow: true },
  };
}

function siteUrl(locale: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/${locale}`;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlLang locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
