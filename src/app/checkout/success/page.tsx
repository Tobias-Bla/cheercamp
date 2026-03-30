import Link from 'next/link';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
      <div className="rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Zahlung erfolgreich</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Die Buchung ist eingegangen</h1>
        <p className="mt-4 text-base leading-7 text-slate-200">
          Vielen Dank. Die Zahlung wurde abgeschlossen und die Buchung ist gespeichert.
          {bookingId ? ` Buchungs-ID: ${bookingId}` : ''}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/camps" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            Weitere Camps ansehen
          </Link>
          <Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
            Zur Startseite
          </Link>
        </div>
      </div>
    </section>
  );
}
