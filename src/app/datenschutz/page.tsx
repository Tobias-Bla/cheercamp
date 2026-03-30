export default function DatenschutzPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Datenschutz</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Datenschutzhinweise</h1>
      <div className="mt-8 rounded-[2rem] border border-amber-400/25 bg-amber-400/10 p-6 text-sm leading-7 text-slate-200">
        Diese Seite enthält bewusst nur einen Platzhaltertext. Vor Livegang muss hier eine echte DSGVO-konforme Datenschutzerklärung eingefügt werden.
      </div>
      <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
        <p>Verarbeitet werden im MVP insbesondere Buchungsdaten, Kontaktdaten und Zahlungsstatus.</p>
        <p>Die eigentliche Zahlungsabwicklung erfolgt über Stripe.</p>
        <p>Bitte vor Veröffentlichung rechtlich final prüfen lassen.</p>
      </div>
    </section>
  );
}
