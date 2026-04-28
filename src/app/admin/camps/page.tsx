import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatDateRange } from '@/lib/format';
import { readCampsFromFile } from '@/lib/camp-store';

export const dynamic = 'force-dynamic';

export default async function AdminCampsPage({
  searchParams,
}: {
  searchParams?: Promise<{ deleted?: string }>;
}) {
  const camps = await readCampsFromFile();
  const params = searchParams ? await searchParams : {};

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Camps bearbeiten</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Alle buchbaren Camps mit Termin, Preis, Status und Schnellzugriff auf die Bearbeitung.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/70"
        >
          Buchungen ansehen
        </Link>
      </div>

      {params.deleted ? (
        <div className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-5 py-4 text-sm text-emerald-100">
          Camp wurde gelöscht.
        </div>
      ) : null}

      <div className="grid gap-4">
        {camps.map((camp) => (
          <article key={camp.slug} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className="grid gap-0 lg:grid-cols-[18rem_1fr]">
              <div className="relative aspect-[16/10] lg:aspect-auto">
                <Image src={camp.coverImage} alt={camp.coverImageAlt} fill className="object-cover" sizes="18rem" />
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                        {camp.featured ? 'Featured' : 'Nicht featured'}
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                        {camp.coachModeLabel}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold text-white">{camp.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{camp.subtitle}</p>
                  </div>
                  <Link
                    href={`/admin/camps/${camp.slug}/edit`}
                    className="inline-flex shrink-0 justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                  >
                    Camp bearbeiten
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Termin</p>
                    <p className="mt-2 font-medium text-white">{formatDateRange(camp.startDate, camp.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preis</p>
                    <p className="mt-2 font-medium text-white">{formatCurrency(camp.priceCents)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Plätze</p>
                    <p className="mt-2 font-medium text-white">{camp.capacityText}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Coaches</p>
                    <p className="mt-2 font-medium text-white">{camp.coaches.join(', ')}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <Link href={`/camps/${camp.slug}`} className="text-cyan-300 transition hover:text-cyan-200">
                    Öffentliche Seite
                  </Link>
                  <Link href={`/book/${camp.slug}`} className="text-cyan-300 transition hover:text-cyan-200">
                    Buchungsseite
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
