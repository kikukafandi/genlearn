import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Parse CV text and extract DNA Skill data
 * @param {string} cvText - Raw text from CV (from file upload or copy-paste)
 * @returns {Promise<Object>} - Extracted DNA skill data
 */
export async function parseCvForDnaSkill(cvText) {
    try {
        if (!cvText || cvText.trim().length === 0) {
            throw new Error('CV text cannot be empty');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Analisis CV berikut dan ekstrak informasi skill, pengalaman, dan minat untuk digunakan dalam DNA Assessment.

== CV TEXT ==
${cvText}

== INSTRUKSI EKSTRAKSI ==
1. Identifikasi SEMUA hard skills dan soft skills yang disebutkan
2. Ekstrak pengalaman kerja/proyek yang relevan
3. Identifikasi bidang minat dari CV (dari job titles, projects, descriptions)

== FORMAT RESPONSE (JSON ONLY, NO MARKDOWN) ==
{
  "skillStrong": "Daftar skill utama yang paling menonjol (max 3-4 skills utama), comma-separated",
  "skillMedium": "Skill pendukung yang juga dimiliki (3-5 skills), comma-separated",
  "skillWeak": "Skill yang belum dikuasai tetapi relevan untuk ditingkatkan, comma-separated",
  "experiences": "Ringkasan pengalaman utama (2-3 pengalaman paling signifikan), bullet points format: • Deskripsi singkat",
  "interest": "Bidang minat yang terlihat dari CV (2-4 minat utama), comma-separated",
  "summary": "Ringkasan profil dalam 1-2 kalimat berdasarkan CV"
}

ATURAN:
- Skill HARUS realistis berdasarkan CV
- Gunakan bahasa Indonesia
- Jika skill tidak jelas, jangan buat-buat
- Fokus pada skills yang actionable dan terukur
- KEMBALIKAN HANYA JSON, TANPA MARKDOWN CODE BLOCK
- Pastikan format JSON valid`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON dari response
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
        const extractedData = JSON.parse(cleanText);

        return {
            success: true,
            data: {
                rawSkills: extractedData.skillStrong || '',
                experiences: extractedData.experiences || '',
                interest: extractedData.interest || '',
                skillMedium: extractedData.skillMedium || '',
                skillWeak: extractedData.skillWeak || '',
                summary: extractedData.summary || ''
            }
        };
    } catch (error) {
        console.error('Error parsing CV:', error);

        // Return more specific error messages
        if (error instanceof SyntaxError) {
            throw new Error('Gagal memproses respons AI. Format tidak valid. Silakan coba lagi.');
        }

        if (error.message?.includes('Empty content')) {
            throw new Error('CV terlalu pendek atau kosong. Pastikan CV memiliki konten yang cukup.');
        }

        throw new Error(error.message || 'Gagal mem-parse CV. Silakan coba lagi.');
    }
}

/**
 * Extract text from CV file (supports plain text only)
 * @param {File} file - CV file (.txt)
 * @returns {Promise<string>} - Extracted text from file
 */
export async function extractTextFromFile(file) {
    try {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            // For .txt files
            const text = await file.text();
            return text;
        } else {
            throw new Error('Format file tidak didukung. Gunakan .txt atau copy-paste teks CV.');
        }
    } catch (error) {
        console.error('Error extracting text from file:', error);
        throw error;
    }
}
