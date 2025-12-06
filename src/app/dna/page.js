'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import DnaHelix from '@/components/DnaHelix';
import DnaNetwork from '@/components/DnaNetwork';
import { useTheme } from '@/contexts/ThemeContext';
import { FaDna, FaNetworkWired, FaFire, FaStar, FaChartLine } from 'react-icons/fa';
import { GiBrain, GiBookshelf } from 'react-icons/gi';
import { MdPsychology, MdEmojiPeople, MdSchool } from 'react-icons/md';
import { BiTargetLock } from 'react-icons/bi';

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
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [viewMode, setViewMode] = useState('helix'); // 'helix' or 'network'

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <span className="text-3xl">🧬</span>
            </div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show results if data already exists
  if (existingData && existingData.dnaSkill && existingData.dnaPsychology) {
    return (
      <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}>
        {/* Bubble Background */}
        <div className={`absolute top-20 right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
          theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
          theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
        }`} style={{animationDelay: '1.5s'}}></div>
        
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* View Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => setViewMode('helix')}
              className={`flex items-center gap-2 ${viewMode === 'helix' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-400'}`}
            >
              <FaDna className="text-lg" />
              DNA Helix
            </Button>
            <Button 
              onClick={() => setViewMode('network')}
              className={`flex items-center gap-2 ${viewMode === 'network' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-400'}`}
            >
              <FaNetworkWired className="text-lg" />
              Network View
            </Button>
          </div>

          {/* DNA Visualization */}
          <div className="mb-8">
            {viewMode === 'helix' ? (
              <DnaHelix 
                skillData={existingData.dnaSkill}
                psychologyData={existingData.dnaPsychology}
                width={1000}
                height={700}
                theme={theme}
              />
            ) : (
              <DnaNetwork 
                skillData={existingData.dnaSkill}
                psychologyData={existingData.dnaPsychology}
                width={1000}
                height={700}
                theme={theme}
              />
            )}
          </div>

          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <FaDna className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Detail DNA Assessment</h1>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaFire className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">DNA Skill</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <FaStar className="text-2xl text-green-600" />
                    <h3 className="font-bold text-green-800 text-lg">Skill Kuat</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{existingData.dnaSkill.skillStrong}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl border-2 border-yellow-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <BiTargetLock className="text-2xl text-yellow-700" />
                    <h3 className="font-bold text-yellow-800 text-lg">Skill Sedang</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{existingData.dnaSkill.skillMedium}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border-2 border-orange-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <FaChartLine className="text-2xl text-orange-600" />
                    <h3 className="font-bold text-orange-800 text-lg">Perlu Ditingkatkan</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{existingData.dnaSkill.skillWeak}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <GiBrain className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">DNA Psikologi</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <MdPsychology className="text-2xl text-blue-600" />
                    <h3 className="font-bold text-blue-800 text-lg">Kognitif</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{existingData.dnaPsychology.cognitive}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <GiBookshelf className="text-2xl text-purple-600" />
                    <h3 className="font-bold text-purple-800 text-lg">Gaya Belajar</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{existingData.dnaPsychology.learning}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border-2 border-pink-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <FaFire className="text-2xl text-pink-600" />
                    <h3 className="font-bold text-pink-800 text-lg">Motivasi</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{existingData.dnaPsychology.motivation}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl border-2 border-indigo-300 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <MdEmojiPeople className="text-2xl text-indigo-600" />
                    <h3 className="font-bold text-indigo-800 text-lg">Kepribadian</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{existingData.dnaPsychology.trait}</p>
                </div>
              </div>
            </div>

            <Button onClick={() => router.push('/major-matching')} className="w-full flex items-center justify-center gap-2">
              <MdSchool className="text-xl" />
              Lanjut ke Matching Jurusan
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Bubble Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-3xl">🧬</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DNA Assessment</h1>
              <p className="text-gray-600 mt-1 text-lg">
                Lengkapi profil DNA skill dan psikologi Anda
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Step {step} of 2</span>
            <span className="text-sm text-gray-500 font-medium px-4 py-2 bg-white rounded-full shadow">
              {step === 1 ? '💪 DNA Skill' : '🧠 DNA Psikologi'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">💪</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">DNA Skill</h2>
            </div>
            
            <div className="mb-5">
              <label className="block text-base font-bold text-gray-800 mb-3">
                Skill yang Anda Miliki <span className="text-red-500">*</span>
              </label>
              <textarea
                name="rawSkills"
                value={skillData.rawSkills}
                onChange={handleSkillChange}
                placeholder="Contoh: programming, desain grafis, public speaking, analisis data"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white shadow-sm hover:border-gray-300"
                rows="3"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-base font-bold text-gray-800 mb-3">
                Pengalaman Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                name="experiences"
                value={skillData.experiences}
                onChange={handleSkillChange}
                placeholder="Contoh: organisasi, magang, proyek, kompetisi"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white shadow-sm hover:border-gray-300"
                rows="3"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-bold text-gray-800 mb-3">
                Minat Awal Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                name="interest"
                value={skillData.interest}
                onChange={handleSkillChange}
                placeholder="Contoh: teknologi, seni, bisnis, kesehatan"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white shadow-sm hover:border-gray-300"
                rows="3"
                required
              />
            </div>

            <Button onClick={handleNextStep} className="w-full">
              ➡️ Lanjut ke Pertanyaan Psikologi
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">🧠</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">DNA Psikologi</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
              <span className="font-semibold">📝 Petunjuk:</span> Jawab pertanyaan berikut dengan skala 1-5<br/>
              <span className="text-sm">(1 = Sangat Tidak Setuju, 5 = Sangat Setuju)</span>
            </p>

            <div className="space-y-6">
              {psychologyQuestions.map((q) => (
                <div key={q.id} className="pb-6 border-b-2 border-gray-100 last:border-0">
                  <p className="font-bold text-gray-900 mb-5 text-lg">{q.id}. {q.question}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-gray-500 font-medium hidden sm:block">Sangat Tidak Setuju</span>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handlePsychologyAnswer(q.id, value)}
                          className={`w-14 h-14 rounded-full border-3 transition-all duration-300 font-bold text-lg shadow-lg ${
                            psychologyAnswers[q.id] === value
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-600 scale-110 shadow-xl'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:scale-105'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium hidden sm:block">Sangat Setuju</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                ⬅️ Kembali
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? '⏳ Menyimpan...' : '✅ Simpan Assessment'}
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
