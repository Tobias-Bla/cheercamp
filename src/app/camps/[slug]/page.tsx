import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCamps, getCampBySlug } from '@/lib/camps';
import { formatCurrency, formatDateRange } from '@/lib/format';

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllCamps().map((camp) => ({ slug: camp.slug }));
}

export default async function CampDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);

  if (!camp) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">{camp.location}</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{camp.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{camp.subtitle}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Termin</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatDateRange(camp.startDate, camp.endDate)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Preis</p>
              <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(camp.priceCents)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Venue</p>
              <p className="mt-2 text-lg font-semibold text-white">{camp.venue}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Setup</p>
              <p className="mt-2 text-lg font-semibold text-white">{camp.coachModeLabel}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">Camp-Fokus</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {camp.focus.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">Das ist enthalten</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {camp.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Ablauf</h2>
            <div className="mt-6 space-y-5">
              {camp.schedule.map((item) => (
                <article key={item.day} className="rounded-2xl border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">{item.day}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    {item.details.map((detail) => (
                      <li key={detail}>• {detail}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Buchung</p>
          <p className="mt-4 text-3xl font-semibold text-white">{formatCurrency(camp.priceCents)}</p>
          <p className="mt-2 text-sm text-slate-300">pro Person für das General Camp</p>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>• {camp.capacityText}</p>
            <p>• {camp.generalCampTime}</p>
            <p>• {camp.formatOptions.join(' & ')}</p>
            <p>• Übernachtung in der Halle inklusive</p>
            <p>• Privates am Sonntag separat</p>
          </div>
          <p className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-xs leading-6 text-slate-300">
            {camp.privatePaymentNote}
          </p>
          <Link
            href={`/book/${camp.slug}`}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Jetzt buchen
          </Link>
        </aside>
      </div>
    </section>
  );
}
