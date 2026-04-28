import Link from 'next/link';
import { resetPasswordAction } from '@/app/account/actions';

function getErrorMessage(error: string | undefined): string | null {
  if (error === 'expired') {
    return 'Dieser Reset-Link ist abgelaufen oder wurde bereits benutzt.';
  }

  if (error === 'invalid') {
    return 'Bitte gib ein Passwort mit mindestens 8 Zeichen ein.';
  }

  return null;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  const errorMessage = getErrorMessage(error);

  return (
    <section className="mx-auto max-w-xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Mein Konto</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Neues Passwort</h1>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        {!token ? (
          <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Der Reset-Link ist unvollständig. Fordere bitte einen neuen Link an.
          </div>
        ) : (
          <form action={resetPasswordAction} className="mt-8 grid gap-5">
            <input type="hidden" name="token" value={token} />
            <label className="text-sm text-slate-200">
              Neues Passwort
              <input name="password" type="password" required minLength={8} className="field mt-2" />
              <span className="mt-2 block text-xs leading-6 text-slate-400">Mindestens 8 Zeichen.</span>
            </label>
            <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Passwort speichern
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-slate-300">
          <Link href="/account/forgot-password" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Neuen Reset-Link anfordern
          </Link>
        </p>
      </div>
    </section>
  );
}
