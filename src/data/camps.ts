import campsData from './camps.json';

export type StuntFormat = 'PARTNER_STUNT' | 'GROUP_STUNT';
export type PrivateOption =
  | 'NONE'
  | 'PAIR_60'
  | 'PAIR_90'
  | 'GROUP_60'
  | 'GROUP_90'
  | 'INDIVIDUAL_60'
  | 'INDIVIDUAL_90';

export type CampGalleryImage = {
  src: string;
  alt: string;
};

export type Camp = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  venue: string;
  startDate: string | null;
  endDate: string | null;
  dateLabel?: string | null;
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
  privateOptions: Array<{
    label: string;
    value: PrivateOption;
  }>;
  focus: string[];
  highlights: string[];
  schedule: Array<{
    day: string;
    title: string;
    details: string[];
  }>;
  featured: boolean;
  bookingOpen: boolean;
};

export const camps = campsData as Camp[];
