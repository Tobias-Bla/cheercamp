import Link from 'next/link';
import { CampCard } from '@/components/camp-card';
import { getFeaturedCamps } from '@/lib/camps';
import { siteConfig } from '@/data/site-config';

const benefits = [
  'Online-Buchung und direkte Zahlung für das General Camp',
  '35 Plätze pro Camp in der Albtalhalle St. Blasien',
  'Partnerstunt im Fokus, Groupstunts willkommen',
  'Privates am Sonntag separat anfragbar',
];

const flowItems = [
  'Samstag: General Camp von 12:00 bis 18:00 Uhr',
  'Wünsche für bestimmte Stunts oder Themen können vorab angegeben werden',
  'Die beliebtesten Inhalte fließen ins Coaching ein',
  'Sonntag: optionale Privates für Pairs, Groups oder teils Einzelpersonen',
];

export default function HomePage() {
  const featuredCamps = getFeaturedCamps();
  const primaryCamp = featuredCamps[0];

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-28 lg:pt-28">
        <div>
          <p className="inline-flex rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-200">
            Stunt-Weekend in der Albtalhalle St. Blasien
          </p>
          <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl">
            Partnerstunt-Camps mit klarer Orga, einfacher Buchung und echtem Weekend-Vibe.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {siteConfig.claim} Die Website ist auf wiederkehrende Camps im Jahr ausgelegt und kann später um Merch erweitert werden.
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
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(244,114,182,0.4)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Nächstes Camp</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{primaryCamp?.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{primaryCamp?.subtitle}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {primaryCamp?.highlights?.map((item) => (
              <div key={item} className="rounded-2xl bg-slate-900/60 px-4 py-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
          <Link
            href={primaryCamp ? `/book/${primaryCamp.slug}` : '/camps'}
            className="mt-8 inline-flex rounded-full bg-linear-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-105"
          >
            Jetzt direkt buchen
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Camp-Ablauf</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">So läuft ein typisches Stunt-Camp ab</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Im Mittelpunkt steht das allgemeine Samstag-Camp. Je nach Coach gibt es einen festen Zeitplan oder ein flexibleres Wunschformat.
            </p>
          </div>
          <div className="grid gap-3">
            {flowItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Aktuelle Camps</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Buchbar, klar strukturiert und auf wiederkehrende Camps ausgelegt</h2>
          </div>
          <Link href="/camps" className="hidden text-sm font-semibold text-cyan-300 transition hover:text-cyan-200 md:inline-flex">
            Alle Camps ansehen →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featuredCamps.map((camp) => (
            <CampCard key={camp.slug} camp={camp} />
          ))}
        </div>
      </section>
    </div>
  );
}
