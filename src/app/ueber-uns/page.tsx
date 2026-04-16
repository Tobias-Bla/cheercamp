import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
  {
    name: 'Kai',
    role: 'Coach & Mit-Organisator',
    intro:
      'Kai bringt Ruhe, Technikfokus und direktes Feedback auf die Fläche. Gerade bei sauberen Basics, sicheren Progressions und klaren Korrekturen ist er ein wichtiger Teil des Camps.',
    points: [
      'coacht gemeinsam mit Vio das Wochenende',
      'gibt direktes Technik-Feedback auf der Fläche',
      'unterstützt auch bei Privates und individuellen Fragen',
    ],
  },
  {
    name: 'Vio',
    role: 'Coach & Organisatorin',
    intro:
      'Vio organisiert die Camps, sammelt Themenwünsche und sorgt dafür, dass aus der Idee ein rundes Wochenende wird. Gleichzeitig steht sie selbst als Coach auf der Fläche und begleitet die Gruppen sehr nah.',
    points: [
      'plant und organisiert die Camp-Wochenenden',
      'koordiniert Teilnehmende, Themen und Kommunikation',
      'coacht Partnerstunts, Groupstunts und Privates mit Blick fürs Ganze',
    ],
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Über Uns</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Kai und Vio hinter dem R.I.S.E. Camp</h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Das Camp lebt nicht nur von Technik und Training, sondern auch von der Art, wie das Wochenende begleitet wird.
            Kai und Vio verbinden Coaching, Orga und Community so, dass sich Leistung und Camp-Gefühl nicht widersprechen.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/camps"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Camps ansehen
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300 hover:text-fuchsia-200"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_70px_-40px_rgba(244,114,182,0.28)]">
          <div className="relative aspect-[16/10]">
            <Image
              src="/images/hero-group-photo.webp"
              alt="Camp-Community in der Albtalhalle St. Blasien."
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/15 to-transparent" />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {teamMembers.map((member) => (
          <article key={member.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 via-pink-400 to-cyan-400 text-lg font-black text-slate-950">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{member.name}</p>
                <p className="mt-1 text-sm text-cyan-200">{member.role}</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-300">{member.intro}</p>

            <div className="mt-6 grid gap-3">
              {member.points.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4 text-sm text-slate-200">
                  {point}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Was euch wichtig ist</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            'saubere Progressions statt reiner Show',
            'offene, persönliche Camp-Atmosphäre',
            'Partnerstunt-Fokus mit Platz für Groupstunts',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-4 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
