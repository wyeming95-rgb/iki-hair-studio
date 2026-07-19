import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { site } from '@/data/site';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Iki Hair Studio — Bandar Rimbayu',
  description:
    'A calm, considered hair studio in Bandar Rimbayu. Cutting, colouring, perming and treatments — estimate your price and book online.',
  openGraph: {
    title: 'Iki Hair Studio',
    description: 'A reason for being. Hair care shaped around your life.',
    type: 'website',
    locale: 'en_MY',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HairSalon',
              name: site.name,
              slogan: site.tagline,
              telephone: `+${site.whatsappNumber}`,
              url: site.bookingUrl,
              sameAs: [site.instagramUrl],
              address: {
                '@type': 'PostalAddress',
                streetAddress: `${site.address.line1}, ${site.address.line2}`,
                addressRegion: 'Selangor',
                addressCountry: 'MY',
              },
              openingHoursSpecification: site.hours
                .filter((h) => h.open !== null)
                .map((h) => ({
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: h.day,
                  opens: h.open,
                  closes: h.close,
                })),
            }),
          }}
        />
      </body>
    </html>
  );
}
