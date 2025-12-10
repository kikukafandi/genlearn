import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate AI explanation for why certain majors match user's DNA
 * @param {Object} params - Parameters
 * @param {Object} params.dna - User's DNA data (skill and psychology)
 * @param {Array} params.majors - Top majors with scores and traits
 * @returns {Promise<Array>} - Array of majors with AI explanations
 */
export async function generateMajorExplanation({ dna, majors }) {
  // Check API key first
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const majorsInfo = majors.map((m, i) => `
${i + 1}. ${m.name} (Score: ${m.score}%)
   - Traits: ${m.traits}
   - Description: ${m.description}
`).join('\n');

    const prompt = `Kamu adalah konselor akademik yang ahli dalam mencocokkan profil mahasiswa dengan jurusan kuliah.

== PROFIL DNA MAHASISWA ==
Skill Kuat: ${dna.skill?.skillStrong || '-'}
Skill Sedang: ${dna.skill?.skillMedium || '-'}
Skill Lemah: ${dna.skill?.skillWeak || '-'}
Kognitif: ${dna.psycho?.cognitive || '-'}
Gaya Belajar: ${dna.psycho?.learning || '-'}
Motivasi: ${dna.psycho?.motivation || '-'}
Kepribadian: ${dna.psycho?.trait || '-'}

== JURUSAN YANG COCOK ==
${majorsInfo}

TUGAS:
Berikan penjelasan personal mengapa setiap jurusan di atas cocok untuk mahasiswa ini.

FORMAT JAWABAN (JSON array, tanpa markdown):
[
  {
    "majorName": "Nama Jurusan",
    "explanation": "Penjelasan 2-3 kalimat mengapa jurusan ini cocok",
    "keyStrengths": ["Kekuatan 1", "Kekuatan 2"],
    "growthAreas": ["Area pengembangan 1"]
  }
]

ATURAN:
- Gunakan bahasa Indonesia yang hangat dan personal
- Hubungkan skill/trait mahasiswa dengan kebutuhan jurusan
- Berikan insight unik untuk setiap jurusan
- Maksimal 80 kata per penjelasan
- Kembalikan HANYA JSON array, tanpa markdown code block`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON dari response - handle berbagai format
    let cleanText = text.trim();
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
    cleanText = cleanText.replace(/\s*```$/i, '');
    cleanText = cleanText.trim();

    try {
      const explanations = JSON.parse(cleanText);
      return explanations;
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanText);
      // Return fallback explanation
      return majors.map(m => ({
        majorName: m.name,
        explanation: `${m.name} cocok dengan profil Anda berdasarkan analisis DNA Assessment.`,
        keyStrengths: ['Sesuai dengan skill Anda'],
        growthAreas: ['Terus kembangkan kemampuan']
      }));
    }
  } catch (error) {
    console.error('Error generating major explanation:', error.message || error);
    throw new Error(`Gagal menghasilkan penjelasan jurusan: ${error.message || 'Unknown error'}`);
  }
}
