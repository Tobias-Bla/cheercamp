import Link from 'next/link';

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Admin</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Verwaltung</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/camps"
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:border-fuchsia-300/50 hover:bg-white/10"
        >
          <p className="text-lg font-semibold text-white">Camps bearbeiten</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">Termine, Texte, Bilder, Preise und Ablauf bearbeiten.</p>
        </Link>
        <Link
          href="/admin/bookings"
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/50 hover:bg-white/10"
        >
          <p className="text-lg font-semibold text-white">Buchungen ansehen</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">Teilnehmende, Zahlstatus und Wünsche prüfen.</p>
        </Link>
      </div>
    </section>
  );
}
