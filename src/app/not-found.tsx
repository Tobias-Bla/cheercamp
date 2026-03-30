import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Diese Seite gibt es nicht</h1>
      <p className="mt-4 text-base text-slate-300">Bitte gehe zurück zur Startseite oder schaue dir die Camps an.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
          Startseite
        </Link>
        <Link href="/camps" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
          Camps ansehen
        </Link>
      </div>
    </section>
  );
}
