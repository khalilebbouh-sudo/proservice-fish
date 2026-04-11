import { Suspense } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { WhatsAppFloat } from './WhatsAppFloat';

function FooterFallback() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100/80 py-12">
      <div className="mx-auto h-24 max-w-6xl animate-pulse rounded-xl bg-slate-200/60 px-4 sm:px-6" />
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Suspense fallback={<FooterFallback />}>
        <Footer />
      </Suspense>
      <WhatsAppFloat />
    </div>
  );
}
