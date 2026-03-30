import Image from 'next/image';
import Link from 'next/link';
import type { Camp } from '@/data/camps';
import { formatCurrency, formatDateRange } from '@/lib/format';

export function CampCard({ camp }: { camp: Camp }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_-30px_rgba(20,20,20,0.8)] transition hover:-translate-y-1 hover:border-fuchsia-400/40 hover:bg-white/8">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={camp.coverImage}
          alt={camp.coverImageAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 48vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur">
          {camp.capacityText}
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">{camp.location}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{camp.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">{camp.subtitle}</p>
        </div>
      </div>

      <div className="p-6">
        <dl className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Termin</dt>
            <dd className="mt-1 font-medium text-white">{formatDateRange(camp.startDate, camp.endDate)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Preis</dt>
            <dd className="mt-1 font-medium text-white">{formatCurrency(camp.priceCents)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Ort</dt>
            <dd className="mt-1 font-medium text-white">{camp.venue}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Coach-Setup</dt>
            <dd className="mt-1 font-medium text-white">{camp.coachModeLabel}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          {camp.focus.map((focusPoint) => (
            <span key={focusPoint} className="rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-200">
              {focusPoint}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/camps/${camp.slug}`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Details ansehen
          </Link>
          <Link
            href={`/book/${camp.slug}`}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-fuchsia-300 hover:text-fuchsia-200"
          >
            Direkt buchen
          </Link>
        </div>
      </div>
    </article>
  );
}
