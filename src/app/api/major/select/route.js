import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { majorId } = await request.json();

    // In a real app, you would store this selection in the database
    // For now, we'll just return success
    
    return NextResponse.json({
      message: 'Jurusan berhasil dipilih',
      majorId
    });
  } catch (error) {
    console.error('Major selection error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memilih jurusan' },
      { status: 500 }
    );
  }
}
