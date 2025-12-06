import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Calculate match score between user DNA and major
function calculateMatchScore(userDna, major) {
  let score = 0;
  const reasons = [];
  
  const majorTraits = major.traits.toLowerCase().split(',').map(t => t.trim());
  const userSkills = userDna.dnaSkill;
  const userPsych = userDna.dnaPsychology;
  
  // Check skill alignment (40% weight)
  const skillStrong = userSkills.skillStrong.toLowerCase();
  const interest = userSkills.interest.toLowerCase();
  
  // Programming/IT alignment
  if (majorTraits.some(t => ['logis', 'teknis', 'problem-solving'].includes(t))) {
    if (skillStrong.includes('programming') || skillStrong.includes('analitis')) {
      score += 20;
      reasons.push('Skill programming/analitis Anda cocok dengan jurusan ini');
    }
  }
  
  // Design/Creative alignment
  if (majorTraits.some(t => ['kreatif', 'visual', 'artistik', 'estetis'].includes(t))) {
    if (skillStrong.includes('desain') || interest.includes('seni')) {
      score += 20;
      reasons.push('Kemampuan kreatif dan desain Anda sesuai');
    }
  }
  
  // Communication/Social alignment
  if (majorTraits.some(t => ['komunikatif', 'sosial', 'kepemimpinan'].includes(t))) {
    if (skillStrong.includes('komunikasi') || userPsych.trait.includes('Sosial')) {
      score += 20;
      reasons.push('Kemampuan komunikasi dan sosial Anda mendukung');
    }
  }
  
  // Analytical alignment
  if (majorTraits.some(t => ['analitis', 'detail-oriented', 'teliti'].includes(t))) {
    if (skillStrong.includes('analitis') || userPsych.cognitive.includes('Analitis')) {
      score += 20;
      reasons.push('Kemampuan analitis Anda sangat cocok');
    }
  }
  
  // Psychology alignment (30% weight)
  if (userPsych.learning.toLowerCase().includes('visual') && majorTraits.includes('visual')) {
    score += 15;
    reasons.push('Gaya belajar visual Anda sesuai');
  }
  
  if (userPsych.motivation.toLowerCase().includes('intrinsik') && majorTraits.some(t => ['sosial', 'empati'].includes(t))) {
    score += 15;
    reasons.push('Motivasi intrinsik Anda cocok dengan orientasi jurusan');
  }
  
  // Interest alignment (30% weight)
  const majorName = major.name.toLowerCase();
  if (interest.includes('teknologi') && (majorName.includes('informatika') || majorName.includes('teknik'))) {
    score += 15;
    reasons.push('Minat teknologi Anda sejalan dengan jurusan');
  }
  if (interest.includes('bisnis') && (majorName.includes('manajemen') || majorName.includes('akuntansi'))) {
    score += 15;
    reasons.push('Minat bisnis Anda sesuai dengan jurusan');
  }
  if (interest.includes('kesehatan') && majorName.includes('kedokteran')) {
    score += 15;
    reasons.push('Minat kesehatan Anda mendukung jurusan ini');
  }
  if (interest.includes('seni') && (majorName.includes('desain') || majorName.includes('arsitektur'))) {
    score += 15;
    reasons.push('Minat seni Anda cocok dengan jurusan');
  }
  if (interest.includes('hukum') && majorName.includes('hukum')) {
    score += 15;
    reasons.push('Minat hukum Anda selaras');
  }
  if (interest.includes('sosial') || interest.includes('psikologi')) {
    if (majorName.includes('psikologi') || majorName.includes('komunikasi')) {
      score += 15;
      reasons.push('Minat sosial/psikologi Anda sangat cocok');
    }
  }
  
  // Ensure minimum reasons
  if (reasons.length === 0) {
    reasons.push('Profil Anda menunjukkan potensi untuk jurusan ini');
  }
  
  // Cap score at 100
  score = Math.min(100, score + 30); // Add base score of 30
  
  return { score: Math.round(score), reasons };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Get all majors
    const majors = await prisma.major.findMany();

    // Calculate match score for each major
    const matches = majors.map(major => {
      const { score, reasons } = calculateMatchScore(user, major);
      return {
        id: major.id,
        name: major.name,
        description: major.description,
        traits: major.traits,
        mk: major.mk,
        score,
        reasons
      };
    });

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Major matching error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mencocokkan jurusan' },
      { status: 500 }
    );
  }
}
