import { getPrismaClient } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

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

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Admin</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Buchungen</h1>
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
                  <p className="mt-1 text-sm text-slate-400">{booking.guardianEmail}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">{booking.status}</span>
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
                  <p className="mt-2 font-medium text-white">{booking.stuntFormat}</p>
                  <p className="mt-1 text-slate-400">Level: {booking.experienceLevel}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Team / Gruppe</p>
                  <p className="mt-2 font-medium text-white">{booking.teamName ?? '—'}</p>
                  <p className="mt-1 text-slate-400">{booking.stuntPartnerOrGroup ?? 'Keine Angabe'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Private-Interesse</p>
                  <p className="mt-2 font-medium text-white">{booking.privateInterest}</p>
                  <p className="mt-1 text-slate-400">T-Shirt: {booking.tshirtSize}</p>
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
