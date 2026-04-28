import Link from 'next/link';
import { registerAction } from '@/app/account/actions';

function getErrorMessage(error: string | undefined): string | null {
  if (error === 'exists') {
    return 'Für diese E-Mail gibt es bereits ein Konto.';
  }

  if (error === 'invalid') {
    return 'Bitte gib eine gültige E-Mail und ein Passwort mit mindestens 8 Zeichen ein.';
  }

  return null;
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = getErrorMessage(error);

  return (
    <section className="mx-auto max-w-xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Mein Konto</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Konto erstellen</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Optionales Konto für schnellere Buchungen und eine Übersicht deiner Anmeldungen.
        </p>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        <form action={registerAction} className="mt-8 grid gap-5">
          <label className="text-sm text-slate-200">
            Name
            <input name="name" className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            E-Mail
            <input name="email" type="email" required className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Passwort
            <input name="password" type="password" required minLength={8} className="field mt-2" />
            <span className="mt-2 block text-xs leading-6 text-slate-400">Mindestens 8 Zeichen.</span>
          </label>
          <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
            Konto erstellen
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Schon registriert?{' '}
          <Link href="/account/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Einloggen
          </Link>
        </p>
      </div>
    </section>
  );
}
