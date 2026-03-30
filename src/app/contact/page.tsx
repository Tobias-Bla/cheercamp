import { siteConfig } from '@/data/site-config';

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Kontakt</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Fragen zum Camp, zur Buchung oder zu Privates?</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Die Website ist bereits auf wiederkehrende Camps im Jahr ausgelegt. Über die Kontaktseite können später auch konkrete Private-Anfragen, Coach-Infos und Merch-Themen ergänzt werden.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-lg font-semibold text-white">Stunt Cheercamp</p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>{siteConfig.email}</p>
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.addressLine1}</p>
            <p>{siteConfig.addressLine2}</p>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-xs leading-6 text-slate-300">
            Hinweis: Die Kontaktangaben sind aktuell noch Platzhalter und sollten vor dem Livegang durch die echten Daten ersetzt werden.
          </div>
        </div>
      </div>
    </section>
  );
}
