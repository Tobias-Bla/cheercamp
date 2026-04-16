import Image from 'next/image';
import Link from 'next/link';
import { homeMedia } from '@/data/media';
import { getAllCamps } from '@/lib/camps';

export const dynamic = 'force-dynamic';

async function getGalleryImages() {
  const images = [
    homeMedia.hero,
    ...homeMedia.atmosphere,
    ...(await getAllCamps()).flatMap((camp) => camp.gallery),
  ];

  const uniqueImages = new Map(images.map((image) => [image.src, image]));
  return Array.from(uniqueImages.values());
}

export default async function ImpressionenPage() {
  const images = await getGalleryImages();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Impressionen</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">So fühlt sich ein R.I.S.E. Camp vor Ort an</h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Hier bekommen Besucher direkt einen Einblick in die Halle, die Stimmung, das Coaching und das Wochenende als Ganzes.
            Genau das hilft oft am meisten, wenn jemand noch überlegt, ob das Camp zu ihm passt.
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
              Frage stellen
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_-40px_rgba(34,211,238,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Was die Bilder zeigen</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              'Training auf der Fläche mit mehreren Setups gleichzeitig',
              'Direktes Feedback von Kai, Vio oder dem Guest Coach',
              'Gemeinschaft, Übernachtung und Camp-Wochenendstimmung',
              'Partnerstunt im Fokus, Groupstunts ausdrücklich willkommen',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => (
          <article key={image.src} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className={`relative ${index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 32vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
            <div className="p-5">
              <p className="text-sm leading-6 text-slate-200">{image.alt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
