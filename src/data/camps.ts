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
  dateLabel?: string;
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

export const camps: Camp[] = [
  {
    slug: 'spring-stunt-camp-2026',
    title: 'R.I.S.E. Camp - Special Edition',
    subtitle:
      'Das nächste Cheercamp in St. Blasien mit Kai und Vio zum Specialpreis - Partnerstunt im Fokus, Groupstunts willkommen.',
    location: 'St. Blasien',
    venue: 'Albtalhalle, St. Blasien',
    startDate: null,
    endDate: null,
    dateLabel: 'Termin folgt',
    priceCents: 4000,
    capacity: 35,
    capacityText: '35 Plätze',
    ages: 'Jugendliche & Erwachsene',
    level: 'Open Level – mit Fokus auf sichere Basics bis Advanced Input',
    coaches: ['Kai', 'Vio'],
    coachModeLabel: 'Ohne externen Coach',
    formatOptions: ['Partnerstunt', 'Groupstunt'],
    generalCampTime: 'Freitag optionale Anreise ab 15:00 Uhr, Samstag 12:00-18:00 Uhr',
    overnightIncluded: true,
    privateAvailable: true,
    privatePaymentNote:
      'Privates am Sonntag werden separat angefragt und direkt in bar an den Coach gezahlt.',
    coverImage: '/images/team-lineup.webp',
    coverImageAlt: 'Mehrere Partnerstunts stehen in einer Reihe auf der Matte beim Rise Camp.',
    bookingImage: '/images/stunt-line.webp',
    bookingImageAlt: 'Mehrere Stuntgruppen stehen gleichzeitig auf der Matte.',
    gallery: [
      {
        src: '/images/team-lineup.webp',
        alt: 'Mehrere Partnerstunts stehen in einer Reihe auf der Matte beim Rise Camp.',
      },
      {
        src: '/images/community-dinner.webp',
        alt: 'Die Teilnehmenden sitzen nach dem Training gemeinsam an einer langen Tafel.',
      },
      {
        src: '/images/coach-kai-action.webp',
        alt: 'Coach Kai gibt beim Training direktes Technik-Feedback an einer Stuntgruppe.',
      },
    ],
    privateOptions: [
      { label: 'Kein Private-Interesse', value: 'NONE' },
      { label: '1 on 1 · 60 Minuten mit Kai · 40 EUR', value: 'INDIVIDUAL_60' },
      { label: '1 on 1 · 60 Minuten mit Vio · 40 EUR', value: 'PAIR_60' },
      { label: '2 on 1 · 60 Minuten mit Kai und Vio · 60 EUR', value: 'GROUP_60' },
      { label: '2 on 1 · 90 Minuten mit Kai und Vio · 80 EUR', value: 'GROUP_90' },
      { label: 'Pairs in Partnerstunts · nach Absprache', value: 'PAIR_90' },
      { label: 'Groupstunt · nach Absprache', value: 'INDIVIDUAL_90' },
    ],
    focus: ['Partnerstunt', 'Groupstunt', 'Technique Fixes', 'Safe Progressions'],
    highlights: [
      'Spezialpreis von 40 € pro Person',
      'Übernachtung in der Halle inklusive',
      'Coachings durch Kai und Vio',
      'Privates am Sonntag zusätzlich möglich',
    ],
    schedule: [
      {
        day: 'Freitag',
        title: 'Optionale Anreise ab 15:00 Uhr',
        details: [
          'Wer mag, kann bereits am Freitag in Ruhe anreisen und sich vor Ort einrichten.',
          'Die Übernachtung in der Halle ist inklusive.',
        ],
      },
      {
        day: 'Samstag',
        title: 'General Camp · 12:00–18:00 Uhr',
        details: [
          'Allgemeines Camp mit Fokus auf Partnerstunt; Groupstunts sind ausdrücklich willkommen.',
          'Teilnehmer können vorab Wünsche für bestimmte Stunts oder Themen angeben.',
          'Das Camp richtet sich nach den häufigsten Wünschen und dem, was vor Ort am meisten Sinn ergibt.',
          'Verpflegung ist nicht im Preis enthalten.',
        ],
      },
      {
        day: 'Sonntag',
        title: 'Privates nach Absprache',
        details: [
          'Pairs in Partnerstunts oder Groupstunts können exklusive 60- oder 90-Minuten-Slots anfragen.',
          'Es sind Einzel-Sessions mit direktem Stunten mit dem Coach möglich.',
          'Privates sind nicht im Online-Preis enthalten und werden bar direkt an den Coach gezahlt.',
        ],
      },
    ],
    featured: true,
    bookingOpen: false,
  },
  {
    slug: 'autumn-stunt-camp-2026',
    title: 'Autumn Stunt Camp 2026',
    subtitle:
      'Das klassische Cheercamp mit externem Coach, 35 Plätzen und voller Weekend-Experience in der Albtalhalle.',
    location: 'St. Blasien',
    venue: 'Albtalhalle, St. Blasien',
    startDate: '2026-10-03',
    endDate: '2026-10-04',
    priceCents: 8000,
    capacity: 35,
    capacityText: '35 Plätze',
    ages: 'Jugendliche & Erwachsene',
    level: 'Open Level – für eingespielte Stuntgroups und motivierte Athlet*innen',
    coaches: ['Externer Guest Coach', 'Kai', 'Vio'],
    coachModeLabel: 'Mit externem Coach',
    formatOptions: ['Partnerstunt', 'Groupstunt'],
    generalCampTime: 'Samstag, 12:00–18:00 Uhr',
    overnightIncluded: true,
    privateAvailable: true,
    privatePaymentNote:
      'Privates am Sonntag sind optional, werden separat koordiniert und direkt bar an den Coach gezahlt.',
    coverImage: '/images/hero-group-photo.webp',
    coverImageAlt: 'Großes Gruppenfoto der Camp-Community in der Albtalhalle.',
    bookingImage: '/images/coach-kai-action.webp',
    bookingImageAlt: 'Coach Kai korrigiert bei einem Stunt die Körperlinie der Athletin.',
    gallery: [
      {
        src: '/images/hero-group-photo.webp',
        alt: 'Großes Gruppenfoto der Camp-Community in der Albtalhalle.',
      },
      {
        src: '/images/coach-kai-dog.webp',
        alt: 'Coach Kai sitzt entspannt mit einem kleinen Hund in der Halle.',
      },
      {
        src: '/images/stunt-line.webp',
        alt: 'Mehrere Stuntgruppen trainieren gleichzeitig und sauber nebeneinander.',
      },
    ],
    privateOptions: [
      { label: 'Kein Private-Interesse', value: 'NONE' },
      { label: '1 on 1 · 60 Minuten mit Kai · 40 EUR', value: 'INDIVIDUAL_60' },
      { label: '1 on 1 · 60 Minuten mit Vio · 40 EUR', value: 'PAIR_60' },
      { label: '2 on 1 · 60 Minuten mit Kai und Vio · 60 EUR', value: 'GROUP_60' },
      { label: '2 on 1 · 90 Minuten mit Kai und Vio · 80 EUR', value: 'GROUP_90' },
      { label: 'Pairs in Partnerstunts · nach Absprache', value: 'PAIR_90' },
      { label: 'Groupstunt · nach Absprache', value: 'INDIVIDUAL_90' },
    ],
    focus: ['Partnerstunt', 'Groupstunt', 'Wish-Based Coaching', 'Coach Feedback'],
    highlights: [
      '80 € pro Person',
      'Externer Coach als Hauptfokus des Samstag-Camps',
      'Übernachtung in der Halle inklusive',
      'Sonntags buchbare Privates',
    ],
    schedule: [
      {
        day: 'Freitag',
        title: 'Optionale Anreise ab 15:00 Uhr',
        details: [
          'Die optionale Anreise ist ab 15:00 Uhr möglich.',
          'Die Übernachtung in der Halle ist inklusive.',
        ],
      },
      {
        day: 'Samstag',
        title: 'General Camp · 12:00–18:00 Uhr',
        details: [
          'Der externe Coach coacht das allgemeine Camp und setzt je nach Stil einen genauen Zeitplan oder ein freieres Format um.',
          'Teilnehmerwünsche für Stunts oder Technikthemen werden gesammelt und priorisiert.',
          'Die beliebtesten Themen werden gemeinsam mit dem Coach aufgegriffen.',
          'Verpflegung ist nicht im Preis enthalten.',
        ],
      },
      {
        day: 'Sonntag',
        title: 'Privates nach Absprache',
        details: [
          'Pairs in Partnerstunts oder Groupstunts können exklusive Private-Slots anfragen.',
          'Es sind Einzel-Sessions mit direktem Stunten mit dem Coach möglich.',
          'Bezahlung der Privates erfolgt separat und bar direkt an den Coach.',
        ],
      },
    ],
    featured: true,
    bookingOpen: true,
  },
];
