'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/api';

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const tCard = useTranslations('Products.card');
  const t = useTranslations('Products');
  const id = product.id || product._id;
  const available = product.stock > 0;
  const showPrice = product.price > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition hover:border-brand-300/50 hover:shadow-lg">
      <Link href={`/products/${id}`} className="relative aspect-[4/3] bg-slate-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">{tCard('noImage')}</div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm ${
            available ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {available ? tCard('available') : tCard('out')}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-brand-800">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          {showPrice ? (
            <p className="text-lg font-bold text-brand-700">{product.price.toLocaleString()} MRU</p>
          ) : (
            <p className="text-base font-semibold text-brand-700/90">{t('priceOnRequest')}</p>
          )}
          <Link
            href={`/products/${id}`}
            className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 ring-1 ring-brand-200/80 transition hover:bg-brand-100"
          >
            {tCard('details')}
          </Link>
        </div>
      </div>
    </article>
  );
}
