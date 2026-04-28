import { siteConfig } from '@/data/site-config';

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Kontakt</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Fragen zum Camp, zur Buchung oder zu Privates?</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Schreib uns bei Fragen zum Camp, zur Organisation oder zu möglichen Privates am Sonntag.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-lg font-semibold text-white">{siteConfig.legalCompany}</p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>E-Mail: {siteConfig.email}</p>
            <p>Telefon: {siteConfig.phone}</p>
            <p>{siteConfig.addressLine1}</p>
            <p>{siteConfig.addressLine2}</p>
            <p>{siteConfig.country}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
