'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

const psychologyQuestions = [
  { id: 1, question: 'Saya lebih suka bekerja dengan data dan angka', category: 'cognitive' },
  { id: 2, question: 'Saya mudah memahami konsep dengan melihat gambar atau diagram', category: 'learning' },
  { id: 3, question: 'Saya termotivasi dengan tantangan baru', category: 'motivation' },
  { id: 4, question: 'Saya senang berinteraksi dan bekerja dalam tim', category: 'trait' },
  { id: 5, question: 'Saya bisa fokus pada satu tugas dalam waktu lama', category: 'cognitive' },
  { id: 6, question: 'Saya belajar lebih baik dengan praktek langsung', category: 'learning' },
  { id: 7, question: 'Saya ingin membuat dampak positif bagi masyarakat', category: 'motivation' },
  { id: 8, question: 'Saya adalah orang yang detail dan teliti', category: 'trait' },
  { id: 9, question: 'Saya suka menganalisis masalah secara logis', category: 'cognitive' },
  { id: 10, question: 'Saya mudah mengingat informasi yang saya dengar', category: 'learning' },
];

export default function DnaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState(null);

  // Step 1: Skill data
  const [skillData, setSkillData] = useState({
    rawSkills: '',
    experiences: '',
    interest: ''
  });

  // Step 2: Psychology answers
  const [psychologyAnswers, setPsychologyAnswers] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchExistingData();
    }
  }, [status, router]);

  const fetchExistingData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.dnaSkill || data.dnaPsychology) {
          setExistingData(data);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSkillChange = (e) => {
    setSkillData({
      ...skillData,
      [e.target.name]: e.target.value
    });
  };

  const handlePsychologyAnswer = (questionId, value) => {
    setPsychologyAnswers({
      ...psychologyAnswers,
      [questionId]: value
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!skillData.rawSkills || !skillData.experiences || !skillData.interest) {
        alert('Mohon lengkapi semua field');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    // Check all questions answered
    if (Object.keys(psychologyAnswers).length < psychologyQuestions.length) {
      alert('Mohon jawab semua pertanyaan');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/dna/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skillData,
          psychologyAnswers
        })
      });

      if (res.ok) {
        const result = await res.json();
        router.push('/dna/result');
      } else {
        const error = await res.json();
        alert(error.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show results if data already exists
  if (existingData && existingData.dnaSkill && existingData.dnaPsychology) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <h1 className="text-3xl font-bold mb-6">Hasil DNA Assessment</h1>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">DNA Skill</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">Skill Kuat</h3>
                  <p className="text-sm">{existingData.dnaSkill.skillStrong}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-2">Skill Sedang</h3>
                  <p className="text-sm">{existingData.dnaSkill.skillMedium}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-2">Skill Perlu Ditingkatkan</h3>
                  <p className="text-sm">{existingData.dnaSkill.skillWeak}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">DNA Psikologi</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">Kognitif</h3>
                  <p className="text-sm">{existingData.dnaPsychology.cognitive}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-2">Gaya Belajar</h3>
                  <p className="text-sm">{existingData.dnaPsychology.learning}</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h3 className="font-bold text-pink-800 mb-2">Motivasi</h3>
                  <p className="text-sm">{existingData.dnaPsychology.motivation}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-bold text-indigo-800 mb-2">Kepribadian</h3>
                  <p className="text-sm">{existingData.dnaPsychology.trait}</p>
                </div>
              </div>
            </div>

            <Button onClick={() => router.push('/major-matching')} className="w-full">
              Lanjut ke Matching Jurusan
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">DNA Assessment</h1>
          <p className="text-gray-600 mt-2">
            Lengkapi profil DNA skill dan psikologi Anda
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 2</span>
            <span className="text-sm text-gray-500">
              {step === 1 ? 'DNA Skill' : 'DNA Psikologi'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <Card>
            <h2 className="text-2xl font-bold mb-6">DNA Skill</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill yang Anda Miliki <span className="text-red-500">*</span>
              </label>
              <textarea
                name="rawSkills"
                value={skillData.rawSkills}
                onChange={handleSkillChange}
                placeholder="Contoh: programming, desain grafis, public speaking, analisis data"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="3"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pengalaman Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                name="experiences"
                value={skillData.experiences}
                onChange={handleSkillChange}
                placeholder="Contoh: organisasi, magang, proyek, kompetisi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="3"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minat Awal Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                name="interest"
                value={skillData.interest}
                onChange={handleSkillChange}
                placeholder="Contoh: teknologi, seni, bisnis, kesehatan"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="3"
                required
              />
            </div>

            <Button onClick={handleNextStep} className="w-full">
              Lanjut ke Pertanyaan Psikologi
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <h2 className="text-2xl font-bold mb-6">DNA Psikologi</h2>
            <p className="text-gray-600 mb-6">
              Jawab pertanyaan berikut dengan skala 1-5 (1 = Sangat Tidak Setuju, 5 = Sangat Setuju)
            </p>

            <div className="space-y-6">
              {psychologyQuestions.map((q) => (
                <div key={q.id} className="pb-6 border-b border-gray-200 last:border-0">
                  <p className="font-medium mb-4">{q.id}. {q.question}</p>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs text-gray-500">Sangat Tidak Setuju</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handlePsychologyAnswer(q.id, value)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            psychologyAnswers[q.id] === value
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Sangat Setuju</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                Kembali
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Menyimpan...' : 'Simpan Assessment'}
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
