import type { Metadata } from 'next';
import { Inter, Lato, Oswald, Kanit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// UberViz Fonts
const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-kanit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jack -- 3D Creator',
  description: 'Portfolio of Jack, 3D Creator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} ${lato.variable} ${oswald.variable} ${kanit.variable}`}>{children}</body>
    </html>
  );
}
