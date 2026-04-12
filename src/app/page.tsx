import Image from 'next/image';
import Link from 'next/link';
import { CampCard } from '@/components/camp-card';
import { getFeaturedCamps } from '@/lib/camps';
import { siteConfig } from '@/data/site-config';
import { homeMedia } from '@/data/media';

const benefits = [
  'Online-Buchung und direkte Zahlung für das General Camp',
  '35 Plätze pro Camp in der Albtalhalle St. Blasien',
  'Partnerstunt im Fokus, Groupstunts willkommen',
  'Privates am Sonntag separat anfragbar',
];

const flowItems = [
  'Freitag: optionale Anreise ab 15:00 Uhr',
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
            R.I.S.E. Camp
          </h1>
          <div className="mt-5 grid max-w-2xl grid-cols-2 gap-2 text-base font-medium text-cyan-200 sm:grid-cols-4">
            <span>Respect</span>
            <span>Inspire</span>
            <span>Stunt</span>
            <span>Elevate</span>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {siteConfig.claim} Die Seite bündelt Buchung, Zahlung und alle wichtigen Infos – und zeigt direkt, wie sich
            ein Wochenende bei RISE anfühlt.
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
              <div
                key={benefit}
                className="rounded-2xl border border-white/12 bg-white/7 px-4 py-4 text-sm text-slate-100 shadow-[0_16px_40px_-34px_rgba(148,163,184,0.55)]"
              >
                {benefit}
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-xl rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-[0_22px_60px_-38px_rgba(255,255,255,0.35)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Warum das sofort funktioniert</p>
            <p className="mt-3 text-sm leading-7 text-slate-100">
              Buchung, Camp-Wuensche und Zahlungsstart liegen direkt an einem Ort. Fuer Teilnehmende ist der Einstieg
              dadurch deutlich klarer als per DM, Formular-Pingpong oder einzelner Umfrage.
            </p>
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
              <p className="mt-2 max-w-[14rem] text-sm text-slate-200">Echte Eindruecke aus euren bisherigen Weekends.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/12 bg-linear-to-br from-white/12 via-slate-900/78 to-cyan-950/35 p-6 shadow-[0_28px_80px_-44px_rgba(34,211,238,0.38)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Nächstes Camp</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
                35 Plätze
              </span>
              <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-200">
                ab 40 € pro Person
              </span>
            </div>
            <h2 className="mt-4 text-[2.15rem] font-semibold leading-tight text-white">{primaryCamp?.title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-200">{primaryCamp?.subtitle}</p>
            <div className="mt-6 rounded-2xl border border-white/12 bg-white/10 p-4">
              <p className="text-sm font-medium text-white">
                {primaryCamp?.bookingOpen ? 'Direkt online buchbar' : 'Buchung startet, sobald das Datum feststeht'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {primaryCamp?.bookingOpen
                  ? 'General Camp online reservieren und bezahlen. Privates am Sonntag bleiben flexibel als Zusatzanfrage.'
                  : 'Das naechste Cheercamp in St. Blasien mit Kai und Vio zum Specialpreis wird erst nach finaler Terminankuendigung freigeschaltet.'}
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {primaryCamp?.highlights?.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-slate-950/38 px-4 py-4 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCamp?.bookingOpen ? (
                <Link
                  href={primaryCamp ? `/book/${primaryCamp.slug}` : '/camps'}
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-fuchsia-500 via-pink-400 to-cyan-400 px-7 py-4 text-sm font-semibold text-slate-950 shadow-[0_24px_45px_-24px_rgba(34,211,238,0.65)] transition hover:brightness-105"
                >
                  Jetzt direkt buchen
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 px-7 py-4 text-sm font-semibold text-amber-100">
                  Termin folgt, Buchung noch geschlossen
                </span>
              )}
              <Link
                href={primaryCamp ? `/camps/${primaryCamp.slug}` : '/camps'}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                Erst Camp ansehen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_-48px_rgba(255,255,255,0.3)] lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Camp-Ablauf</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">So läuft ein typisches Stunt-Camp ab</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Im Mittelpunkt steht das allgemeine Samstag-Camp. Je nach Coach gibt es einen festen Zeitplan oder ein
              flexibleres Wunschformat – aber immer mit Fokus auf saubere Progressions und direktes Feedback.
            </p>
          </div>
          <div className="grid gap-3">
            {flowItems.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Atmosphäre vor Ort</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Training, Community und ein Wochenende, das nach Camp aussieht
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Die Fotos sollen nicht nur dekorativ sein: Sie zeigen direkt, wie die Camps aufgebaut sind – viele Stunts
            auf der Fläche, gemeinsames Essen, direkte Coach-Nähe und ein sehr persönlicher Rahmen.
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
                Genau dafür sind Partner- und Groupstunt-Camps gemacht: mehrere Setups gleichzeitig, viel Input und
                trotzdem genug Raum für Wünsche und gezielte Korrekturen.
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
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Buchbar, klar strukturiert und auf wiederkehrende Camps ausgelegt
            </h2>
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
