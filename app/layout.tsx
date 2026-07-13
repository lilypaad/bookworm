import type { Metadata } from "next";
import {Geist, Geist_Mono, IBM_Plex_Serif, Mona_Sans} from "next/font/google";
import localFont from "next/font/local";

import Navbar from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ['latin'],
  display: 'swap',
});

const ppEditorialOld = localFont({
  variable: "--font-pp-editorial",
  src: [
    {
      path: './fonts/PPEditorialOld-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/PPEditorialOld-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/PPEditorialOld-Ultrabold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/PPEditorialOld-UltraboldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fonts/PPEditorialOld-Ultralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/PPEditorialOld-UltralightItalic.otf',
      weight: '200',
      style: 'italic',
    },
  ]
});

export const metadata: Metadata = {
  title: "Bookworm",
  description: "Transform your books into interactive AI conversations. Upload PDFs, and chat with your books " +
      "using voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSerif.variable} ${monaSans.variable} ${ppEditorialOld.variable} h-full relative 
      font-sans antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
