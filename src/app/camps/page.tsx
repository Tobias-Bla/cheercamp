import Image from 'next/image';
import { CampCard } from '@/components/camp-card';
import { getAllCamps, isPublicCamp } from '@/lib/camps';

export const dynamic = 'force-dynamic';

export default async function CampsPage() {
  const availableCamps = (await getAllCamps()).filter(isPublicCamp);
  const bookableCamps = availableCamps.filter((camp) => camp.bookingOpen);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Camp Übersicht</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Termine und Formate auf einen Blick</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Hier stehen die geplanten R.I.S.E. Camps in der Albtalhalle St. Blasien. Die Anmeldung wird erst freigeschaltet,
            wenn Termin, Coach-Setup und Plätze final bestätigt sind.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Partnerstunt im Fokus</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Groupstunts willkommen</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Buchung erst nach Freigabe</span>
          </div>
          {bookableCamps.length === 0 ? (
            <div className="mt-8 rounded-[1.5rem] border border-amber-300/25 bg-amber-300/10 px-5 py-4 text-sm font-semibold leading-6 text-amber-100">
              Aktuell ist keine öffentliche Camp-Buchung geöffnet. Sobald ein Camp wirklich buchbar ist, erscheint auf der Karte ein klarer Buchungsbutton.
            </div>
          ) : null}
        </div>

        <div className="relative lg:pl-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Impression aus der Halle</p>
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-[2rem] border-t border-white/10">
            <Image
              src="/images/team-lineup.webp"
              alt="Mehrere Partnerstunts stehen nebeneinander in der Albtalhalle."
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {availableCamps.map((camp) => (
          <CampCard key={camp.slug} camp={camp} />
        ))}
      </div>
    </section>
  );
}
