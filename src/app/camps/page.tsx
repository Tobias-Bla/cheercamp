import { CampCard } from '@/components/camp-card';
import { getAllCamps } from '@/lib/camps';

export default function CampsPage() {
  const availableCamps = getAllCamps();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Camp Übersicht</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Alle buchbaren Stunt-Camps auf einen Blick</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          Alle Camps finden in der Albtalhalle in St. Blasien statt, haben 35 Plätze und sind auf wiederkehrende Termine im Jahr ausgelegt.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {availableCamps.map((camp) => (
          <CampCard key={camp.slug} camp={camp} />
        ))}
      </div>
    </section>
  );
}
