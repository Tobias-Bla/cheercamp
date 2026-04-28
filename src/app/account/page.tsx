import Link from 'next/link';
import { logoutAction, updateProfileAction } from '@/app/account/actions';
import { getCurrentUser } from '@/lib/auth';
import { formatCurrency, formatDate, formatDateRange } from '@/lib/format';
import { getPrismaClient } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; saved?: string }>;
}) {
  const [{ created, saved }, currentUser] = await Promise.all([searchParams, getCurrentUser()]);

  if (!currentUser) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Mein Konto</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Optional registrieren</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Du kannst weiterhin ohne Konto buchen. Mit Konto siehst du deine Buchungen gesammelt und kannst deine Daten
            fuer spaetere Camps speichern.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/account/register" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
              Konto erstellen
            </Link>
            <Link href="/account/login" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              Einloggen
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const prisma = getPrismaClient();
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { userId: currentUser.id },
        {
          contactEmail: {
            equals: currentUser.profile.email,
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Mein Konto</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Hallo{currentUser.profile.name ? `, ${currentUser.profile.name}` : ''}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Hier findest du deine Buchungen und kannst Daten speichern, die beim naechsten Formular vorausgefuellt werden.
          </p>
        </div>
        <form action={logoutAction}>
          <button className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300 hover:text-fuchsia-200">
            Abmelden
          </button>
        </form>
      </div>

      {created ? (
        <div className="mb-8 rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 px-6 py-4 text-sm text-emerald-100">
          Konto wurde erstellt.
        </div>
      ) : null}

      {saved ? (
        <div className="mb-8 rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 px-6 py-4 text-sm text-emerald-100">
          Profil wurde gespeichert.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Gespeicherte Daten</h2>
          <form action={updateProfileAction} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-200 md:col-span-2">
              Name
              <input name="name" defaultValue={currentUser.profile.name} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Vorname Teilnehmer*in
              <input name="participantFirstName" defaultValue={currentUser.profile.participantFirstName} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Nachname Teilnehmer*in
              <input name="participantLastName" defaultValue={currentUser.profile.participantLastName} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Geburtsdatum
              <input name="participantBirthDate" type="date" defaultValue={currentUser.profile.participantBirthDate} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Telefonnummer
              <input name="contactPhone" defaultValue={currentUser.profile.contactPhone} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Handynummer Teilnehmer*in
              <input name="participantMobile" defaultValue={currentUser.profile.participantMobile} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Notfallkontakt Name
              <input name="emergencyContactName" defaultValue={currentUser.profile.emergencyContactName} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Notfallkontakt Telefon
              <input name="emergencyContactPhone" defaultValue={currentUser.profile.emergencyContactPhone} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Teamname
              <input name="teamName" defaultValue={currentUser.profile.teamName} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200">
              Partner*in / Group
              <input name="stuntPartnerOrGroup" defaultValue={currentUser.profile.stuntPartnerOrGroup} className="field mt-2" />
            </label>
            <label className="text-sm text-slate-200 md:col-span-2">
              Allergien / Unvertraeglichkeiten
              <textarea name="allergies" defaultValue={currentUser.profile.allergies} rows={3} className="field mt-2 min-h-28" />
            </label>
            <label className="text-sm text-slate-200 md:col-span-2">
              Sonstige Hinweise
              <textarea name="notes" defaultValue={currentUser.profile.notes} rows={3} className="field mt-2 min-h-28" />
            </label>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 md:col-span-2">
              Profil speichern
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">Meine Buchungen</h2>
          <div className="mt-6 grid gap-4">
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-5 text-sm leading-7 text-slate-300">
                Noch keine Buchung fuer dieses Konto gefunden.
              </div>
            ) : (
              bookings.map((booking) => (
                <article key={booking.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-5 text-sm text-slate-300">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{booking.campTitle}</h3>
                      <p className="mt-1">
                        {booking.campStartDate && booking.campEndDate
                          ? formatDateRange(booking.campStartDate.toISOString().slice(0, 10), booking.campEndDate.toISOString().slice(0, 10))
                          : booking.campLocation}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">{booking.status}</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-white">Teilnehmer*in:</span> {booking.participantFirstName} {booking.participantLastName}
                    </p>
                    <p>
                      <span className="font-semibold text-white">Betrag:</span> {formatCurrency(booking.amountCents, booking.currency)}
                    </p>
                    <p>
                      <span className="font-semibold text-white">Gebucht:</span> {formatDate(booking.createdAt)}
                    </p>
                    <p>
                      <span className="font-semibold text-white">Buchungs-ID:</span> {booking.id}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
