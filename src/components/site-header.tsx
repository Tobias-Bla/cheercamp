import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

const navigationItems = [
  { href: '/', label: 'Start' },
  { href: '/camps', label: 'Camps' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Kontakt' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-cyan-400 text-base font-black text-slate-950">
            SC
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300">{siteConfig.name}</p>
            <p className="text-xs text-slate-300">Partnerstunt & Groupstunt Weekends</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-200 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/camps"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Jetzt buchen
        </Link>
      </div>
    </header>
  );
}
