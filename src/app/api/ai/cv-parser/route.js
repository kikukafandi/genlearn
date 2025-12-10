import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseCvForDnaSkill } from '@/lib/ai/cvParser';

export async function POST(request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check API key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const cvInput = formData.get('cvInput'); // Either file or text
        const inputType = formData.get('inputType'); // 'file' or 'text'

        let cvText = '';

        if (inputType === 'file') {
            const cvFile = formData.get('cvFile');
            if (!cvFile) {
                return NextResponse.json(
                    { success: false, error: 'CV file diperlukan' },
                    { status: 400 }
                );
            }

            try {
                // Check file type - hanya TXT untuk sekarang
                if (cvFile.type === 'text/plain' || cvFile.name.endsWith('.txt')) {
                    // Parse TXT files
                    cvText = await cvFile.text();
                } else {
                    return NextResponse.json(
                        { success: false, error: 'Format file tidak didukung. Gunakan .pdf atau .txt file.' },
                        { status: 400 }
                    );
                }
            } catch (error) {
                console.error('File processing error:', error);
                return NextResponse.json(
                    { success: false, error: error.message || 'Gagal memproses file' },
                    { status: 400 }
                );
            }
        } else if (inputType === 'text') {
            cvText = cvInput?.trim();
            if (!cvText) {
                return NextResponse.json(
                    { success: false, error: 'CV text tidak boleh kosong' },
                    { status: 400 }
                );
            }
        } else {
            return NextResponse.json(
                { success: false, error: 'Input type harus "file" atau "text"' },
                { status: 400 }
            );
        }

        // Parse CV using AI
        const result = await parseCvForDnaSkill(cvText);

        return NextResponse.json({
            success: true,
            data: result.data,
            cvLength: cvText.length,
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('CV Parser API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
