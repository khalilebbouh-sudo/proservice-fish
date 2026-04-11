import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import frMessages from '@/messages/fr.json';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Administration',
  robots: 'noindex, nofollow, noarchive',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="fr" messages={frMessages}>
      <div className="min-h-screen bg-ocean-950">
        <header className="border-b border-cream/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Logo />
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/${routing.defaultLocale}`} className="text-slate-300 hover:text-cream">
                Site public
              </Link>
            </div>
          </div>
        </header>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
