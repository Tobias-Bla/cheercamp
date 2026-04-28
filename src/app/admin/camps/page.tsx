import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { camps as seededCamps, type Camp } from '@/data/camps';
import { CAMP_IMAGE_ACCEPT, isBlobUploadEnabled, uploadCampImage } from '@/lib/blob';
import { deleteManagedCamp, getAdminCamps, upsertManagedCamp, type ManagedCampInput } from '@/lib/camps';

export const dynamic = 'force-dynamic';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseGallery(value: FormDataEntryValue | null): Camp['gallery'] {
  return parseLines(value)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map(([src, alt]) => ({ src, alt }));
}

function parsePrivateOptions(value: FormDataEntryValue | null): Camp['privateOptions'] {
  return parseLines(value)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map(([label, optionValue]) => ({
      label,
      value: optionValue as Camp['privateOptions'][number]['value'],
    }));
}

function parseSchedule(value: FormDataEntryValue | null): Camp['schedule'] {
  return parseLines(value)
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length >= 3 && parts[0] && parts[1] && parts[2])
    .map(([day, title, details]) => ({
      day,
      title,
      details: details
        .split(';;')
        .map((item) => item.trim())
        .filter(Boolean),
    }));
}

function serializeLines(values: string[]): string {
  return values.join('\n');
}

function serializeGallery(values: Camp['gallery']): string {
  return values.map((item) => `${item.src} | ${item.alt}`).join('\n');
}

function serializePrivateOptions(values: Camp['privateOptions']): string {
  return values.map((item) => `${item.label} | ${item.value}`).join('\n');
}

function serializeSchedule(values: Camp['schedule']): string {
  return values.map((item) => `${item.day} | ${item.title} | ${item.details.join(' ;; ')}`).join('\n');
}

function getBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on';
}

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getFiles(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function getSeedCampBySlug(slug: string): Camp | undefined {
  return seededCamps.find((camp) => camp.slug === slug);
}

function buildDefaultPrivateOptions(): Camp['privateOptions'] {
  return seededCamps[0]?.privateOptions ?? [];
}

function buildDefaultSchedule(): Camp['schedule'] {
  return [
    {
      day: 'Freitag',
      title: 'Optionale Anreise ab 15:00 Uhr',
      details: ['Optionale Anreise und entspanntes Ankommen in der Halle.'],
    },
    {
      day: 'Samstag',
      title: 'General Camp',
      details: ['General Camp mit Fokus auf Partnerstunt und Groupstunt.'],
    },
    {
      day: 'Sonntag',
      title: 'Privates nach Absprache',
      details: ['Privates werden separat angefragt und direkt vor Ort bezahlt.'],
    },
  ];
}

function normalizeCampInput(formData: FormData): ManagedCampInput {
  const title = String(formData.get('title') ?? '').trim();
  const slugValue = String(formData.get('slug') ?? '').trim();
  const slug = slugValue || slugify(title);
  const capacity = Number(String(formData.get('capacity') ?? '35'));
  const coverImage = String(formData.get('coverImage') ?? '').trim();
  const coverImageAlt = String(formData.get('coverImageAlt') ?? '').trim();
  const bookingImage = String(formData.get('bookingImage') ?? '').trim();
  const bookingImageAlt = String(formData.get('bookingImageAlt') ?? '').trim();

  return {
    slug,
    title,
    subtitle: String(formData.get('subtitle') ?? '').trim(),
    location: String(formData.get('location') ?? '').trim(),
    venue: String(formData.get('venue') ?? '').trim(),
    startDate: String(formData.get('startDate') ?? '').trim() || null,
    endDate: String(formData.get('endDate') ?? '').trim() || null,
    dateLabel: String(formData.get('dateLabel') ?? '').trim() || null,
    priceCents: Number(String(formData.get('priceCents') ?? '0')),
    capacity,
    capacityText: String(formData.get('capacityText') ?? '').trim() || `${capacity} Plätze`,
    ages: String(formData.get('ages') ?? '').trim(),
    level: String(formData.get('level') ?? '').trim(),
    coaches: parseLines(formData.get('coaches')),
    coachModeLabel: String(formData.get('coachModeLabel') ?? '').trim(),
    formatOptions: parseLines(formData.get('formatOptions')),
    generalCampTime: String(formData.get('generalCampTime') ?? '').trim(),
    overnightIncluded: getBoolean(formData, 'overnightIncluded'),
    privateAvailable: getBoolean(formData, 'privateAvailable'),
    privatePaymentNote: String(formData.get('privatePaymentNote') ?? '').trim(),
    coverImage,
    coverImageAlt,
    bookingImage,
    bookingImageAlt,
    gallery: parseGallery(formData.get('gallery')),
    privateOptions: parsePrivateOptions(formData.get('privateOptions')),
    focus: parseLines(formData.get('focus')),
    highlights: parseLines(formData.get('highlights')),
    schedule: parseSchedule(formData.get('schedule')),
    featured: getBoolean(formData, 'featured'),
    bookingOpen: getBoolean(formData, 'bookingOpen'),
  };
}

async function saveCampAction(formData: FormData): Promise<void> {
  'use server';

  const input = normalizeCampInput(formData);
  const seedCamp = getSeedCampBySlug(input.slug);
  const uploadedCoverImage = await (async () => {
    const file = getFile(formData, 'coverImageFile');

    if (!file) {
      return null;
    }

    return uploadCampImage({
      file,
      campSlug: input.slug,
      kind: 'cover',
    });
  })();
  const uploadedBookingImage = await (async () => {
    const file = getFile(formData, 'bookingImageFile');

    if (!file) {
      return null;
    }

    return uploadCampImage({
      file,
      campSlug: input.slug,
      kind: 'booking',
    });
  })();
  const uploadedGallery = await Promise.all(
    getFiles(formData, 'galleryFiles').map(async (file, index) => ({
      src: await uploadCampImage({
        file,
        campSlug: input.slug,
        kind: 'gallery',
      }),
      alt: `${input.title || 'Camp'} Galerie ${input.gallery.length + index + 1}`,
    })),
  );

  await upsertManagedCamp({
    ...input,
    subtitle: input.subtitle || seedCamp?.subtitle || 'Neues Camp',
    location: input.location || seedCamp?.location || 'St. Blasien',
    venue: input.venue || seedCamp?.venue || 'Albtalhalle, St. Blasien',
    ages: input.ages || seedCamp?.ages || 'Jugendliche & Erwachsene',
    level: input.level || seedCamp?.level || 'Open Level',
    coaches: input.coaches.length > 0 ? input.coaches : seedCamp?.coaches || ['Kai', 'Vio'],
    coachModeLabel: input.coachModeLabel || seedCamp?.coachModeLabel || 'Mit Kai und Vio',
    formatOptions: input.formatOptions.length > 0 ? input.formatOptions : seedCamp?.formatOptions || ['Partnerstunt', 'Groupstunt'],
    generalCampTime: input.generalCampTime || seedCamp?.generalCampTime || 'Samstag 12:00-18:00 Uhr',
    privatePaymentNote:
      input.privatePaymentNote ||
      seedCamp?.privatePaymentNote ||
      'Privates werden separat angefragt und direkt in bar an den Coach gezahlt.',
    coverImage: uploadedCoverImage || input.coverImage || seedCamp?.coverImage || '/images/hero-group-photo.webp',
    coverImageAlt: input.coverImageAlt || seedCamp?.coverImageAlt || 'Camp-Bild',
    bookingImage:
      uploadedBookingImage ||
      input.bookingImage ||
      seedCamp?.bookingImage ||
      uploadedCoverImage ||
      input.coverImage ||
      '/images/team-lineup.webp',
    bookingImageAlt: input.bookingImageAlt || seedCamp?.bookingImageAlt || input.coverImageAlt || 'Camp-Bild',
    gallery:
      input.gallery.length > 0 || uploadedGallery.length > 0
        ? [...input.gallery, ...uploadedGallery]
        : seedCamp?.gallery || [],
    privateOptions: input.privateOptions.length > 0 ? input.privateOptions : seedCamp?.privateOptions || buildDefaultPrivateOptions(),
    focus: input.focus.length > 0 ? input.focus : seedCamp?.focus || ['Partnerstunt', 'Groupstunt'],
    highlights: input.highlights.length > 0 ? input.highlights : seedCamp?.highlights || [],
    schedule: input.schedule.length > 0 ? input.schedule : seedCamp?.schedule || buildDefaultSchedule(),
  });

  revalidatePath('/');
  revalidatePath('/camps');
  revalidatePath('/impressionen');
  revalidatePath('/admin/camps');
  revalidatePath('/admin/bookings');
  revalidatePath(`/camps/${input.slug}`);
  revalidatePath(`/book/${input.slug}`);

  redirect('/admin/camps?saved=1');
}

async function deleteCampAction(formData: FormData): Promise<void> {
  'use server';

  const slug = String(formData.get('slug') ?? '').trim();
  const confirmed = formData.get('confirmDelete') === 'on';

  if (!slug) {
    redirect('/admin/camps?deleteError=missing');
  }

  if (!confirmed) {
    redirect('/admin/camps?deleteError=confirm');
  }

  if (getSeedCampBySlug(slug)) {
    redirect('/admin/camps?deleteError=seed');
  }

  await deleteManagedCamp(slug);

  revalidatePath('/');
  revalidatePath('/camps');
  revalidatePath('/impressionen');
  revalidatePath('/admin/camps');
  revalidatePath('/admin/bookings');
  revalidatePath(`/camps/${slug}`);
  revalidatePath(`/book/${slug}`);

  redirect('/admin/camps?deleted=1');
}

function getDeleteErrorMessage(error: string | undefined): string | null {
  if (error === 'confirm') {
    return 'Bitte bestaetige das Loeschen zuerst.';
  }

  if (error === 'seed') {
    return 'Seed-Camps koennen nicht im Admin geloescht werden, weil sie sonst aus den Seed-Daten wieder erscheinen.';
  }

  if (error) {
    return 'Camp konnte nicht geloescht werden.';
  }

  return null;
}

function CampForm({
  camp,
  heading,
  description,
  actionLabel,
  blobUploadsEnabled,
  canDelete = false,
}: {
  camp: Camp;
  heading: string;
  description: string;
  actionLabel: string;
  blobUploadsEnabled: boolean;
  canDelete?: boolean;
}) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">{heading}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      </div>

      <form action={saveCampAction} className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-200">
            Titel
            <input name="title" defaultValue={camp.title} required className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Slug
            <input name="slug" defaultValue={camp.slug} required className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            Kurzbeschreibung
            <textarea name="subtitle" defaultValue={camp.subtitle} rows={3} className="field mt-2 min-h-28" />
          </label>
          <label className="text-sm text-slate-200">
            Ort
            <input name="location" defaultValue={camp.location} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Halle / Venue
            <input name="venue" defaultValue={camp.venue} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Startdatum
            <input name="startDate" type="date" defaultValue={camp.startDate ?? ''} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Enddatum
            <input name="endDate" type="date" defaultValue={camp.endDate ?? ''} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Datumslabel
            <input name="dateLabel" defaultValue={camp.dateLabel ?? ''} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Preis in Cent
            <input name="priceCents" type="number" defaultValue={camp.priceCents} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Kapazitaet
            <input name="capacity" type="number" defaultValue={camp.capacity} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Kapazitaetstext
            <input name="capacityText" defaultValue={camp.capacityText} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Altersgruppe
            <input name="ages" defaultValue={camp.ages} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Level
            <input name="level" defaultValue={camp.level} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200">
            Coach-Setup
            <input name="coachModeLabel" defaultValue={camp.coachModeLabel} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            General Camp Zeit
            <input name="generalCampTime" defaultValue={camp.generalCampTime} className="field mt-2" />
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            Private-Hinweis
            <textarea name="privatePaymentNote" defaultValue={camp.privatePaymentNote} rows={3} className="field mt-2 min-h-28" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-200">
            Hauptbild URL oder Pfad
            <input name="coverImage" defaultValue={camp.coverImage} className="field mt-2" />
            <span className="mt-2 block text-xs leading-6 text-slate-400">
              Kann so bleiben oder automatisch durch einen Upload ersetzt werden.
            </span>
          </label>
          <label className="text-sm text-slate-200">
            Beschreibung Hauptbild
            <input name="coverImageAlt" defaultValue={camp.coverImageAlt} className="field mt-2" />
            <span className="mt-2 block text-xs leading-6 text-slate-400">
              Kurz beschreiben, was auf dem Bild zu sehen ist.
            </span>
          </label>
          <label className="text-sm text-slate-200">
            Buchungsbild URL oder Pfad
            <input name="bookingImage" defaultValue={camp.bookingImage} className="field mt-2" />
            <span className="mt-2 block text-xs leading-6 text-slate-400">
              Dieses Bild wird auf der Buchungsseite angezeigt.
            </span>
          </label>
          <label className="text-sm text-slate-200">
            Beschreibung Buchungsbild
            <input name="bookingImageAlt" defaultValue={camp.bookingImageAlt} className="field mt-2" />
            <span className="mt-2 block text-xs leading-6 text-slate-400">
              Auch hier kurz beschreiben, was zu sehen ist.
            </span>
          </label>
          <label className="text-sm text-slate-200">
            Hauptbild hochladen
            <input
              name="coverImageFile"
              type="file"
              accept={CAMP_IMAGE_ACCEPT}
              disabled={!blobUploadsEnabled}
              className="field mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            />
            <span className="mt-2 block text-xs leading-6 text-slate-400">
              {blobUploadsEnabled
                ? 'Beim Speichern wird das Bild dauerhaft in Vercel Blob gespeichert.'
                : 'Uploads sind deaktiviert, bis BLOB_READ_WRITE_TOKEN gesetzt ist.'}
            </span>
          </label>
          <label className="text-sm text-slate-200">
            Buchungsbild hochladen
            <input
              name="bookingImageFile"
              type="file"
              accept={CAMP_IMAGE_ACCEPT}
              disabled={!blobUploadsEnabled}
              className="field mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            />
            <span className="mt-2 block text-xs leading-6 text-slate-400">
              JPG, PNG, WebP oder AVIF, bis ca. 4 MB pro Datei.
            </span>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Vorschau Hauptbild</p>
            <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[1.25rem]">
              <Image src={camp.coverImage} alt={camp.coverImageAlt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Vorschau Buchungsbild</p>
            <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[1.25rem]">
              <Image
                src={camp.bookingImage}
                alt={camp.bookingImageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-200">
            Coaches
            <textarea name="coaches" defaultValue={serializeLines(camp.coaches)} rows={4} className="field mt-2 min-h-32" />
          </label>
          <label className="text-sm text-slate-200">
            Formate
            <textarea name="formatOptions" defaultValue={serializeLines(camp.formatOptions)} rows={4} className="field mt-2 min-h-32" />
          </label>
          <label className="text-sm text-slate-200">
            Fokus
            <textarea name="focus" defaultValue={serializeLines(camp.focus)} rows={5} className="field mt-2 min-h-32" />
          </label>
          <label className="text-sm text-slate-200">
            Highlights
            <textarea name="highlights" defaultValue={serializeLines(camp.highlights)} rows={5} className="field mt-2 min-h-32" />
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            Galerie
            <textarea
              name="gallery"
              defaultValue={serializeGallery(camp.gallery)}
              rows={5}
              className="field mt-2 min-h-36"
            />
            <span className="mt-2 block text-xs leading-6 text-slate-400">Pro Zeile: Bildpfad | Alt-Text</span>
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            Galerie-Bilder hochladen
            <input
              name="galleryFiles"
              type="file"
              accept={CAMP_IMAGE_ACCEPT}
              multiple
              disabled={!blobUploadsEnabled}
              className="field mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            />
            <span className="mt-2 block text-xs leading-6 text-slate-400">
              Hochgeladene Bilder werden beim Speichern zur bestehenden Galerie hinzugefügt.
            </span>
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            Private Optionen
            <textarea
              name="privateOptions"
              defaultValue={serializePrivateOptions(camp.privateOptions)}
              rows={6}
              className="field mt-2 min-h-40"
            />
            <span className="mt-2 block text-xs leading-6 text-slate-400">Pro Zeile: Label | Wert</span>
          </label>
          <label className="text-sm text-slate-200 md:col-span-2">
            Ablauf
            <textarea
              name="schedule"
              defaultValue={serializeSchedule(camp.schedule)}
              rows={6}
              className="field mt-2 min-h-40"
            />
            <span className="mt-2 block text-xs leading-6 text-slate-400">Pro Zeile: Tag | Titel | Detail 1 ;; Detail 2</span>
          </label>
        </div>

        {camp.gallery.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {camp.gallery.map((image) => (
              <div key={image.src} className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem]">
                  <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-300">{image.alt}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4 text-sm text-slate-200">
            <input name="featured" type="checkbox" defaultChecked={camp.featured} className="h-4 w-4" />
            Featured
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4 text-sm text-slate-200">
            <input name="bookingOpen" type="checkbox" defaultChecked={camp.bookingOpen} className="h-4 w-4" />
            Buchung offen
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4 text-sm text-slate-200">
            <input name="overnightIncluded" type="checkbox" defaultChecked={camp.overnightIncluded} className="h-4 w-4" />
            Übernachtung inklusive
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4 text-sm text-slate-200">
            <input name="privateAvailable" type="checkbox" defaultChecked={camp.privateAvailable} className="h-4 w-4" />
            Privates verfügbar
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          {actionLabel}
        </button>
      </form>

      {canDelete ? (
        <form action={deleteCampAction} className="mt-6 rounded-[1.5rem] border border-rose-400/25 bg-rose-400/10 p-5">
          <input type="hidden" name="slug" value={camp.slug} />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-rose-100">Camp loeschen</h3>
              <p className="mt-2 text-sm leading-6 text-rose-100/80">
                Entfernt dieses Camp aus der Datenbank, der Camp-Uebersicht und der Buchungsstrecke.
              </p>
              <label className="mt-4 flex items-center gap-3 text-sm text-rose-50">
                <input name="confirmDelete" type="checkbox" className="h-4 w-4 accent-rose-300" />
                Loeschen bestaetigen
              </label>
            </div>
            <button
              type="submit"
              className="rounded-full bg-rose-300 px-5 py-3 text-sm font-semibold text-rose-950 transition hover:bg-rose-200"
            >
              Camp loeschen
            </button>
          </div>
        </form>
      ) : null}
    </article>
  );
}

function createBlankCamp(): Camp {
  return {
    slug: '',
    title: '',
    subtitle: '',
    location: 'St. Blasien',
    venue: 'Albtalhalle, St. Blasien',
    startDate: null,
    endDate: null,
    dateLabel: 'Termin folgt',
    priceCents: 8000,
    capacity: 35,
    capacityText: '35 Plätze',
    ages: 'Jugendliche & Erwachsene',
    level: 'Open Level',
    coaches: ['Kai', 'Vio'],
    coachModeLabel: 'Mit Kai und Vio',
    formatOptions: ['Partnerstunt', 'Groupstunt'],
    generalCampTime: 'Freitag optionale Anreise ab 15:00 Uhr, Samstag 12:00-18:00 Uhr',
    overnightIncluded: true,
    privateAvailable: true,
    privatePaymentNote: 'Privates werden separat angefragt und direkt in bar an den Coach gezahlt.',
    coverImage: '/images/hero-group-photo.webp',
    coverImageAlt: 'Camp-Bild',
    bookingImage: '/images/team-lineup.webp',
    bookingImageAlt: 'Camp-Bild',
    gallery: [],
    privateOptions: buildDefaultPrivateOptions(),
    focus: ['Partnerstunt', 'Groupstunt'],
    highlights: [],
    schedule: buildDefaultSchedule(),
    featured: false,
    bookingOpen: false,
  };
}

export default async function AdminCampsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; deleteError?: string }>;
}) {
  const camps = await getAdminCamps();
  const { saved, deleted, deleteError } = await searchParams;
  const blobUploadsEnabled = isBlobUploadEnabled();
  const deleteErrorMessage = getDeleteErrorMessage(deleteError);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Camps verwalten</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Hier können neue Camps angelegt und bestehende Einträge aktualisiert werden. Bestehende Seed-Camps können einfach mit demselben Slug gespeichert werden und werden dann aus der Datenbank überschrieben.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/bookings"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-fuchsia-300 hover:text-fuchsia-200"
          >
            Zu den Buchungen
          </Link>
          <Link
            href="/camps"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Öffentliche Camps ansehen
          </Link>
        </div>
      </div>

      {saved ? (
        <div className="mb-8 rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 px-6 py-4 text-sm text-emerald-100">
          Camp wurde gespeichert.
        </div>
      ) : null}

      {deleted ? (
        <div className="mb-8 rounded-[2rem] border border-emerald-400/25 bg-emerald-400/10 px-6 py-4 text-sm text-emerald-100">
          Camp wurde geloescht.
        </div>
      ) : null}

      {deleteErrorMessage ? (
        <div className="mb-8 rounded-[2rem] border border-amber-400/25 bg-amber-400/10 px-6 py-4 text-sm text-amber-100">
          {deleteErrorMessage}
        </div>
      ) : null}

      <div className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/30 px-6 py-4 text-sm leading-7 text-slate-300">
        {blobUploadsEnabled
          ? 'Bild-Uploads sind aktiv. Neue Dateien werden dauerhaft in Vercel Blob gespeichert und danach auf der Website angezeigt.'
          : 'Bild-Uploads sind noch nicht aktiv. Lege in Vercel zuerst einen Public Blob Store an, damit BLOB_READ_WRITE_TOKEN gesetzt wird.'}
      </div>

      <div className="grid gap-8">
        <CampForm
          camp={createBlankCamp()}
          heading="Neues Camp anlegen"
          description="Wenn der Slug neu ist, wird ein neues Camp erzeugt. Wenn der Slug schon existiert, wird der vorhandene Datensatz überschrieben."
          actionLabel="Camp speichern"
          blobUploadsEnabled={blobUploadsEnabled}
          canDelete={false}
        />

        {camps.map((camp) => (
          <CampForm
            key={camp.slug}
            camp={camp}
            heading={camp.title}
            description={
              camp.managedInDb
                ? 'Dieses Camp wird bereits aus der Datenbank verwaltet.'
                : 'Dieses Camp kommt aktuell noch aus den Seed-Daten. Beim Speichern wird es ab dann aus der Datenbank verwaltet.'
            }
            actionLabel="Änderungen speichern"
            blobUploadsEnabled={blobUploadsEnabled}
            canDelete={camp.managedInDb && !getSeedCampBySlug(camp.slug)}
          />
        ))}
      </div>
    </section>
  );
}
