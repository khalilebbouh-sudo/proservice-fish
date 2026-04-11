import Image from 'next/image';
import { Link } from '@/i18n/navigation';

type Props = {
  className?: string;
  withText?: boolean;
};

export function Logo({ className = '', withText = false }: Props) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 rounded-lg outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-brand-400/70 sm:gap-3 ${className}`}
    >
      <span className="relative block aspect-square h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-brand-200/80 shadow-md sm:h-14 sm:w-14">
        <Image
          src="/assets/company-logo.png"
          alt="ProService Fish"
          fill
          sizes="56px"
          quality={95}
          priority
          className="rounded-full object-contain object-center"
        />
      </span>
      {withText && (
        <span className="text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-brand-900 sm:text-sm md:text-base">
          ProService <span className="text-brand-600">Fish</span>
        </span>
      )}
    </Link>
  );
}
