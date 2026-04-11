import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';

export async function Footer() {
  const t = await getTranslations('Footer');
  const nav = await getTranslations('Nav');

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100/80 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div className="flex flex-col items-start gap-3">
          <Logo withText />
          <p className="text-sm leading-relaxed text-slate-600">{t('tagline')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-800">{t('navTitle')}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-brand-700">
                {nav('home')}
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-brand-700">
                {nav('products')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-700">
                {nav('contact')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-800">{t('contactTitle')}</p>
          <p className="mt-3 text-sm text-slate-600">{t('phoneLine')}</p>
          <p className="text-sm text-slate-600">proservice986@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
