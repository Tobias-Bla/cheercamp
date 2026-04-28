import Link from 'next/link';
import { requestPasswordResetAction } from '@/app/account/actions';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <section className="mx-auto max-w-xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Mein Konto</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Passwort vergessen</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Gib deine E-Mail ein. Falls ein Konto existiert, schicken wir dir einen Link zum Zuruecksetzen.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            Wenn die E-Mail registriert ist, wurde ein Reset-Link verschickt.
          </div>
        ) : null}

        <form action={requestPasswordResetAction} className="mt-8 grid gap-5">
          <label className="text-sm text-slate-200">
            E-Mail
            <input name="email" type="email" required className="field mt-2" />
          </label>
          <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
            Reset-Link senden
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Passwort wieder eingefallen?{' '}
          <Link href="/account/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
            Einloggen
          </Link>
        </p>
      </div>
    </section>
  );
}
