# Stunt Cheercamp Website MVP

Ein modernes MVP für wiederkehrende Cheercamps in St. Blasien mit:
- öffentlicher Website
- Camp-Übersicht
- Buchungsformular für das General Camp
- Stripe-Zahlung
- Admin-Buchungsübersicht
- vorbereitet für GitHub → Vercel → Neon

## Bereits eingebaut
- Camps in der Albtalhalle St. Blasien
- 35 Plätze pro Camp
- Partnerstunt-Fokus, Groupstunts willkommen
- Special Camp mit 40 € p. P.
- Standard Camp mit 80 € p. P.
- Hinweise zu Übernachtung in der Halle
- Privates am Sonntag als separate Anfrage
- zusätzliche Buchungsfelder für:
  - Partnerstunt / Groupstunt
  - Teamname
  - Partner- oder Gruppenkonstellation
  - Wünsche fürs Samstag-Camp
  - Interesse an Privates

## Tech-Stack
- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Prisma ORM
- Neon PostgreSQL
- Stripe Checkout
- Vercel Blob fuer persistente Bild-Uploads

## Wichtige Hinweise
- Die Camp-Daten sind im MVP statisch in `src/data/camps.ts` hinterlegt.
- Buchungen werden in PostgreSQL gespeichert.
- Online bezahlt wird nur das General Camp.
- Privates am Sonntag werden separat angefragt und bar direkt an den Coach gezahlt.
- `/admin` ist per Basic Auth abgesichert, sobald mindestens ein gueltiges Admin-Zugangspaar gesetzt ist (`ADMIN_USERNAME` / `ADMIN_PASSWORD`, optional auch `_2` und `_3`).
- Camp-Bilder koennen optional ueber Vercel Blob hochgeladen werden. Dafuer braucht das Projekt einen Public Blob Store und `BLOB_READ_WRITE_TOKEN`.
- `Impressum`, `Datenschutz` und die Kontaktangaben sind gepflegt; vor Livegang trotzdem final inhaltlich pruefen.

## Lokales Setup
1. Repository klonen
2. Dependencies installieren
3. `.env.example` nach `.env` kopieren
4. Neon-Verbindungsdaten und Stripe-Keys eintragen
5. Prisma Client generieren
6. Migration ausführen
7. Dev-Server starten

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

## Empfohlene Vercel-Environments
- `Preview`: Test-Stripe-Keys + Test-Neon-DB
- `Production`: Live-Stripe-Keys + Live-Neon-DB

## Relevante Umgebungsvariablen
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_USERNAME_2`
- `ADMIN_PASSWORD_2`
- `ADMIN_USERNAME_3`
- `ADMIN_PASSWORD_3`

## Stripe Webhook
In Stripe einen Webhook auf folgende URL anlegen:

```text
https://deine-domain.de/api/stripe/webhook
```

Wichtige Events:
- `checkout.session.completed`
- `checkout.session.expired`

## Vercel Blob fuer Camp-Bilder
1. Im Vercel-Projekt unter `Storage` einen neuen Blob Store anlegen
2. Den Store als `Public` erstellen
3. Sicherstellen, dass `BLOB_READ_WRITE_TOKEN` dem Projekt-Environment hinzugefuegt wird
4. Danach koennen im Admin-Bereich unter `/admin/camps` Cover-, Booking- und Galerie-Bilder direkt hochgeladen werden

Hinweis: Der aktuelle Upload laeuft serverseitig. Einzelne Bilddateien sollten deshalb unter ca. 4 MB bleiben.

## Deployment-Reihenfolge
1. GitHub-Repository anlegen
2. Projekt mit Vercel verbinden
3. Environment Variables in Vercel setzen
4. Neon-DB verbinden
5. Erste Migration lokal ausführen und committen
6. Stripe Webhook konfigurieren
7. Testbuchung durchführen

## Nächste sinnvolle Schritte
- echtes Kontaktformular
- E-Mail-Bestaetigung nach Zahlung verfeinern
- E-Mail-Bestätigung nach Zahlung
- CSV-Export der Buchungen
- Slots für Privates administrierbar machen
- Merch-Shop als Phase 2


## Häufige lokale Fehler

### `P1001: Can't reach database server at localhost:5432`
Dann ist `DIRECT_URL` nicht gesetzt und Prisma versucht nicht eure Neon-Datenbank zu verwenden. Lösung:

```bash
cp .env.example .env
```

Danach in `.env` sowohl `DATABASE_URL` als auch `DIRECT_URL` mit euren echten Neon-Strings befüllen.

### ESLint- oder TypeScript-Fehler direkt nach `npm install`
Das Projekt ist auf **React 19 + Next 16 + ESLint 9 Flat Config** ausgelegt. Falls ihr noch alte lokale Dateien oder Editor-Caches offen habt, nach dem Update bitte einmal alles neu prüfen:

```bash
npm run lint
npm run typecheck
npm run build
```
