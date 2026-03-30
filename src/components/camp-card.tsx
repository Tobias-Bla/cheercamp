import Link from 'next/link';
import type { Camp } from '@/data/camps';
import { formatCurrency, formatDateRange } from '@/lib/format';

export function CampCard({ camp }: { camp: Camp }) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-30px_rgba(20,20,20,0.8)] transition hover:-translate-y-1 hover:border-fuchsia-400/40 hover:bg-white/8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">{camp.location}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{camp.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{camp.subtitle}</p>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-slate-200">
          {camp.capacityText}
        </span>
      </div>

      <dl className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
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
    </article>
  );
}
