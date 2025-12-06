import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function generateModules(major, userDna) {
  const learningStyle = userDna.dnaPsychology.learning;
  const motivation = userDna.dnaPsychology.motivation;
  const cognitive = userDna.dnaPsychology.cognitive;

  const weeks = [
    {
      week: 1,
      title: 'Dasar Konsep',
      description: `Pengenalan fundamental ${major.name}`,
      materials: [
        `Pengantar ${major.name} dan sejarahnya`,
        'Konsep dasar dan terminologi',
        'Pemetaan karir dan prospek',
        'Studi kasus nyata'
      ],
      activities: [
        'Membaca artikel pengenalan',
        'Menonton video tutorial dasar',
        'Diskusi dengan komunitas online',
        'Membuat mind map konsep'
      ],
      project: `Buat esai singkat tentang pemahaman Anda mengenai ${major.name}`
    },
    {
      week: 2,
      title: 'Skill Fundamental',
      description: 'Pengembangan kemampuan dasar yang diperlukan',
      materials: major.mk.split(',').slice(0, 3).map(mk => `Dasar ${mk.trim()}`),
      activities: [
        'Latihan soal dan kuis',
        'Tutorial praktis',
        'Studi mandiri dengan sumber online',
        'Peer learning dengan sesama pembelajar'
      ],
      project: 'Kerjakan mini project yang menerapkan skill fundamental'
    },
    {
      week: 3,
      title: 'Penguatan Psikologis',
      description: 'Adaptasi dengan gaya belajar dan motivasi Anda',
      materials: [
        `Strategi belajar untuk profil ${learningStyle}`,
        `Teknik mempertahankan motivasi ${motivation}`,
        'Manajemen waktu dan produktivitas',
        'Growth mindset dan resiliensi'
      ],
      activities: [
        'Self-reflection dan journaling',
        'Membuat jadwal belajar personal',
        'Praktek teknik belajar efektif',
        'Evaluasi progress mingguan'
      ],
      project: 'Buat rencana pembelajaran jangka panjang yang dipersonalisasi'
    },
    {
      week: 4,
      title: 'Simulasi Tugas Kuliah',
      description: 'Pengalaman nyata mengerjakan tugas seperti di perkuliahan',
      materials: [
        'Contoh tugas dan proyek mahasiswa',
        'Rubrik penilaian akademik',
        'Tips menghadapi ujian',
        'Presentasi akademik'
      ],
      activities: [
        'Mengerjakan simulasi tugas',
        'Presentasi hasil kerja',
        'Peer review dan feedback',
        'Revisi dan improvement'
      ],
      project: `Selesaikan tugas simulasi lengkap untuk jurusan ${major.name}`
    }
  ];

  return {
    majorName: major.name,
    majorDescription: major.description,
    learningStyle,
    motivation,
    cognitive,
    weeks
  };
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const majorId = searchParams.get('majorId');

    const userId = parseInt(session.user.id);

    // Get user DNA data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        dnaSkill: true,
        dnaPsychology: true
      }
    });

    if (!user.dnaSkill || !user.dnaPsychology) {
      return NextResponse.json(
        { error: 'Silakan lengkapi DNA Assessment terlebih dahulu' },
        { status: 400 }
      );
    }

    let major;
    if (majorId) {
      major = await prisma.major.findUnique({
        where: { id: parseInt(majorId) }
      });
    } else {
      // Get top matching major
      const majors = await prisma.major.findMany();
      // For simplicity, just get first major
      // In real app, get from user's selection
      major = majors[0];
    }

    if (!major) {
      return NextResponse.json(
        { error: 'Jurusan tidak ditemukan' },
        { status: 404 }
      );
    }

    const modules = generateModules(major, user);

    return NextResponse.json(modules);
  } catch (error) {
    console.error('Modules generation error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat generate modul' },
      { status: 500 }
    );
  }
}
