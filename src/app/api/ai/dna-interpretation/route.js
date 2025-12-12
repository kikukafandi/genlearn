import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateDnaNarrative, generateDnaSummary } from '@/lib/ai/dnaInterpretation';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { dnaSkill, dnaPsycho, type = 'full' } = body;

    // Validate input
    if (!dnaSkill && !dnaPsycho) {
      return NextResponse.json(
        { error: 'DNA data is required. Please complete your DNA assessment first.' },
        { status: 400 }
      );
    }

    // Generate interpretation based on type
    let result;
    if (type === 'summary') {
      result = await generateDnaSummary({ dnaSkill, dnaPsycho });
    } else {
      result = await generateDnaNarrative({ dnaSkill, dnaPsycho });
    }

    return NextResponse.json({
      success: true,
      narrative: result,
      type: type,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('DNA Interpretation API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate DNA interpretation.',
        success: false 
      },
      { status: 500 }
    );
  }
}
