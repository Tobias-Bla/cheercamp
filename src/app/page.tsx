import Image from 'next/image';
import Link from 'next/link';
import { CampCard } from '@/components/camp-card';
import { getFeaturedCamps } from '@/lib/camps';
import { siteConfig } from '@/data/site-config';
import { brandMedia, homeMedia } from '@/data/media';

const benefits = [
  'Online-Buchung und direkte Zahlung für das General Camp',
  '35 Plätze pro Camp in der Albtalhalle St. Blasien',
  'Partnerstunt im Fokus, Groupstunts willkommen',
  'Privates am Sonntag separat anfragbar',
];

const flowItems = [
  'Samstag: General Camp von 12:00 bis 18:00 Uhr',
  'Wünsche für bestimmte Stunts oder Themen können vorab angegeben werden',
  'Die beliebtesten Inhalte fließen direkt ins Coaching ein',
  'Sonntag: optionale Privates für Pairs, Groups oder teils Einzelpersonen',
];

export default function HomePage() {
  const featuredCamps = getFeaturedCamps();
  const primaryCamp = featuredCamps[0];
  const atmosphereMedia = homeMedia.atmosphere;

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-28">
        <div>
          <p className="inline-flex rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-200">
            Stunt-Weekend in der Albtalhalle St. Blasien
          </p>
          <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl">
            Partnerstunt-Camps mit echter Camp-Atmosphäre statt nur trockener Orga.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {siteConfig.claim} Die Seite bündelt Buchung, Zahlung und alle wichtigen Infos – und zeigt direkt, wie sich ein Wochenende bei RISE anfühlt.
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

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_80px_-40px_rgba(244,114,182,0.4)]">
            <div className="relative aspect-[5/4]">
              <Image
                src={homeMedia.hero.src}
                alt={homeMedia.hero.alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/25 to-transparent" />
            </div>
            <div className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Real Camp Impressions</p>
              <p className="mt-2 max-w-[14rem] text-sm text-slate-200">Kein Stock-Material – echte Bilder aus euren bisherigen Weekends.</p>
            </div>
            <div className="absolute bottom-5 right-5 hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 backdrop-blur sm:block">
              <Image
                src={brandMedia.logoPrimary.src}
                alt={brandMedia.logoPrimary.alt}
                width={160}
                height={106}
                className="h-auto w-32"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Camp-Ablauf</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">So läuft ein typisches Stunt-Camp ab</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Im Mittelpunkt steht das allgemeine Samstag-Camp. Je nach Coach gibt es einen festen Zeitplan oder ein flexibleres Wunschformat – aber immer mit Fokus auf saubere Progressions und direktes Feedback.
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
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Atmosphäre vor Ort</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Training, Community und ein Wochenende, das nach Camp aussieht</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Die Fotos sollen nicht nur dekorativ sein: Sie zeigen direkt, wie die Camps aufgebaut sind – viele Stunts auf der Fläche, gemeinsames Essen, direkte Coach-Nähe und ein sehr persönlicher Rahmen.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className="relative aspect-[16/10]">
              <Image
                src={atmosphereMedia[0].src}
                alt={atmosphereMedia[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-lg font-semibold text-white">Viele Gruppen parallel, aber trotzdem strukturiert</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">
                Genau dafür sind Partner- und Groupstunt-Camps gemacht: mehrere Setups gleichzeitig, viel Input und trotzdem genug Raum für Wünsche und gezielte Korrekturen.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {atmosphereMedia.slice(1).map((image) => (
              <div key={image.src} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
                <div className="relative aspect-[4/3] lg:aspect-[4/3]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 28vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
                </div>
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
