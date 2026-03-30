import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';
import { brandMedia } from '@/data/media';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-sm text-slate-300 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <div className="inline-flex rounded-3xl border border-white/10 bg-white/5 p-3">
            <Image
              src={brandMedia.logoPrimary.src}
              alt={brandMedia.logoPrimary.alt}
              width={176}
              height={117}
              className="h-auto w-36"
            />
          </div>
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
