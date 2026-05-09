import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPrismaClient } from '@/lib/prisma';
import { formatEuroAmount, MANUAL_PAYPAL_ACCOUNT } from '@/lib/payment-options';

export default async function PaypalCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;

  if (!bookingId) {
    notFound();
  }

  const booking = await getPrismaClient().booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    notFound();
  }

  const paymentReference = `${booking.participantFirstName} ${booking.participantLastName} - ${booking.contactEmail}`;

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <div className="rounded-[2rem] border border-sky-300/25 bg-sky-300/10 p-8 text-slate-100 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">PayPal-Überweisung</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Buchung ist vorgemerkt</h1>
        <p className="mt-4 text-base leading-7 text-slate-200">
          Bitte überweise den Betrag per PayPal. Die Buchung bleibt bis zum Zahlungseingang im Status
          Offen.
        </p>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-sm">
          <div>
            <dt className="text-slate-400">PayPal-Konto</dt>
            <dd className="mt-1 text-lg font-semibold text-white">{MANUAL_PAYPAL_ACCOUNT}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Betrag</dt>
            <dd className="mt-1 text-lg font-semibold text-white">{formatEuroAmount(booking.amountCents)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Verwendungszweck</dt>
            <dd className="mt-1 break-words text-lg font-semibold text-white">{paymentReference}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Buchungs-ID</dt>
            <dd className="mt-1 break-words font-mono text-sm text-white">{booking.id}</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm leading-6 text-slate-300">
          Nutze bitte Name und E-Mail im Verwendungszweck, damit die Zahlung eindeutig zugeordnet werden
          kann.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/account" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
            Meine Buchungen ansehen
          </Link>
          <Link href="/camps" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            Weitere Camps ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
