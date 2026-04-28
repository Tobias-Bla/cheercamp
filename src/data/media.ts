export type MediaAsset = {
  src: string;
  alt: string;
};

export const brandMedia = {
  logoPrimary: {
    src: '/images/logo-rise-pink.webp',
    alt: 'Rise Stunt Camp Logo in Pink und Weiß',
  },
  logoSecondary: {
    src: '/images/logo-rise-blue.webp',
    alt: 'Rise Stunt Camp Logo in Blau und Pink',
  },
} satisfies Record<string, MediaAsset>;

export const homeMedia = {
  hero: {
    src: '/images/hero-group-photo.webp',
    alt: 'Gruppenfoto der Teilnehmenden beim Cheercamp in der Albtalhalle.',
  },
  atmosphere: [
    {
      src: '/images/team-lineup.webp',
      alt: 'Mehrere Partnerstunts stehen nebeneinander auf der Matte in der Albtalhalle.',
    },
    {
      src: '/images/community-dinner.webp',
      alt: 'Gemeinsames Abendessen der Camp-Teilnehmenden in der Halle.',
    },
    {
      src: '/images/coach-kai-dog.webp',
      alt: 'Coach Tony Castro sitzt entspannt mit einem kleinen Hund in der Halle.',
    },
  ],
} as const satisfies Record<string, MediaAsset | MediaAsset[]>;
