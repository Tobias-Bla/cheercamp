import Link from 'next/link';
import { getPrismaClient } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

const statusLabels = {
  PENDING: 'Offen',
  PAID: 'Bezahlt',
  CANCELLED: 'Abgebrochen',
} as const;

const statusClasses = {
  PENDING: 'border-amber-300/25 bg-amber-300/10 text-amber-100',
  PAID: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
  CANCELLED: 'border-slate-300/20 bg-slate-300/10 text-slate-200',
} as const;

const experienceLevelLabels = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

const stuntFormatLabels = {
  PARTNER_STUNT: 'Partnerstunt',
  GROUP_STUNT: 'Groupstunt',
} as const;

const privateInterestLabels = {
  NONE: 'Kein Private',
  PAIR_60: 'Pair Private 60 Min.',
  PAIR_90: 'Pair Private 90 Min.',
  GROUP_60: 'Groupstunt Private 60 Min.',
  GROUP_90: 'Groupstunt Private 90 Min.',
  INDIVIDUAL_60: 'Einzelperson 60 Min.',
  INDIVIDUAL_90: 'Einzelperson 90 Min.',
} as const;

async function getBookings() {
  try {
    const prisma = getPrismaClient();
    return await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch {
    return null;
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  if (bookings === null) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-amber-400/25 bg-amber-400/10 p-6 text-sm text-slate-100">
          Admin-Bereich ist erreichbar, aber die Datenbankverbindung fehlt oder ist noch nicht eingerichtet.
        </div>
      </section>
    );
  }

  const paidBookings = bookings.filter((booking) => booking.status === 'PAID');
  const pendingBookings = bookings.filter((booking) => booking.status === 'PENDING');
  const paidRevenueCents = paidBookings.reduce((sum, booking) => sum + booking.amountCents, 0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Buchungen</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Alle eingegangenen Buchungen mit Zahlungsstatus, Kontaktdaten und Camp-Details.
          </p>
        </div>
        <Link
          href="/admin/camps"
          className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300 hover:text-fuchsia-200"
        >
          Camps verwalten
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Gesamt</p>
          <p className="mt-2 text-3xl font-semibold text-white">{bookings.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Bezahlt</p>
          <p className="mt-2 text-3xl font-semibold text-white">{paidBookings.length}</p>
          <p className="mt-1 text-sm text-emerald-100">{formatCurrency(paidRevenueCents)}</p>
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-200">Offen</p>
          <p className="mt-2 text-3xl font-semibold text-white">{pendingBookings.length}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-sm text-slate-300">
            Noch keine Buchungen vorhanden.
          </div>
        ) : (
          bookings.map((booking) => (
            <article key={booking.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {booking.participantFirstName} {booking.participantLastName}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{booking.contactEmail}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs ${statusClasses[booking.status]}`}>
                    {statusLabels[booking.status]}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                    {formatCurrency(booking.amountCents, booking.currency)}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">{formatDate(booking.createdAt)}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Camp</p>
                  <p className="mt-2 font-medium text-white">{booking.campTitle}</p>
                  <p className="mt-1 text-slate-400">{booking.campLocation}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Format</p>
                  <p className="mt-2 font-medium text-white">{stuntFormatLabels[booking.stuntFormat]}</p>
                  <p className="mt-1 text-slate-400">Level: {experienceLevelLabels[booking.experienceLevel]}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Team / Gruppe</p>
                  <p className="mt-2 font-medium text-white">{booking.teamName ?? 'Keine Angabe'}</p>
                  <p className="mt-1 text-slate-400">{booking.stuntPartnerOrGroup ?? 'Keine Angabe'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Kontakt & Private</p>
                  <p className="mt-2 font-medium text-white">{privateInterestLabels[booking.privateInterest]}</p>
                  <p className="mt-1 text-slate-400">Handy: {booking.participantMobile}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Samstags-Wunsch</p>
                  <p className="mt-2 leading-6 text-slate-300">{booking.saturdayWish ?? 'Keine Angabe'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Notizen</p>
                  <p className="mt-2 leading-6 text-slate-300">{booking.notes ?? 'Keine Angabe'}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
