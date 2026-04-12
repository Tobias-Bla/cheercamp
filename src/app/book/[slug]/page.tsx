import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingForm } from '@/components/booking-form';
import { getAllCamps, getCampBySlug } from '@/lib/camps';
import { formatCurrency, formatDateRange } from '@/lib/format';

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllCamps().map((camp) => ({ slug: camp.slug }));
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);

  if (!camp) {
    notFound();
  }

  if (!camp.bookingOpen) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-amber-300/25 bg-amber-300/10 p-8 text-slate-100">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">Buchung noch geschlossen</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{camp.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            Fuer dieses Camp steht das Datum noch nicht fest. Sobald der Termin fix ist, kann die Buchung hier direkt gestartet werden.
          </p>
          <Link
            href={`/camps/${camp.slug}`}
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Zur Camp-Detailseite
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className="relative aspect-[4/5]">
              <Image
                src={camp.bookingImage}
                alt={camp.bookingImageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 34vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Buchung</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{camp.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{camp.subtitle}</p>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-white">Termin:</span> {camp.dateLabel ?? formatDateRange(camp.startDate!, camp.endDate!)}
              </p>
              <p>
                <span className="font-semibold text-white">Ort:</span> {camp.venue}
              </p>
              <p>
                <span className="font-semibold text-white">Preis:</span> {formatCurrency(camp.priceCents)}
              </p>
              <p>
                <span className="font-semibold text-white">Ablauf:</span> {camp.generalCampTime}
              </p>
              <p>
                <span className="font-semibold text-white">Privates:</span> Sonntag separat anfragbar
              </p>
              <p>
                <span className="font-semibold text-white">Verpflegung:</span> exklusive
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-xs leading-6 text-slate-300">
              {camp.privatePaymentNote}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Anmeldeformular</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Teilnehmerdaten erfassen und General Camp bezahlen</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Im Formular könnt ihr direkt angeben, ob ihr als Partnerstunt oder Groupstunt kommt, welche Wünsche ihr fürs Samstag-Camp habt und ob Interesse an einem Private am Sonntag besteht.
            </p>
          </div>
          <BookingForm camp={camp} />
        </div>
      </div>
    </section>
  );
}
