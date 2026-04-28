import Link from 'next/link';
import { loginAction } from '@/app/account/actions';

function getMessage(error: string | undefined, loggedOut: string | undefined): string | null {
  if (loggedOut) {
    return 'Du wurdest abgemeldet.';
  }

  if (error === 'invalid') {
    return 'E-Mail oder Passwort stimmt nicht.';
  }

  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; loggedOut?: string }>;
}) {
  const { error, loggedOut } = await searchParams;
  const message = getMessage(error, loggedOut);

  return (
    <section className="mx-auto max-w-xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Mein Konto</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Einloggen</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Melde dich an, um deine Buchungen zu sehen und deine Daten beim naechsten Camp schneller einzutragen.
        </p>

        {message ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
            {message}
          </div>
        ) : null}

        <form action={loginAction} className="mt-8 grid gap-5">
          <label className="text-sm text-slate-200">
            E-Mail
            <input name="email" type="email" required className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Passwort
            <input name="password" type="password" required className="field mt-2" />
          </label>
          <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
            Einloggen
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          <Link href="/account/forgot-password" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Passwort vergessen?
          </Link>
        </p>

        <p className="mt-3 text-sm text-slate-300">
          Noch kein Konto?{' '}
          <Link href="/account/register" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Konto erstellen
          </Link>
        </p>
      </div>
    </section>
  );
}
