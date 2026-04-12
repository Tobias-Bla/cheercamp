import Image from 'next/image';
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

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className="relative aspect-[16/10]">
              <Image
                src={camp.coverImage}
                alt={camp.coverImageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Termin</p>
              <p className="mt-2 text-lg font-semibold text-white">{camp.dateLabel ?? formatDateRange(camp.startDate!, camp.endDate!)}</p>
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

          <div className="mt-10">
            <div className="mb-6 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Impressions</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">So sieht das Wochenende vor Ort aus</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {camp.gallery.map((image, index) => (
                <div key={image.src} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
                  <div className={`relative ${index === 0 ? 'aspect-[4/5] md:aspect-[4/5]' : 'aspect-[4/5]'}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
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

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:sticky lg:top-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Buchung</p>
          <p className="mt-4 text-3xl font-semibold text-white">{formatCurrency(camp.priceCents)}</p>
          <p className="mt-2 text-sm text-slate-300">pro Person für das General Camp</p>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>• {camp.capacityText}</p>
            <p>• {camp.generalCampTime}</p>
            <p>• {camp.formatOptions.join(' & ')}</p>
            <p>• Übernachtung in der Halle inklusive</p>
            <p>• Privates am Sonntag separat</p>
            <p>• Verpflegung exklusive</p>
          </div>
          <p className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-xs leading-6 text-slate-300">
            {camp.privatePaymentNote}
          </p>
          {camp.bookingOpen ? (
            <Link
              href={`/book/${camp.slug}`}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Jetzt buchen
            </Link>
          ) : (
            <div className="mt-8 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-5 py-4 text-sm font-semibold text-amber-100">
              Termin steht noch nicht fest. Die Buchung wird freigeschaltet, sobald das Datum fix ist.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
