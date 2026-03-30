export type StuntFormat = 'PARTNER_STUNT' | 'GROUP_STUNT';
export type PrivateOption =
  | 'NONE'
  | 'PAIR_60'
  | 'PAIR_90'
  | 'GROUP_60'
  | 'GROUP_90'
  | 'INDIVIDUAL_60'
  | 'INDIVIDUAL_90';

export type Camp = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
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
};

export const camps: Camp[] = [
  {
    slug: 'spring-stunt-camp-2026',
    title: 'Spring Stunt Camp 2026',
    subtitle:
      'Das nächste Cheercamp in St. Blasien mit Partnerstunt-Fokus, Groupstunts willkommen und Special Price.',
    location: 'St. Blasien',
    venue: 'Albtalhalle, St. Blasien',
    startDate: '2026-05-16',
    endDate: '2026-05-17',
    priceCents: 4000,
    capacity: 35,
    capacityText: '35 Plätze',
    ages: 'Jugendliche & Erwachsene',
    level: 'Open Level – mit Fokus auf sichere Basics bis Advanced Input',
    coaches: ['Kai', 'Camp-Team'],
    coachModeLabel: 'Ohne externen Coach',
    formatOptions: ['Partnerstunt', 'Groupstunt'],
    generalCampTime: 'Samstag, 12:00–18:00 Uhr',
    overnightIncluded: true,
    privateAvailable: true,
    privatePaymentNote:
      'Privates am Sonntag werden separat angefragt und direkt in bar an den Coach gezahlt.',
    privateOptions: [
      { label: 'Kein Private-Interesse', value: 'NONE' },
      { label: 'Pair Private · 60 Minuten', value: 'PAIR_60' },
      { label: 'Pair Private · 90 Minuten', value: 'PAIR_90' },
      { label: 'Groupstunt Private · 60 Minuten', value: 'GROUP_60' },
      { label: 'Groupstunt Private · 90 Minuten', value: 'GROUP_90' },
      { label: 'Einzelperson Session · 60 Minuten', value: 'INDIVIDUAL_60' },
      { label: 'Einzelperson Session · 90 Minuten', value: 'INDIVIDUAL_90' },
    ],
    focus: ['Partnerstunt', 'Groupstunt', 'Technique Fixes', 'Safe Progressions'],
    highlights: [
      'Spezialpreis von 40 € pro Person',
      'Übernachtung in der Halle inklusive',
      'Coachings durch Kai und das Camp-Team',
      'Privates am Sonntag zusätzlich möglich',
    ],
    schedule: [
      {
        day: 'Samstag',
        title: 'General Camp · 12:00–18:00 Uhr',
        details: [
          'Allgemeines Camp mit Fokus auf Partnerstunt; Groupstunts sind ausdrücklich willkommen.',
          'Teilnehmer können vorab Wünsche für bestimmte Stunts oder Themen angeben.',
          'Das Camp richtet sich nach den häufigsten Wünschen und dem, was vor Ort am meisten Sinn ergibt.',
        ],
      },
      {
        day: 'Sonntag',
        title: 'Privates nach Absprache',
        details: [
          'Pairs oder Groupstunts können exklusive 60- oder 90-Minuten-Slots anfragen.',
          'Je nach Coach-Setup sind auch Einzel-Sessions mit direktem Stunten mit dem Coach möglich.',
          'Privates sind nicht im Online-Preis enthalten und werden bar direkt an den Coach gezahlt.',
        ],
      },
    ],
    featured: true,
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
    coaches: ['Externer Guest Coach', 'Kai', 'Camp-Team'],
    coachModeLabel: 'Mit externem Coach',
    formatOptions: ['Partnerstunt', 'Groupstunt'],
    generalCampTime: 'Samstag, 12:00–18:00 Uhr',
    overnightIncluded: true,
    privateAvailable: true,
    privatePaymentNote:
      'Privates am Sonntag sind optional, werden separat koordiniert und direkt bar an den Coach gezahlt.',
    privateOptions: [
      { label: 'Kein Private-Interesse', value: 'NONE' },
      { label: 'Pair Private · 60 Minuten', value: 'PAIR_60' },
      { label: 'Pair Private · 90 Minuten', value: 'PAIR_90' },
      { label: 'Groupstunt Private · 60 Minuten', value: 'GROUP_60' },
      { label: 'Groupstunt Private · 90 Minuten', value: 'GROUP_90' },
      { label: 'Einzelperson Session · 60 Minuten', value: 'INDIVIDUAL_60' },
      { label: 'Einzelperson Session · 90 Minuten', value: 'INDIVIDUAL_90' },
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
        day: 'Samstag',
        title: 'General Camp · 12:00–18:00 Uhr',
        details: [
          'Der externe Coach coacht das allgemeine Camp und setzt je nach Stil einen genauen Zeitplan oder ein freieres Format um.',
          'Teilnehmerwünsche für Stunts oder Technikthemen werden gesammelt und priorisiert.',
          'Die beliebtesten Themen werden gemeinsam mit dem Coach aufgegriffen.',
        ],
      },
      {
        day: 'Sonntag',
        title: 'Privates nach Absprache',
        details: [
          'Exklusive Private-Slots für Pairs oder Groupstunts sind möglich.',
          'Je nach Coach können auch Einzel-Sessions angeboten werden.',
          'Bezahlung der Privates erfolgt separat und bar direkt an den Coach.',
        ],
      },
    ],
    featured: true,
  },
];
