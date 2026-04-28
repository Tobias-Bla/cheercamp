import { put } from '@vercel/blob';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;
const MAX_SERVER_UPLOAD_BYTES = 4 * 1024 * 1024;
const DEFAULT_CACHE_MAX_AGE = 60 * 60 * 24 * 30;

export const CAMP_IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(',');

type CampImageKind = 'cover' | 'booking' | 'gallery';

function sanitizeSegment(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFileExtension(file: File): string {
  const explicitExtension = file.name.split('.').pop()?.toLowerCase();

  if (explicitExtension && explicitExtension !== file.name.toLowerCase()) {
    return explicitExtension;
  }

  switch (file.type) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    default:
      return 'bin';
  }
}

function assertUploadConfigured(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Missing environment variable: BLOB_READ_WRITE_TOKEN');
  }
}

function assertValidImageFile(file: File): void {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    throw new Error('Only JPG, PNG, WebP, and AVIF images are supported.');
  }

  if (file.size > MAX_SERVER_UPLOAD_BYTES) {
    throw new Error('Uploaded image is too large. Please keep files below 4 MB.');
  }
}

export function isBlobUploadEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadCampImage({
  file,
  campSlug,
  kind,
}: {
  file: File;
  campSlug: string;
  kind: CampImageKind;
}): Promise<string> {
  assertUploadConfigured();
  assertValidImageFile(file);

  const safeSlug = sanitizeSegment(campSlug) || 'camp';
  const safeName = sanitizeSegment(file.name.replace(/\.[^.]+$/, '')) || kind;
  const extension = getFileExtension(file);

  const blob = await put(`camps/${safeSlug}/${kind}/${safeName}.${extension}`, file, {
    access: 'public',
    addRandomSuffix: true,
    contentType: file.type,
    cacheControlMaxAge: DEFAULT_CACHE_MAX_AGE,
  });

  return blob.url;
}
