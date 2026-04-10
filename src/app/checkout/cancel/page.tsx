import Link from 'next/link';

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
      <div className="rounded-[2rem] border border-amber-400/25 bg-amber-400/10 p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">Zahlung abgebrochen</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Die Buchung wurde noch nicht bezahlt</h1>
        <p className="mt-4 text-base leading-7 text-slate-200">
          Es wurde keine Zahlung abgeschlossen.
          {bookingId ? ` Die angelegte Buchung ${bookingId} bleibt im Status „pending“, bis bezahlt wird.` : ''}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/camps" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            Erneut versuchen
          </Link>
          <Link href="/contact" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
            Hilfe anfragen
          </Link>
        </div>
      </div>
    </section>
  );
}
