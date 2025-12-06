import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Simple algorithm to analyze skills
function analyzeSkills(rawSkills, experiences, interest) {
  const skills = rawSkills.toLowerCase();
  const exp = experiences.toLowerCase();
  const int = interest.toLowerCase();

  let skillStrong = [];
  let skillMedium = [];
  let skillWeak = [];

  // Technical skills
  if (skills.includes('program') || skills.includes('coding') || skills.includes('it')) {
    skillStrong.push('Programming');
  } else if (int.includes('teknologi') || int.includes('it')) {
    skillMedium.push('Programming');
  } else {
    skillWeak.push('Programming');
  }

  // Design skills
  if (skills.includes('desain') || skills.includes('design') || skills.includes('grafis')) {
    skillStrong.push('Desain');
  } else if (int.includes('seni') || int.includes('kreativ')) {
    skillMedium.push('Desain');
  } else {
    skillWeak.push('Desain');
  }

  // Communication skills
  if (skills.includes('komunikasi') || skills.includes('public speaking') || skills.includes('presentasi')) {
    skillStrong.push('Komunikasi');
  } else if (exp.includes('organisasi') || exp.includes('tim')) {
    skillMedium.push('Komunikasi');
  } else {
    skillWeak.push('Komunikasi');
  }

  // Analytical skills
  if (skills.includes('analisis') || skills.includes('data') || skills.includes('statistik')) {
    skillStrong.push('Analitis');
  } else if (int.includes('riset') || int.includes('penelitian')) {
    skillMedium.push('Analitis');
  } else {
    skillWeak.push('Analitis');
  }

  return {
    skillStrong: skillStrong.join(', ') || 'Perlu digali lebih lanjut',
    skillMedium: skillMedium.join(', ') || 'Perlu digali lebih lanjut',
    skillWeak: skillWeak.join(', ') || 'Perlu digali lebih lanjut'
  };
}

// Simple algorithm to analyze psychology
function analyzePsychology(answers) {
  const categories = {
    cognitive: [1, 5, 9],
    learning: [2, 6, 10],
    motivation: [3, 7],
    trait: [4, 8]
  };

  const results = {};

  for (const [category, questionIds] of Object.entries(categories)) {
    const scores = questionIds.map(id => answers[id] || 0);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (category === 'cognitive') {
      results.cognitive = avg >= 4 ? 'Analitis dan logis' : avg >= 3 ? 'Seimbang antara logis dan intuitif' : 'Lebih intuitif';
    } else if (category === 'learning') {
      results.learning = avg >= 4 ? 'Visual dan praktikal' : avg >= 3 ? 'Multimodal' : 'Auditory';
    } else if (category === 'motivation') {
      results.motivation = avg >= 4 ? 'Intrinsik dan berorientasi dampak' : avg >= 3 ? 'Campuran intrinsik-ekstrinsik' : 'Ekstrinsik';
    } else if (category === 'trait') {
      results.trait = avg >= 4 ? 'Sosial dan detail-oriented' : avg >= 3 ? 'Fleksibel' : 'Independen';
    }
  }

  return results;
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { skillData, psychologyAnswers } = await request.json();
    const userId = parseInt(session.user.id);

    // Analyze skills
    const skillAnalysis = analyzeSkills(
      skillData.rawSkills,
      skillData.experiences,
      skillData.interest
    );

    // Analyze psychology
    const psychologyAnalysis = analyzePsychology(psychologyAnswers);

    // Save or update DNA Skill
    await prisma.userDnaSkill.upsert({
      where: { userId },
      update: {
        rawSkills: skillData.rawSkills,
        experiences: skillData.experiences,
        interest: skillData.interest,
        skillStrong: skillAnalysis.skillStrong,
        skillMedium: skillAnalysis.skillMedium,
        skillWeak: skillAnalysis.skillWeak
      },
      create: {
        userId,
        rawSkills: skillData.rawSkills,
        experiences: skillData.experiences,
        interest: skillData.interest,
        skillStrong: skillAnalysis.skillStrong,
        skillMedium: skillAnalysis.skillMedium,
        skillWeak: skillAnalysis.skillWeak
      }
    });

    // Save or update DNA Psychology
    await prisma.userDnaPsychology.upsert({
      where: { userId },
      update: {
        cognitive: psychologyAnalysis.cognitive,
        learning: psychologyAnalysis.learning,
        motivation: psychologyAnalysis.motivation,
        trait: psychologyAnalysis.trait,
        answers: JSON.stringify(psychologyAnswers)
      },
      create: {
        userId,
        cognitive: psychologyAnalysis.cognitive,
        learning: psychologyAnalysis.learning,
        motivation: psychologyAnalysis.motivation,
        trait: psychologyAnalysis.trait,
        answers: JSON.stringify(psychologyAnswers)
      }
    });

    return NextResponse.json({
      message: 'DNA Assessment berhasil disimpan',
      skillAnalysis,
      psychologyAnalysis
    });
  } catch (error) {
    console.error('DNA submit error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan assessment' },
      { status: 500 }
    );
  }
}
