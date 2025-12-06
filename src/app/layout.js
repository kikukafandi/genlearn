import "./globals.css";
import Providers from "@/components/Providers";

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
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
