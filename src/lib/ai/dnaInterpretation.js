import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate DNA narrative interpretation using Gemini AI
 * @param {Object} params - DNA data
 * @param {Object} params.dnaSkill - User's skill DNA data
 * @param {Object} params.dnaPsycho - User's psychology DNA data
 * @returns {Promise<string>} - AI-generated narrative interpretation
 */
export async function generateDnaNarrative({ dnaSkill, dnaPsycho }) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Kamu adalah seorang konselor akademik dan psikolog pendidikan yang ahli dalam menganalisis potensi mahasiswa.

Berdasarkan data DNA Assessment berikut, buatkan interpretasi naratif yang personal, mendalam, dan memotivasi untuk membantu mahasiswa memahami potensi dirinya.

== DATA DNA SKILL ==
- Skill Kuat: ${dnaSkill?.skillStrong || 'Belum teridentifikasi'}
- Skill Sedang: ${dnaSkill?.skillMedium || 'Belum teridentifikasi'}
- Skill yang Perlu Ditingkatkan: ${dnaSkill?.skillWeak || 'Belum teridentifikasi'}

== DATA DNA PSIKOLOGI ==
- Kognitif: ${dnaPsycho?.cognitive || 'Belum teridentifikasi'}
- Gaya Belajar: ${dnaPsycho?.learning || 'Belum teridentifikasi'}
- Motivasi: ${dnaPsycho?.motivation || 'Belum teridentifikasi'}
- Kepribadian: ${dnaPsycho?.trait || 'Belum teridentifikasi'}

INSTRUKSI:
1. Buat paragraf pembuka yang menyapa dan memberikan gambaran umum tentang profil unik mahasiswa ini.
2. Analisis kekuatan utama berdasarkan skill dan psikologi - jelaskan bagaimana kombinasi ini membentuk keunggulan kompetitif.
3. Identifikasi area pengembangan dengan nada positif dan konstruktif.
4. Berikan rekomendasi gaya belajar yang optimal berdasarkan profil kognitif dan learning style.
5. Tutup dengan motivasi dan langkah konkret yang bisa diambil.

FORMAT:
- Gunakan bahasa Indonesia yang hangat, personal, dan profesional.
- Panjang sekitar 300-400 kata.
- Gunakan paragraf yang terstruktur dengan baik.
- Hindari bullet points, buat dalam bentuk naratif mengalir.
- Sapa dengan "Anda" bukan "kamu".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const narrative = response.text();

    return narrative;
  } catch (error) {
    console.error('Error generating DNA narrative:', error);
    throw new Error('Gagal menghasilkan interpretasi DNA. Silakan coba lagi.');
  }
}

/**
 * Generate quick DNA summary for dashboard display
 * @param {Object} params - DNA data
 * @param {Object} params.dnaSkill - User's skill DNA data
 * @param {Object} params.dnaPsycho - User's psychology DNA data
 * @returns {Promise<string>} - Short AI-generated summary
 */
export async function generateDnaSummary({ dnaSkill, dnaPsycho }) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Berdasarkan data DNA berikut, buat ringkasan singkat 2-3 kalimat yang menggambarkan profil unik mahasiswa ini:

Skill Kuat: ${dnaSkill?.skillStrong || '-'}
Kognitif: ${dnaPsycho?.cognitive || '-'}
Gaya Belajar: ${dnaPsycho?.learning || '-'}
Kepribadian: ${dnaPsycho?.trait || '-'}

Buat ringkasan dalam bahasa Indonesia yang positif dan memotivasi. Maksimal 50 kata.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating DNA summary:', error);
    throw new Error('Gagal menghasilkan ringkasan DNA.');
  }
}
