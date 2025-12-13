import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateMajorExplanation } from '@/lib/ai/majorExplanation';
import { prisma } from '@/lib/prisma';

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

    // Parse request body
    const body = await request.json();
    const { dnaSkill, dnaPsycho, topMajors } = body;

    // Validate input
    if (!topMajors || !Array.isArray(topMajors) || topMajors.length === 0) {
      return NextResponse.json(
        { success: false, error: 'topMajors is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Generate AI explanation
    const explanations = await generateMajorExplanation({
      dna: {
        skill: dnaSkill,
        psycho: dnaPsycho
      },
      majors: topMajors
    });

    // Merge explanations with original majors
    const majorsWithExplanation = topMajors.map((major, index) => {
      const aiExplanation = explanations.find(e => 
        e.majorName.toLowerCase() === major.name.toLowerCase()
      ) || explanations[index];

      return {
        ...major,
        aiExplanation: aiExplanation?.explanation || null,
        keyStrengths: aiExplanation?.keyStrengths || [],
        growthAreas: aiExplanation?.growthAreas || []
      };
    });

    // Save interpretation to database
    await prisma.aiInterpretation.create({
      data: {
        userId: parseInt(session.user.id),
        type: 'major',
        category: 'explanation',
        prompt: JSON.stringify({ dnaSkill, dnaPsycho, topMajors: topMajors.map(m => m.name) }),
        response: JSON.stringify(majorsWithExplanation),
        metadata: JSON.stringify({
          majorCount: topMajors.length,
          majorNames: topMajors.map(m => m.name)
        })
      }
    });

    return NextResponse.json({
      success: true,
      majors: majorsWithExplanation,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Major Explainer API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
