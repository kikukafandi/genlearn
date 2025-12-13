import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Filter by type (e.g., 'dna', 'major')
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where = {
      userId: parseInt(session.user.id)
    };
    if (type) {
      where.type = type;
    }

    // Fetch interpretations from database
    const [interpretations, total] = await Promise.all([
      prisma.aiInterpretation.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset,
        select: {
          id: true,
          type: true,
          category: true,
          response: true,
          metadata: true,
          createdAt: true
        }
      }),
      prisma.aiInterpretation.count({ where })
    ]);

    // Parse metadata JSON
    const formattedInterpretations = interpretations.map(interp => ({
      ...interp,
      metadata: interp.metadata ? JSON.parse(interp.metadata) : null
    }));

    return NextResponse.json({
      success: true,
      interpretations: formattedInterpretations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Get Interpretations API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch interpretations.',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Get specific interpretation by ID
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

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Interpretation ID is required.' },
        { status: 400 }
      );
    }

    // Fetch specific interpretation
    const interpretation = await prisma.aiInterpretation.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(session.user.id) // Ensure user owns this interpretation
      },
      select: {
        id: true,
        type: true,
        category: true,
        prompt: true,
        response: true,
        metadata: true,
        createdAt: true
      }
    });

    if (!interpretation) {
      return NextResponse.json(
        { error: 'Interpretation not found.' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const formattedInterpretation = {
      ...interpretation,
      prompt: interpretation.prompt ? JSON.parse(interpretation.prompt) : null,
      metadata: interpretation.metadata ? JSON.parse(interpretation.metadata) : null
    };

    return NextResponse.json({
      success: true,
      interpretation: formattedInterpretation
    });

  } catch (error) {
    console.error('Get Interpretation By ID API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch interpretation.',
        success: false 
      },
      { status: 500 }
    );
  }
}
