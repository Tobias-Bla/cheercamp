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

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Buchung</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{camp.title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{camp.subtitle}</p>
          <div className="mt-8 space-y-4 text-sm text-slate-300">
            <p>
              <span className="font-semibold text-white">Termin:</span> {formatDateRange(camp.startDate, camp.endDate)}
            </p>
            <p>
              <span className="font-semibold text-white">Ort:</span> {camp.venue}
            </p>
            <p>
              <span className="font-semibold text-white">Preis:</span> {formatCurrency(camp.priceCents)}
            </p>
            <p>
              <span className="font-semibold text-white">General Camp:</span> {camp.generalCampTime}
            </p>
            <p>
              <span className="font-semibold text-white">Privates:</span> Sonntag separat anfragbar
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-xs leading-6 text-slate-300">
            {camp.privatePaymentNote}
          </div>
        </aside>

        <div>
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Anmeldeformular</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Teilnehmerdaten erfassen und General Camp bezahlen</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Im Formular könnt ihr auch direkt angeben, ob ihr als Partnerstunt oder Groupstunt kommt, welche Wünsche ihr fürs Samstag-Camp habt und ob Interesse an einem Private am Sonntag besteht.
            </p>
          </div>
          <BookingForm camp={camp} />
        </div>
      </div>
    </section>
  );
}
