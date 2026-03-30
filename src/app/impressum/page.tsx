import { siteConfig } from '@/data/site-config';

export default function ImpressumPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Impressum</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Impressum</h1>
      <div className="mt-8 rounded-[2rem] border border-amber-400/25 bg-amber-400/10 p-6 text-sm leading-7 text-slate-200">
        Platzhalterdaten. Vor Veröffentlichung unbedingt mit echten Unternehmens- und Verantwortlichkeitsdaten ersetzen.
      </div>
      <div className="mt-8 space-y-3 text-sm leading-7 text-slate-300">
        <p>{siteConfig.legalCompany}</p>
        <p>{siteConfig.addressLine1}</p>
        <p>{siteConfig.addressLine2}</p>
        <p>E-Mail: {siteConfig.email}</p>
        <p>Telefon: {siteConfig.phone}</p>
      </div>
    </section>
  );
}
