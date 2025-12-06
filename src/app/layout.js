import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GenLearn - Platform Pembelajaran Adaptif",
  description: "Platform pembelajaran adaptif yang membantu mahasiswa menemukan jurusan ideal berdasarkan DNA skill dan psikologi",
  keywords: "pembelajaran, jurusan, DNA skill, psikologi, matching jurusan",
  authors: [{ name: "GenLearn" }],
  openGraph: {
    title: "GenLearn - Platform Pembelajaran Adaptif",
    description: "Platform pembelajaran adaptif yang membantu mahasiswa menemukan jurusan ideal",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
