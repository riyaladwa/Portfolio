import { Syne, Inter } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Riya Ladwa | CSE Student & Developer',
  description: 'Personal portfolio of Riya Ladwa, a Computer Science & Engineering student building AI-powered web applications and strengthening problem-solving through Java & DSA.',
  metadataBase: new URL('https://riyaladwa.dev'),
  openGraph: {
    type: 'website',
    url: 'https://riyaladwa.dev',
    title: 'Riya Ladwa | CSE Student & AI/Web Developer',
    description: 'Computer Science Engineering student passionate about building practical, AI-powered applications and solving problems through Java & DSA.',
    images: [
      {
        url: '/images/riya.jpeg',
        width: 1200,
        height: 630,
        alt: 'Riya Ladwa Profile',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body className="font-body selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
