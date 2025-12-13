import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateCompatibility } from '@/lib/matching';

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
  // Helper untuk mendapatkan skor (handle jika undefined)
  const getScore = (id) => parseInt(answers[id] || 0);

  // Helper untuk menentukan label dominan (bisa ganda jika skor sama)
  const getDominantType = (options) => {
    const maxScore = Math.max(...options.map(o => o.score));
    // Jika skor maksimal 0 atau sangat rendah, return default
    if (maxScore === 0) return '-';
    
    const topTypes = options.filter(o => o.score === maxScore).map(o => o.type);
    
    if (topTypes.length === options.length) return 'Seimbang / All-Rounder';
    return topTypes.join(' & ');
  };

  // 1. Cognitive (Q1-Q3: RIASEC Based)
  const cognitive = getDominantType([
    { type: 'Analitis & Logis', score: getScore(1) },       // Investigative
    { type: 'Terstruktur & Data', score: getScore(2) },     // Conventional
    { type: 'Kreatif & Inovatif', score: getScore(3) }      // Artistic
  ]);

  // 2. Learning Style (Q4-Q6: VARK)
  const learning = getDominantType([
    { type: 'Visual (Grafis)', score: getScore(4) },
    { type: 'Auditory (Diskusi)', score: getScore(5) },
    { type: 'Kinestetik (Praktik)', score: getScore(6) }
  ]);

  // 3. Motivation (Q7-Q9: McClelland)
  const motivation = getDominantType([
    { type: 'Dampak Sosial', score: getScore(7) },          // Affiliation
    { type: 'Kepemimpinan', score: getScore(8) },           // Power
    { type: 'Tantangan & Prestasi', score: getScore(9) }    // Achievement
  ]);

  // 4. Trait (Q10-Q12: Big Five)
  const trait = getDominantType([
    { type: 'Teliti & Detail', score: getScore(10) },       // Conscientiousness
    { type: 'Kolaboratif', score: getScore(11) },           // Extraversion
    { type: 'Adaptif & Tenang', score: getScore(12) }       // Emotional Stability
  ]);

  return { cognitive, learning, motivation, trait };
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

    // --- MAJOR MATCHING LOGIC ---
    
    // 1. Ambil semua jurusan dari DB
    const allMajors = await prisma.major.findMany();

    // 2. Lakukan Matching
    const matchedMajors = allMajors.map(major => {
      let traits = {};
      let learning = {};
      
      // Parse metadata
      if (major.metadata) {
        try {
          const meta = JSON.parse(major.metadata);
          traits = meta.traits || {};
          learning = meta.learning || {};
        } catch (e) {
          console.error('Failed to parse metadata for major', major.name);
        }
      }

      const majorForMatching = { ...major, traits, learning };
      
      const score = calculateCompatibility(
        { 
          psychologyAnswers, 
          rawSkills: skillData.rawSkills,
          experiences: skillData.experiences, // Tambahkan ini
          interest: skillData.interest        // Tambahkan ini
        },
        majorForMatching
      );

      return { ...major, score };
    });

    // 3. Urutkan & Ambil Top 10
    const topMajors = matchedMajors.sort((a, b) => b.score - a.score).slice(0, 10);

    // 4. Simpan Hasil Rekomendasi
    await prisma.userRecommendation.create({
      data: { userId, recommendations: JSON.stringify(topMajors) }
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
