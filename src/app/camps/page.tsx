import Image from 'next/image';
import { CampCard } from '@/components/camp-card';
import { getAllCamps } from '@/lib/camps';

export const dynamic = 'force-dynamic';

export default async function CampsPage() {
  const availableCamps = await getAllCamps();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Camp Übersicht</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Alle R.I.S.E. Camps auf einen Blick</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Alle Camps finden in der Albtalhalle in St. Blasien statt, haben 35 Plätze und sind auf wiederkehrende Termine im Jahr ausgelegt.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Partnerstunt im Fokus</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Groupstunts willkommen</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Übernachtung inklusive</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <div className="relative aspect-[16/10]">
            <Image
              src="/images/team-lineup.webp"
              alt="Mehrere Partnerstunts stehen nebeneinander in der Albtalhalle."
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
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
