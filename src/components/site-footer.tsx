import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-sm text-slate-300 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300">{siteConfig.name}</p>
          <p className="mt-4 max-w-sm leading-6">{siteConfig.description}</p>
        </div>

        <div>
          <p className="font-semibold text-white">Kontakt</p>
          <div className="mt-3 space-y-2">
            <p>{siteConfig.email}</p>
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.addressLine1}</p>
            <p>{siteConfig.addressLine2}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Rechtliches</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/ueber-uns" className="transition hover:text-white">
              Über Uns
            </Link>
            <Link href="/impressionen" className="transition hover:text-white">
              Impressionen
            </Link>
            <Link href="/impressum" className="transition hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition hover:text-white">
              Datenschutz
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
