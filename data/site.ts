export const site = {
  name: 'Iki Hair Studio',
  tagline: 'A reason for being.',
  /** Human-readable, for display only. */
  phoneDisplay: '011-7226 7229',
  /**
   * International format, digits only, for wa.me links.
   * PROJECT.md §7.5 contains an 11-digit typo (60117226729); this is the
   * correct 12-digit form. Confirm against the salon's account before launch.
   */
  whatsappNumber: '601172267229',
  bookingUrl: 'https://booking.tunai.io/ikihairstudio',
  instagramUrl: 'https://www.instagram.com/ikihairstudio/',
  address: {
    line1: '1st Floor, Bandar Rimbayu',
    line2: 'Telok Panglima Garang',
    region: 'Kuala Langat, Selangor',
    country: 'Malaysia',
  },
  /** null means closed that day. */
  hours: [
    { day: 'Monday', open: '11:00', close: '19:00' },
    { day: 'Tuesday', open: null, close: null },
    { day: 'Wednesday', open: '11:00', close: '19:00' },
    { day: 'Thursday', open: '11:00', close: '19:00' },
    { day: 'Friday', open: '11:00', close: '19:00' },
    { day: 'Saturday', open: '11:00', close: '19:00' },
    { day: 'Sunday', open: '11:00', close: '19:00' },
  ] as const,
  team: [
    { name: 'Daniel T', role: 'Stylist', initials: 'DT' },
    { name: 'Mica Lai', role: 'Stylist', initials: 'ML' },
  ],
} as const;
