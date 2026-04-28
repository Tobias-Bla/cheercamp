'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Camp, CampGalleryImage, PrivateOption } from '@/data/camps';
import { deleteCampFromFile, readCampsFromFile, updateCampInFile } from '@/lib/camp-store';

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

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? '').trim();
}

function numberValue(formData: FormData, name: string): number {
  const parsed = Number(text(formData, name).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function lines(formData: FormData, name: string): string[] {
  return text(formData, name)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function csv(formData: FormData, name: string): string[] {
  return text(formData, name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getGallery(formData: FormData): CampGalleryImage[] {
  const count = numberValue(formData, 'galleryCount');
  const gallery: CampGalleryImage[] = [];

  for (let index = 0; index < count; index += 1) {
    const src = text(formData, `gallery.${index}.src`);
    const alt = text(formData, `gallery.${index}.alt`);

    if (src && alt) {
      gallery.push({ src, alt });
    }
  }

  return gallery;
}

function getSchedule(formData: FormData): Camp['schedule'] {
  const count = numberValue(formData, 'scheduleCount');
  const schedule: Camp['schedule'] = [];

  for (let index = 0; index < count; index += 1) {
    const day = text(formData, `schedule.${index}.day`);
    const title = text(formData, `schedule.${index}.title`);
    const details = lines(formData, `schedule.${index}.details`);

    if (day && title) {
      schedule.push({ day, title, details });
    }
  }

  return schedule;
}

function selectedPrivateOptions(formData: FormData): Camp['privateOptions'] {
  const selected = new Set(formData.getAll('privateOptions').map(String));

  return allPrivateOptions
    .filter((value) => selected.has(value))
    .map((value) => ({ value, label: privateOptionLabels[value] }));
}

export async function updateCampAction(formData: FormData): Promise<void> {
  const slug = text(formData, 'slug');
  const camps = await readCampsFromFile();
  const existingCamp = camps.find((camp) => camp.slug === slug);

  if (!existingCamp) {
    throw new Error(`Camp not found: ${slug}`);
  }

  const priceEuros = numberValue(formData, 'priceEuros');
  const updatedCamp: Camp = {
    ...existingCamp,
    title: text(formData, 'title'),
    subtitle: text(formData, 'subtitle'),
    location: text(formData, 'location'),
    venue: text(formData, 'venue'),
    startDate: text(formData, 'startDate'),
    endDate: text(formData, 'endDate'),
    priceCents: Math.round(priceEuros * 100),
    capacity: numberValue(formData, 'capacity'),
    capacityText: text(formData, 'capacityText'),
    ages: text(formData, 'ages'),
    level: text(formData, 'level'),
    coaches: csv(formData, 'coaches'),
    coachModeLabel: text(formData, 'coachModeLabel'),
    formatOptions: csv(formData, 'formatOptions'),
    generalCampTime: text(formData, 'generalCampTime'),
    overnightIncluded: formData.get('overnightIncluded') === 'on',
    privateAvailable: formData.get('privateAvailable') === 'on',
    privatePaymentNote: text(formData, 'privatePaymentNote'),
    coverImage: text(formData, 'coverImage'),
    coverImageAlt: text(formData, 'coverImageAlt'),
    bookingImage: text(formData, 'bookingImage'),
    bookingImageAlt: text(formData, 'bookingImageAlt'),
    gallery: getGallery(formData),
    privateOptions: selectedPrivateOptions(formData),
    focus: lines(formData, 'focus'),
    highlights: lines(formData, 'highlights'),
    schedule: getSchedule(formData),
    featured: formData.get('featured') === 'on',
  };

  await updateCampInFile(updatedCamp);
  revalidatePath('/');
  revalidatePath('/camps');
  revalidatePath(`/camps/${slug}`);
  revalidatePath(`/book/${slug}`);
  revalidatePath('/admin/camps');
  revalidatePath(`/admin/camps/${slug}/edit`);
  redirect(`/admin/camps/${slug}/edit?saved=1`);
}

export async function deleteCampAction(formData: FormData): Promise<void> {
  const slug = text(formData, 'slug');

  if (formData.get('confirmDelete') !== 'on') {
    redirect(`/admin/camps/${slug}/edit?deleteError=confirm`);
  }

  await deleteCampFromFile(slug);
  revalidatePath('/');
  revalidatePath('/camps');
  revalidatePath(`/camps/${slug}`);
  revalidatePath(`/book/${slug}`);
  revalidatePath('/admin/camps');
  redirect('/admin/camps?deleted=1');
}
