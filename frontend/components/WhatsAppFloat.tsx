'use client';

import { useTranslations } from 'next-intl';

export function WhatsAppFloat() {
  const t = useTranslations('WhatsApp');
  const wa =
    'https://wa.me/22220783674?text=' + encodeURIComponent(t('prefill'));

  return (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-cream shadow-lg shadow-emerald-900/40 transition hover:scale-105 hover:bg-emerald-400"
      aria-label={t('floatLabel')}
    >
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.003 3C9.374 3 4 8.373 4 15c0 2.385.624 4.71 1.81 6.76L4 29l7.357-1.93A12.94 12.94 0 0016.003 27C22.629 27 28 21.627 28 15S22.629 3 16.003 3zm0 22.5c-2.05 0-4.06-.55-5.8-1.6l-.42-.25-4.91 1.29 1.31-4.78-.27-.44A10.43 10.43 0 015.5 15c0-5.79 4.71-10.5 10.503-10.5S26.5 9.21 26.5 15 21.79 25.5 16.003 25.5zm5.59-7.91c-.31-.16-1.84-.91-2.12-1.01-.28-.1-.49-.16-.7.16-.21.31-.8 1.01-.98 1.22-.18.21-.36.24-.67.08-.31-.16-1.3-.48-2.48-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.36.46-.54.15-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.69-.96-2.31-.25-.59-.5-.51-.7-.52h-.6c-.21 0-.54.08-.82.39-.28.31-1.07 1.05-1.07 2.56 0 1.51 1.1 2.97 1.25 3.18.16.21 2.16 3.3 5.23 4.62.73.31 1.3.5 1.75.64.74.23 1.41.2 1.94.12.59-.09 1.84-.75 2.1-1.48.26-.72.26-1.34.18-1.48-.08-.14-.28-.23-.59-.39z" />
      </svg>
    </a>
  );
}
