import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import type { PrivateOption } from '@/data/camps';
import { deleteCampAction, updateCampAction } from '../../actions';
import { readCampsFromFile } from '@/lib/camp-store';

export const dynamic = 'force-dynamic';

const privateOptionLabels: Record<PrivateOption, string> = {
  NONE: 'Kein Private-Interesse',
  PAIR_60: 'Pair Private · 60 Minuten',
  PAIR_90: 'Pair Private · 90 Minuten',
  GROUP_60: 'Groupstunt Private · 60 Minuten',
  GROUP_90: 'Groupstunt Private · 90 Minuten',
  INDIVIDUAL_60: 'Einzelperson Session · 60 Minuten',
  INDIVIDUAL_90: 'Einzelperson Session · 90 Minuten',
};

const allPrivateOptions = Object.keys(privateOptionLabels) as PrivateOption[];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint ? <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 lg:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default async function EditCampPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ saved?: string; deleteError?: string }>;
}) {
  const emptyQuery: { saved?: string; deleteError?: string } = {};
  const [{ slug }, query] = await Promise.all([params, searchParams ?? Promise.resolve(emptyQuery)]);
  const camps = await readCampsFromFile();
  const camp = camps.find((item) => item.slug === slug);

  if (!camp) {
    notFound();
  }

  const selectedPrivateOptions = new Set(camp.privateOptions.map((option) => option.value));
  const galleryRows = [...camp.gallery, { src: '', alt: '' }];
  const scheduleRows = [...camp.schedule, { day: '', title: '', details: [] }];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-300">Admin</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Camp bearbeiten</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{camp.title}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/camps"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/70"
          >
            Zur Camp-Übersicht
          </Link>
          <Link
            href={`/camps/${camp.slug}`}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/70"
          >
            Öffentliche Seite
          </Link>
        </div>
      </div>

      {query.saved ? (
        <div className="mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-5 py-4 text-sm text-emerald-100">
          Änderungen gespeichert.
        </div>
      ) : null}

      {query.deleteError ? (
        <div className="mb-6 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
          Bitte bestätige das Löschen zuerst.
        </div>
      ) : null}

      <form action={updateCampAction} className="grid gap-6">
        <input type="hidden" name="slug" value={camp.slug} />

        <FormSection title="Basis" description="Titel, Kurztext und die wichtigsten organisatorischen Eckdaten.">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Titel">
              <input className="field" name="title" defaultValue={camp.title} required />
            </Field>
            <Field label="Slug" hint="Der Slug bleibt stabil, damit bestehende Links und Buchungen nicht brechen.">
              <input className="field opacity-70" value={camp.slug} readOnly />
            </Field>
            <div className="lg:col-span-2">
              <Field label="Untertitel">
                <textarea className="field min-h-28" name="subtitle" defaultValue={camp.subtitle} required />
              </Field>
            </div>
            <Field label="Ort">
              <input className="field" name="location" defaultValue={camp.location} required />
            </Field>
            <Field label="Venue">
              <input className="field" name="venue" defaultValue={camp.venue} required />
            </Field>
            <Field label="Altersgruppe">
              <input className="field" name="ages" defaultValue={camp.ages} required />
            </Field>
            <Field label="Level">
              <input className="field" name="level" defaultValue={camp.level} required />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Termin und Buchung" description="Alles, was auf Buchungsseite und Camp-Karten direkt sichtbar ist.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Startdatum">
              <input className="field" name="startDate" type="date" defaultValue={camp.startDate} required />
            </Field>
            <Field label="Enddatum">
              <input className="field" name="endDate" type="date" defaultValue={camp.endDate} required />
            </Field>
            <Field label="Preis in Euro">
              <input className="field" name="priceEuros" type="number" min="0" step="0.01" defaultValue={camp.priceCents / 100} required />
            </Field>
            <Field label="Kapazität">
              <input className="field" name="capacity" type="number" min="0" defaultValue={camp.capacity} required />
            </Field>
            <Field label="Kapazitätstext">
              <input className="field" name="capacityText" defaultValue={camp.capacityText} required />
            </Field>
            <Field label="General Camp Zeit">
              <input className="field" name="generalCampTime" defaultValue={camp.generalCampTime} required />
            </Field>
            <Field label="Coach Label">
              <input className="field" name="coachModeLabel" defaultValue={camp.coachModeLabel} required />
            </Field>
            <Field label="Coaches">
              <input className="field" name="coaches" defaultValue={camp.coaches.join(', ')} required />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200">
              <input name="featured" type="checkbox" defaultChecked={camp.featured} className="h-4 w-4 accent-fuchsia-400" />
              Auf Startseite zeigen
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200">
              <input name="overnightIncluded" type="checkbox" defaultChecked={camp.overnightIncluded} className="h-4 w-4 accent-fuchsia-400" />
              Übernachtung inklusive
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200">
              <input name="privateAvailable" type="checkbox" defaultChecked={camp.privateAvailable} className="h-4 w-4 accent-fuchsia-400" />
              Privates möglich
            </label>
          </div>
        </FormSection>

        <FormSection title="Inhalte" description="Listen werden zeilenweise gepflegt, damit sie beim Scannen klar getrennt bleiben.">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Formate" hint="Kommagetrennt, zum Beispiel: Partnerstunt, Groupstunt">
              <input className="field" name="formatOptions" defaultValue={camp.formatOptions.join(', ')} required />
            </Field>
            <Field label="Fokus">
              <textarea className="field min-h-36" name="focus" defaultValue={camp.focus.join('\n')} required />
            </Field>
            <Field label="Highlights">
              <textarea className="field min-h-40" name="highlights" defaultValue={camp.highlights.join('\n')} required />
            </Field>
            <Field label="Private Hinweis">
              <textarea className="field min-h-40" name="privatePaymentNote" defaultValue={camp.privatePaymentNote} required />
            </Field>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Private-Optionen</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {allPrivateOptions.map((value) => (
                <label key={value} className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200">
                  <input
                    name="privateOptions"
                    type="checkbox"
                    value={value}
                    defaultChecked={selectedPrivateOptions.has(value)}
                    className="h-4 w-4 accent-fuchsia-400"
                  />
                  {privateOptionLabels[value]}
                </label>
              ))}
            </div>
          </div>
        </FormSection>

        <FormSection title="Bilder" description="Cover, Buchungsbild und Galerie mit ihren beschreibenden Texten.">
          <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image src={camp.coverImage} alt={camp.coverImageAlt} fill className="object-cover" sizes="18rem" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Cover Bild">
                <input className="field" name="coverImage" defaultValue={camp.coverImage} required />
              </Field>
              <Field label="Cover Alt-Text">
                <input className="field" name="coverImageAlt" defaultValue={camp.coverImageAlt} required />
              </Field>
              <Field label="Buchungsbild">
                <input className="field" name="bookingImage" defaultValue={camp.bookingImage} required />
              </Field>
              <Field label="Buchungsbild Alt-Text">
                <input className="field" name="bookingImageAlt" defaultValue={camp.bookingImageAlt} required />
              </Field>
            </div>
          </div>

          <input type="hidden" name="galleryCount" value={galleryRows.length} />
          <div className="mt-6 divide-y divide-white/10">
            {galleryRows.map((image, index) => (
              <div key={`${image.src}-${index}`} className="grid gap-4 py-4 lg:grid-cols-[10rem_1fr_1fr]">
                <p className="text-sm font-semibold text-slate-300">Galerie {index + 1}</p>
                <Field label="Bildpfad">
                  <input className="field" name={`gallery.${index}.src`} defaultValue={image.src} />
                </Field>
                <Field label="Alt-Text">
                  <input className="field" name={`gallery.${index}.alt`} defaultValue={image.alt} />
                </Field>
              </div>
            ))}
          </div>
        </FormSection>

        <FormSection title="Ablauf" description="Jeder Block steht für einen Tag oder einen klaren Programmabschnitt.">
          <input type="hidden" name="scheduleCount" value={scheduleRows.length} />
          <div className="divide-y divide-white/10">
            {scheduleRows.map((item, index) => (
              <div key={`${item.day}-${index}`} className="grid gap-4 py-5 lg:grid-cols-[10rem_1fr_1fr]">
                <p className="text-sm font-semibold text-slate-300">Block {index + 1}</p>
                <div className="grid gap-4">
                  <Field label="Tag">
                    <input className="field" name={`schedule.${index}.day`} defaultValue={item.day} />
                  </Field>
                  <Field label="Titel">
                    <input className="field" name={`schedule.${index}.title`} defaultValue={item.title} />
                  </Field>
                </div>
                <Field label="Details">
                  <textarea className="field min-h-36" name={`schedule.${index}.details`} defaultValue={item.details.join('\n')} />
                </Field>
              </div>
            ))}
          </div>
        </FormSection>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-2xl shadow-slate-950/40 transition hover:bg-cyan-100"
          >
            Änderungen speichern
          </button>
        </div>
      </form>

      <form action={deleteCampAction} className="mt-8 rounded-[1.5rem] border border-rose-400/25 bg-rose-400/10 p-5 lg:p-6">
        <input type="hidden" name="slug" value={camp.slug} />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-rose-100">Camp löschen</h2>
            <p className="mt-2 text-sm leading-6 text-rose-100/80">
              Entfernt dieses Camp aus Übersicht, Detailseite und Buchungsstrecke.
            </p>
            <label className="mt-4 flex items-center gap-3 text-sm text-rose-50">
              <input name="confirmDelete" type="checkbox" className="h-4 w-4 accent-rose-400" />
              Löschen bestätigen
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-rose-300 px-6 py-3 text-sm font-semibold text-rose-950 transition hover:bg-rose-200"
          >
            Camp löschen
          </button>
        </div>
      </form>
    </section>
  );
}
