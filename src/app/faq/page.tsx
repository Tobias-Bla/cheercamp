const faqItems = [
  {
    question: 'Was ist im Preis enthalten?',
    answer:
      'Der Online-Preis gilt fuer das General Camp am Samstag und deckt je nach Camp Halle, Coach und die Uebernachtung in der Halle ab. Verpflegung ist nicht enthalten.',
  },
  {
    question: 'Kann ich schon buchen, wenn noch kein Datum feststeht?',
    answer:
      'Nein. Camps ohne fixes Datum bleiben sichtbar, aber die Buchung wird erst freigeschaltet, sobald der Termin final feststeht.',
  },
  {
    question: 'Wann findet das General Camp statt?',
    answer:
      'Freitags ist eine optionale Anreise ab 15:00 Uhr moeglich. Samstags findet das allgemeine Camp immer von 12:00 bis 18:00 Uhr statt. Je nach Coach gibt es einen genauen Zeitplan oder ein freieres Wunschformat.',
  },
  {
    question: 'Für wen ist das Camp gedacht?',
    answer:
      'Der Fokus liegt auf Partnerstunt. Groupstunts sind aber ausdrücklich willkommen und können genauso am Samstag und in Privates berücksichtigt werden.',
  },
  {
    question: 'Wie werden Themen fürs Camp ausgewählt?',
    answer:
      'Teilnehmer können Wünsche für bestimmte Stunts oder Technikthemen angeben. Bisher wurde das per Umfrage gesammelt; im Formular ist dafür jetzt direkt ein Wunschfeld vorgesehen.',
  },
  {
    question: 'Wie funktionieren die Privates am Sonntag?',
    answer:
      'Privates koennen fuer Pairs in Partnerstunts oder Groupstunts angefragt werden. Ausserdem sind Einzel-Sessions mit direktem Stunten mit dem Coach moeglich. Diese Privates werden separat und bar direkt an den Coach gezahlt.',
  },
  {
    question: 'Wann ist eine Buchung verbindlich?',
    answer:
      'Sobald die Zahlung für das General Camp über Stripe erfolgreich abgeschlossen wurde. Vorher bleibt die Buchung im Status pending.',
  },
];

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">FAQ</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Häufige Fragen</h1>
      </div>

      <div className="mt-10 space-y-4">
        {faqItems.map((item) => (
          <article key={item.question} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">{item.question}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
