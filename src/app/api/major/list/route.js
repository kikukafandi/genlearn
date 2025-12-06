import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const majors = await prisma.major.findMany();
    return NextResponse.json({ majors });
  } catch (error) {
    console.error('Major list error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil daftar jurusan' },
      { status: 500 }
    );
  }
}
