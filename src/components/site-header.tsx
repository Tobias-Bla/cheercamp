import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';
import { brandMedia } from '@/data/media';
import { getCurrentUser } from '@/lib/auth';

const navigationItems = [
  { href: '/', label: 'Start' },
  { href: '/camps', label: 'Camps' },
  { href: '/ueber-uns', label: 'Über Uns' },
  { href: '/impressionen', label: 'Impressionen' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Kontakt' },
];

export async function SiteHeader() {
  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 shadow-[0_10px_40px_-25px_rgba(15,23,42,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-4 text-white transition hover:opacity-90">
          <div className="rounded-[1.35rem] border border-white/15 bg-white/8 p-2.5 shadow-[0_18px_45px_-30px_rgba(244,114,182,0.55)]">
            <Image
              src={brandMedia.logoPrimary.src}
              alt={brandMedia.logoPrimary.alt}
              width={126}
              height={84}
              className="h-auto w-24"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.28em] text-fuchsia-300">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-slate-200">Respect, Inspire, Stunt, Elevate</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="hidden rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200 sm:inline-flex"
          >
            {currentUser ? 'Mein Konto' : 'Login'}
          </Link>
          <Link
            href="/camps"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_35px_-22px_rgba(255,255,255,0.85)] transition hover:bg-slate-100"
          >
            Jetzt buchen
          </Link>
        </div>
      </div>
    </header>
  );
}
