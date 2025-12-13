import "./globals.css";
import Providers from "@/components/Providers";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "GenLearn - Platform Pembelajaran Adaptif",
  description: "Platform pembelajaran adaptif yang membantu siswa menemukan jurusan ideal berdasarkan DNA skill dan psikologi",
  keywords: "pembelajaran, jurusan, DNA skill, psikologi, matching jurusan",
  authors: [{ name: "GenLearn" }],
  openGraph: {
    title: "GenLearn - Platform Pembelajaran Adaptif",
    description: "Platform pembelajaran adaptif yang membantu siswa menemukan jurusan ideal",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={montserrat.variable}>
      <body className={`${montserrat.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
