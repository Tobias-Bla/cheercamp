import { Prisma } from '@/generated/prisma';
import { camps as defaultCamps, type Camp, type CampGalleryImage, type PrivateOption } from '@/data/camps';
import { getPrismaClient } from '@/lib/prisma';

type ManagedCampRow = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  venue: string;
  start_date: Date | null;
  end_date: Date | null;
  date_label: string | null;
  price_cents: number;
  capacity: number;
  capacity_text: string;
  ages: string;
  level: string;
  coaches: Prisma.JsonValue;
  coach_mode_label: string;
  format_options: Prisma.JsonValue;
  general_camp_time: string;
  overnight_included: boolean;
  private_available: boolean;
  private_payment_note: string;
  cover_image: string;
  cover_image_alt: string;
  booking_image: string;
  booking_image_alt: string;
  gallery: Prisma.JsonValue;
  private_options: Prisma.JsonValue;
  focus: Prisma.JsonValue;
  highlights: Prisma.JsonValue;
  schedule: Prisma.JsonValue;
  featured: boolean;
  booking_open: boolean;
};

export type AdminCamp = Camp & {
  managedInDb: boolean;
};

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isGalleryArray(value: unknown): value is CampGalleryImage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'src' in item &&
        'alt' in item &&
        isString(item.src) &&
        isString(item.alt),
    )
  );
}

function isPrivateOptionsArray(value: unknown): value is Camp['privateOptions'] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'label' in item &&
        'value' in item &&
        isString(item.label) &&
        isString(item.value),
    )
  );
}

function isScheduleArray(value: unknown): value is Camp['schedule'] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'day' in item &&
        'title' in item &&
        'details' in item &&
        isString(item.day) &&
        isString(item.title) &&
        isStringArray(item.details),
    )
  );
}

function jsonToStringArray(value: Prisma.JsonValue, fallback: string[]): string[] {
  return isStringArray(value) ? value : fallback;
}

function jsonToGallery(value: Prisma.JsonValue, fallback: CampGalleryImage[]): CampGalleryImage[] {
  return isGalleryArray(value) ? value : fallback;
}

function jsonToPrivateOptions(value: Prisma.JsonValue, fallback: Camp['privateOptions']): Camp['privateOptions'] {
  return isPrivateOptionsArray(value) ? value : fallback;
}

function jsonToSchedule(value: Prisma.JsonValue, fallback: Camp['schedule']): Camp['schedule'] {
  return isScheduleArray(value) ? value : fallback;
}

function mapManagedCampRow(row: ManagedCampRow, fallback?: Camp): Camp {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    location: row.location,
    venue: row.venue,
    startDate: row.start_date ? row.start_date.toISOString().slice(0, 10) : null,
    endDate: row.end_date ? row.end_date.toISOString().slice(0, 10) : null,
    dateLabel: row.date_label ?? fallback?.dateLabel,
    priceCents: row.price_cents,
    capacity: row.capacity,
    capacityText: row.capacity_text,
    ages: row.ages,
    level: row.level,
    coaches: jsonToStringArray(row.coaches, fallback?.coaches ?? []),
    coachModeLabel: row.coach_mode_label,
    formatOptions: jsonToStringArray(row.format_options, fallback?.formatOptions ?? []),
    generalCampTime: row.general_camp_time,
    overnightIncluded: row.overnight_included,
    privateAvailable: row.private_available,
    privatePaymentNote: row.private_payment_note,
    coverImage: row.cover_image,
    coverImageAlt: row.cover_image_alt,
    bookingImage: row.booking_image,
    bookingImageAlt: row.booking_image_alt,
    gallery: jsonToGallery(row.gallery, fallback?.gallery ?? []),
    privateOptions: jsonToPrivateOptions(row.private_options, fallback?.privateOptions ?? []),
    focus: jsonToStringArray(row.focus, fallback?.focus ?? []),
    highlights: jsonToStringArray(row.highlights, fallback?.highlights ?? []),
    schedule: jsonToSchedule(row.schedule, fallback?.schedule ?? []),
    featured: row.featured,
    bookingOpen: row.booking_open,
  };
}

async function getManagedCampRows(): Promise<ManagedCampRow[]> {
  const prisma = getPrismaClient();

  return prisma.$queryRaw<ManagedCampRow[]>(Prisma.sql`
    SELECT
      "slug",
      "title",
      "subtitle",
      "location",
      "venue",
      "start_date",
      "end_date",
      "date_label",
      "price_cents",
      "capacity",
      "capacity_text",
      "ages",
      "level",
      "coaches",
      "coach_mode_label",
      "format_options",
      "general_camp_time",
      "overnight_included",
      "private_available",
      "private_payment_note",
      "cover_image",
      "cover_image_alt",
      "booking_image",
      "booking_image_alt",
      "gallery",
      "private_options",
      "focus",
      "highlights",
      "schedule",
      "featured",
      "booking_open"
    FROM "public"."managed_camps"
    ORDER BY "featured" DESC, "start_date" ASC NULLS LAST, "created_at" DESC
  `);
}

export async function getAllCamps(): Promise<Camp[]> {
  const mergedCamps = new Map(defaultCamps.map((camp) => [camp.slug, camp] as const));

  try {
    const managedCamps = await getManagedCampRows();

    for (const row of managedCamps) {
      mergedCamps.set(row.slug, mapManagedCampRow(row, mergedCamps.get(row.slug)));
    }
  } catch {
    return defaultCamps;
  }

  return Array.from(mergedCamps.values()).sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    if (left.startDate && right.startDate) {
      return left.startDate.localeCompare(right.startDate);
    }

    if (left.startDate) {
      return -1;
    }

    if (right.startDate) {
      return 1;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getFeaturedCamps(): Promise<Camp[]> {
  const camps = await getAllCamps();
  return camps.filter((camp) => camp.featured);
}

export async function getCampBySlug(slug: string): Promise<Camp | undefined> {
  const camps = await getAllCamps();
  return camps.find((camp) => camp.slug === slug);
}

export async function getAdminCamps(): Promise<AdminCamp[]> {
  const defaultCampMap = new Map(defaultCamps.map((camp) => [camp.slug, camp] as const));
  const managedSlugs = new Set<string>();
  const mergedCamps = new Map<string, AdminCamp>(
    defaultCamps.map((camp) => [
      camp.slug,
      {
        ...camp,
        managedInDb: false,
      },
    ] as const),
  );

  try {
    const managedRows = await getManagedCampRows();

    for (const row of managedRows) {
      managedSlugs.add(row.slug);
      mergedCamps.set(row.slug, {
        ...mapManagedCampRow(row, defaultCampMap.get(row.slug)),
        managedInDb: true,
      });
    }
  } catch {
    return Array.from(mergedCamps.values());
  }

  return Array.from(mergedCamps.values()).map((camp) => ({
    ...camp,
    managedInDb: managedSlugs.has(camp.slug),
  }));
}

export type ManagedCampInput = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  venue: string;
  startDate: string | null;
  endDate: string | null;
  dateLabel: string | null;
  priceCents: number;
  capacity: number;
  capacityText: string;
  ages: string;
  level: string;
  coaches: string[];
  coachModeLabel: string;
  formatOptions: string[];
  generalCampTime: string;
  overnightIncluded: boolean;
  privateAvailable: boolean;
  privatePaymentNote: string;
  coverImage: string;
  coverImageAlt: string;
  bookingImage: string;
  bookingImageAlt: string;
  gallery: CampGalleryImage[];
  privateOptions: Array<{ label: string; value: PrivateOption }>;
  focus: string[];
  highlights: string[];
  schedule: Camp['schedule'];
  featured: boolean;
  bookingOpen: boolean;
};

export async function upsertManagedCamp(input: ManagedCampInput): Promise<void> {
  const prisma = getPrismaClient();

  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "public"."managed_camps" (
      "id",
      "slug",
      "title",
      "subtitle",
      "location",
      "venue",
      "start_date",
      "end_date",
      "date_label",
      "price_cents",
      "capacity",
      "capacity_text",
      "ages",
      "level",
      "coaches",
      "coach_mode_label",
      "format_options",
      "general_camp_time",
      "overnight_included",
      "private_available",
      "private_payment_note",
      "cover_image",
      "cover_image_alt",
      "booking_image",
      "booking_image_alt",
      "gallery",
      "private_options",
      "focus",
      "highlights",
      "schedule",
      "featured",
      "booking_open",
      "updated_at"
    )
    VALUES (
      ${crypto.randomUUID()},
      ${input.slug},
      ${input.title},
      ${input.subtitle},
      ${input.location},
      ${input.venue},
      ${input.startDate ? new Date(input.startDate) : null},
      ${input.endDate ? new Date(input.endDate) : null},
      ${input.dateLabel},
      ${input.priceCents},
      ${input.capacity},
      ${input.capacityText},
      ${input.ages},
      ${input.level},
      ${JSON.stringify(input.coaches)}::jsonb,
      ${input.coachModeLabel},
      ${JSON.stringify(input.formatOptions)}::jsonb,
      ${input.generalCampTime},
      ${input.overnightIncluded},
      ${input.privateAvailable},
      ${input.privatePaymentNote},
      ${input.coverImage},
      ${input.coverImageAlt},
      ${input.bookingImage},
      ${input.bookingImageAlt},
      ${JSON.stringify(input.gallery)}::jsonb,
      ${JSON.stringify(input.privateOptions)}::jsonb,
      ${JSON.stringify(input.focus)}::jsonb,
      ${JSON.stringify(input.highlights)}::jsonb,
      ${JSON.stringify(input.schedule)}::jsonb,
      ${input.featured},
      ${input.bookingOpen},
      NOW()
    )
    ON CONFLICT ("slug") DO UPDATE SET
      "title" = EXCLUDED."title",
      "subtitle" = EXCLUDED."subtitle",
      "location" = EXCLUDED."location",
      "venue" = EXCLUDED."venue",
      "start_date" = EXCLUDED."start_date",
      "end_date" = EXCLUDED."end_date",
      "date_label" = EXCLUDED."date_label",
      "price_cents" = EXCLUDED."price_cents",
      "capacity" = EXCLUDED."capacity",
      "capacity_text" = EXCLUDED."capacity_text",
      "ages" = EXCLUDED."ages",
      "level" = EXCLUDED."level",
      "coaches" = EXCLUDED."coaches",
      "coach_mode_label" = EXCLUDED."coach_mode_label",
      "format_options" = EXCLUDED."format_options",
      "general_camp_time" = EXCLUDED."general_camp_time",
      "overnight_included" = EXCLUDED."overnight_included",
      "private_available" = EXCLUDED."private_available",
      "private_payment_note" = EXCLUDED."private_payment_note",
      "cover_image" = EXCLUDED."cover_image",
      "cover_image_alt" = EXCLUDED."cover_image_alt",
      "booking_image" = EXCLUDED."booking_image",
      "booking_image_alt" = EXCLUDED."booking_image_alt",
      "gallery" = EXCLUDED."gallery",
      "private_options" = EXCLUDED."private_options",
      "focus" = EXCLUDED."focus",
      "highlights" = EXCLUDED."highlights",
      "schedule" = EXCLUDED."schedule",
      "featured" = EXCLUDED."featured",
      "booking_open" = EXCLUDED."booking_open",
      "updated_at" = NOW()
  `);
}
