import { siteConfig } from '@/data/site-config';

const sections = [
  {
    title: '1. Verantwortliche Stelle',
    content: [
      `${siteConfig.legalCompany}, ${siteConfig.addressLine1}, ${siteConfig.addressLine2}, ${siteConfig.country}`,
      `E-Mail: ${siteConfig.email}`,
      `Telefon: ${siteConfig.phone}`,
    ],
  },
  {
    title: '2. Allgemeines zur Datenverarbeitung',
    content: [
      'Wir verarbeiten personenbezogene Daten nur, soweit dies für den Betrieb dieser Website, die Beantwortung von Anfragen, die Verwaltung von Accounts und die Durchführung von Camp-Buchungen erforderlich ist.',
      'Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche Maßnahmen und Buchungen, Art. 6 Abs. 1 lit. c DSGVO für gesetzliche Pflichten, Art. 6 Abs. 1 lit. f DSGVO für den sicheren Betrieb der Website sowie Art. 6 Abs. 1 lit. a DSGVO, wenn eine Einwilligung erteilt wird.',
    ],
  },
  {
    title: '3. Hosting und Server-Logs',
    content: [
      'Die Website wird über Vercel bereitgestellt. Beim Aufruf der Website können technisch notwendige Zugriffsdaten verarbeitet werden, zum Beispiel IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite, Browser- und Geräteinformationen sowie technische Statuscodes.',
      'Diese Verarbeitung dient der Auslieferung, Stabilität und Sicherheit der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.',
      'Weitere Informationen: https://vercel.com/legal/privacy-policy',
    ],
  },
  {
    title: '4. Kontaktaufnahme',
    content: [
      'Wenn du uns per E-Mail, Telefon oder über andere angegebene Kontaktwege kontaktierst, verarbeiten wir deine Angaben zur Bearbeitung der Anfrage.',
      'Dazu können insbesondere Name, E-Mail-Adresse, Telefonnummer und der Inhalt deiner Nachricht gehören. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um eine Buchung oder Anfrage zu einem Camp geht, sonst Art. 6 Abs. 1 lit. f DSGVO.',
    ],
  },
  {
    title: '5. Buchungen und Camp-Organisation',
    content: [
      'Für Camp-Buchungen verarbeiten wir die im Buchungsformular angegebenen Daten, insbesondere Name, Geburtsdatum, Kontaktdaten, Notfallkontakt, Team- oder Gruppenangaben, Stunt-Level, gewünschtes Format, Private-Interesse, Wünsche für das Camp, Allergien, Hinweise, Fotoeinwilligung, Zahlungsstatus und Buchungsdaten.',
      'Diese Daten werden benötigt, um die Buchung durchzuführen, Teilnehmende zu verwalten, Rückfragen zu klären, die Sicherheit vor Ort zu organisieren und den Zahlungsstatus zu prüfen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
      'Angaben zu Allergien oder besonderen Hinweisen machst du freiwillig. Sie helfen bei der sicheren Organisation des Camps. Wenn darin Gesundheitsdaten enthalten sind, erfolgt die Verarbeitung auf Grundlage deiner ausdrücklichen Angabe und Einwilligung im Rahmen der Buchung.',
    ],
  },
  {
    title: '6. Optionale Benutzerkonten',
    content: [
      'Du kannst freiwillig ein Benutzerkonto anlegen. Dafür verarbeiten wir deine E-Mail-Adresse, ein verschlüsseltes Passwort sowie optional gespeicherte Profildaten wie Name, Kontaktdaten, Notfallkontakt, Teamangaben, Allergien und Notizen.',
      'Das Konto dient dazu, Buchungen wiederzufinden und Buchungsformulare künftig vorzubefüllen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
      'Für eingeloggte Nutzer setzen wir ein technisch notwendiges Session-Cookie namens cheercamp_session. Dieses Cookie bleibt bis zu 30 Tage bestehen oder bis du dich ausloggst. Es wird nicht zu Werbe- oder Trackingzwecken genutzt.',
    ],
  },
  {
    title: '7. Passwort zurücksetzen',
    content: [
      'Wenn du die Funktion „Passwort vergessen“ nutzt, erzeugen wir einen zeitlich begrenzten Reset-Link und versenden ihn an deine E-Mail-Adresse.',
      'Für den Versand nutzen wir Resend. Dabei werden insbesondere Empfängeradresse, Inhalt der E-Mail und technische Versanddaten verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
      'Weitere Informationen: https://www.resend.com/security/gdpr',
    ],
  },
  {
    title: '8. Zahlungsabwicklung über Stripe',
    content: [
      'Die Zahlung wird über Stripe Checkout abgewickelt. Für die Zahlungsabwicklung werden Buchungs- und Zahlungsdaten an Stripe übermittelt, insbesondere Betrag, Währung, E-Mail-Adresse, Buchungsreferenz und die für die Zahlung erforderlichen Angaben.',
      'Kartendaten werden nicht auf unserer Website gespeichert, sondern direkt von Stripe verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.',
      'Weitere Informationen: https://stripe.com/privacy',
    ],
  },
  {
    title: '9. Bilder und Datei-Uploads',
    content: [
      'Im Admin-Bereich können Bilder zu Camps hochgeladen werden. Diese werden, sofern aktiviert, über Vercel Blob gespeichert und öffentlich auf der Website angezeigt.',
      'Wenn auf Bildern Personen erkennbar sind, werden solche Bilder nur verwendet, wenn hierfür eine passende Einwilligung oder eine andere rechtliche Grundlage vorliegt.',
    ],
  },
  {
    title: '10. Cookies und Tracking',
    content: [
      'Diese Website verwendet nach aktuellem Stand keine Analyse-, Werbe- oder Marketing-Cookies.',
      'Technisch notwendige Cookies können für Login-Sitzungen eingesetzt werden. Sie dienen ausschließlich der Bereitstellung der Account-Funktion.',
    ],
  },
  {
    title: '11. Speicherdauer',
    content: [
      'Personenbezogene Daten werden nur so lange gespeichert, wie sie für die genannten Zwecke erforderlich sind oder gesetzliche Aufbewahrungspflichten bestehen.',
      'Buchungs- und Zahlungsdaten können wegen steuerlicher und buchhalterischer Pflichten länger aufbewahrt werden. Accountdaten werden gespeichert, solange das Konto besteht. Passwort-Reset-Tokens werden nur zeitlich begrenzt vorgehalten.',
    ],
  },
  {
    title: '12. Empfänger der Daten',
    content: [
      'Zugriff auf personenbezogene Daten erhalten nur Personen, die diese für Organisation, Buchung, Support oder technische Betreuung benötigen.',
      'Als externe Dienstleister können insbesondere Vercel, Stripe, Resend und der Datenbankanbieter eingesetzt werden. Mit Dienstleistern werden, soweit erforderlich, Verträge zur Auftragsverarbeitung abgeschlossen.',
    ],
  },
  {
    title: '13. Deine Rechte',
    content: [
      'Du hast nach Maßgabe der DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.',
      'Wenn eine Verarbeitung auf Einwilligung beruht, kannst du diese Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.',
      `Zur Ausübung deiner Rechte kannst du dich an ${siteConfig.email} wenden.`,
    ],
  },
  {
    title: '14. Beschwerderecht',
    content: [
      'Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.',
      'Für Baden-Württemberg ist dies der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg.',
      'Weitere Informationen: https://www.baden-wuerttemberg.datenschutz.de/beschwerde/',
    ],
  },
];

export default function DatenschutzPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Datenschutz</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Datenschutzerklärung</h1>
      <p className="mt-5 text-sm leading-7 text-slate-300">
        Stand: April 2026. Diese Datenschutzerklärung beschreibt, welche Daten im Zusammenhang mit dieser Website,
        Benutzerkonten, Camp-Buchungen und Zahlungen verarbeitet werden.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {section.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
