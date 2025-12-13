// src/lib/matching.js

/**
 * Menghitung skor kecocokan antara profil user dan jurusan
 * @param {Object} userProfile - { psychologyAnswers, rawSkills }
 * @param {Object} major - Data jurusan dari database
 * @returns {number} Score (0-100)
 */
export function calculateCompatibility(userProfile, major) {
  let score = 0;
  const { psychologyAnswers } = userProfile;
  const majorTraits = major.traits || {}; // Object traits dari metadata

  // 1. COGNITIVE MATCHING (30%)
  // Q1 (Logic) -> Investigative
  // Q2 (Data) -> Conventional
  // Q3 (Ideas) -> Artistic
  const cognitiveScore = (
    ((psychologyAnswers[1] || 0) * (majorTraits.investigative || 0)) +
    ((psychologyAnswers[2] || 0) * (majorTraits.conventional || 0)) +
    ((psychologyAnswers[3] || 0) * (majorTraits.artistic || 0))
  ) / 15; // Normalize (Max 5*1 + 5*1 + 5*1 = 15)
  score += cognitiveScore * 30;

  // 2. LEARNING STYLE MATCHING (20%)
  // Q4 (Visual), Q5 (Auditory), Q6 (Kinesthetic)
  const learningScore = (
    ((psychologyAnswers[4] || 0) * (majorTraits.visual || 0)) +
    ((psychologyAnswers[5] || 0) * (majorTraits.auditory || 0)) +
    ((psychologyAnswers[6] || 0) * (majorTraits.kinesthetic || 0))
  ) / 15;
  score += learningScore * 20;

  // 3. MOTIVATION & TRAIT MATCHING (30%)
  // Q7 (Social Impact) -> Social
  // Q8 (Leadership) -> Enterprising
  // Q9 (Challenge) -> Realistic/Achievement
  // Q10 (Detail) -> Conventional
  const motivationScore = (
    ((psychologyAnswers[7] || 0) * (majorTraits.social || 0)) +
    ((psychologyAnswers[8] || 0) * (majorTraits.enterprising || 0)) +
    ((psychologyAnswers[9] || 0) * (majorTraits.realistic || 0)) +
    ((psychologyAnswers[10] || 0) * (majorTraits.conventional || 0))
  ) / 20;
  score += motivationScore * 30;

  // 4. SKILL, INTEREST & EXPERIENCE MATCHING (20%)
  let skillMatch = 0;
  if (major.skills) {
    const majorSkills = major.skills.toLowerCase().split(',').map(s => s.trim());

    // Helper untuk menghitung jumlah kata kunci yang cocok
    const countMatches = (text) => {
      if (!text) return 0;
      const words = text.toLowerCase().split(/[\s,]+/);
      return words.filter(w => 
        majorSkills.some(ms => ms.includes(w) || w.includes(ms))
      ).length;
    };

    const rawMatches = countMatches(userProfile.rawSkills);
    const interestMatches = countMatches(userProfile.interest);
    const expMatches = countMatches(userProfile.experiences);

    // Bobot: Raw Skills (3x), Interest (2x), Experience (1x)
    // Logika: Skill nyata paling penting, diikuti minat, lalu pengalaman umum
    const weightedScore = (rawMatches * 15) + (interestMatches * 10) + (expMatches * 5);
    
    // Cap score at 100
    skillMatch = Math.min(weightedScore, 100);
  }
  score += skillMatch * 0.2; // 20% weight

  return Math.round(score);
}
