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
import Modal, { ConfirmModal, SuccessModal, ErrorModal } from '@/components/Modal';
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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [viewMode, setViewMode] = useState('helix'); // 'helix' or 'network'

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage('Mohon lengkapi semua field sebelum melanjutkan.');
        setShowErrorModal(true);
        return;
      }
      setStep(2);
    }
  };

  const handleSubmitClick = () => {
    // Check all questions answered
    if (Object.keys(psychologyAnswers).length < psychologyQuestions.length) {
      setErrorMessage('Mohon jawab semua pertanyaan sebelum menyimpan.');
      setShowErrorModal(true);
      return;
    }
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    setShowConfirmModal(false);
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
        setShowSuccessModal(true);
      } else {
        const error = await res.json();
        setErrorMessage(error.error || 'Terjadi kesalahan saat menyimpan data.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/major-matching');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-register-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <FaDna className="text-3xl text-white" />
            </div>
            <p className="font-geist mono text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show results if data already exists
  if (existingData && existingData.dnaSkill && existingData.dnaPsychology) {
    return (
      <div className="min-h-screen bg-register-gradient">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* View Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              onClick={() => setViewMode('helix')}
              className={`flex items-center gap-2 rounded-full px-6 py-3 border transition-all duration-300 ${
                viewMode === 'helix'
                  ? 'bg-teal-800 text-white border-transparent shadow-xl'
                  : 'bg-teal-500 text-white/90 border-white/30 hover:bg-teal-800'
              }`}
            >
              <FaDna className="text-lg" />
              DNA Helix
            </Button>
            <Button 
              onClick={() => setViewMode('network')}
              className={`flex items-center gap-2 rounded-full px-6 py-3 border transition-all duration-300 ${
                viewMode === 'network'
                  ? 'bg-teal-800 text-white border-transparent shadow-xl'
                  : 'bg-teal-500 text-white/90 border-white/30 hover:bg-teal-800'
              }`}
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
              />
            ) : (
              <DnaNetwork 
                skillData={existingData.dnaSkill}
                psychologyData={existingData.dnaPsychology}
                width={1000}
                height={700}
              />
            )}
          </div>

          <Card className="bg-[#F6F4F0] border-2 border-[#75B2AB] rounded-3xl shadow-xl">
            <div className="flex items-center gap-4 mb-12">
                <FaDna className="text-3xl text-[#f6806d]" />
              <h1 className="text-4xl font-geist bold text-teal-800">Detail DNA Assessment</h1>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <FaFire className="text-3xl text-[#f6806d]" />
                <h2 className="text-3xl font-geist bold text-teal-800">DNA Skill</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="p-6 bg-white rounded-xl border border-[#75B2AB] shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <FaStar className="text-2xl text-[#75B2AB]" />
                    <h3 className="font-geist bold text-gray-900 text-lg">Skill Kuat</h3>
                  </div>
                  <p className="font-geist mono text-gray-700 leading-relaxed">{existingData.dnaSkill.skillStrong}</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-[#f6806d] shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <BiTargetLock className="text-2xl text-[#f6806d]" />
                    <h3 className="font-geist bold text-gray-900 text-lg">Skill Sedang</h3>
                  </div>
                  <p className="font-geist mono text-gray-700 leading-relaxed">{existingData.dnaSkill.skillMedium}</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-[#75B2AB] shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <FaChartLine className="text-2xl text-[#75B2AB]" />
                    <h3 className="font-geist bold text-gray-900 text-lg">Perlu Ditingkatkan</h3>
                  </div>
                  <p className="font-geist mono text-gray-700 leading-relaxed">{existingData.dnaSkill.skillWeak}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <GiBrain className="text-4xl text-[#f6806d]" />
                <h2 className="text-3xl font-geist bold text-teal-800">DNA Psikologi</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-6 bg-white rounded-xl border border-[#06b6d4] shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <MdPsychology className="text-2xl text-[#06b6d4]" />
                    <h3 className="font-geist bold text-gray-900 text-lg">Kognitif</h3>
                  </div>
                  <p className="font-geist mono text-gray-700 leading-relaxed">{existingData.dnaPsychology.cognitive}</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-[#f6806d] shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <GiBookshelf className="text-2xl text-[#f6806d]" />
                    <h3 className="font-geist bold text-gray-900 text-lg">Gaya Belajar</h3>
                  </div>
                  <p className="font-geist mono text-gray-700 leading-relaxed">{existingData.dnaPsychology.learning}</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-[#f6806d] shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <FaFire className="text-2xl text-[#f6806d]" />
                    <h3 className="font-geist bold text-gray-900 text-lg">Motivasi</h3>
                  </div>
                  <p className="font-geist mono text-gray-700 leading-relaxed">{existingData.dnaPsychology.motivation}</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-[#75B2AB] shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <MdEmojiPeople className="text-2xl text-[#75B2AB]" />
                    <h3 className="font-geist bold text-gray-900 text-lg">Kepribadian</h3>
                  </div>
                  <p className="font-geist mono text-gray-700 leading-relaxed">{existingData.dnaPsychology.trait}</p>
                </div>
              </div>
            </div>

            <Button onClick={() => router.push('/major-matching')} className="w-full flex items-center justify-center gap-2 bg-[#f6806d] hover:bg-[#f46a54] rounded-xl">
              <MdSchool className="text-xl" />
              Lanjut ke Matching Jurusan
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-register-gradient">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl">
              <FaDna className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-geist bold text-teal-800">DNA Assessment</h1>
              <p className="mt-1 text-lg font-geist mono text-gray-600">
                Lengkapi profil DNA skill dan psikologi Anda
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-geist text-gray-700">Step {step} of 2</span>
            <span className="text-sm font-geist mono px-4 py-2 rounded-full shadow bg-[#F6F4F0] text-gray-600 border border-[#A7A7A7]">
              {step === 1 ? '💪 DNA Skill' : '🧠 DNA Psikologi'}
            </span>
          </div>
          <div className="w-full rounded-full h-3 overflow-hidden shadow-inner bg-white/50">
            <div
              className="bg-gradient-to-r from-[#75B2AB] to-[#f6806d] h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <Card className="bg-[#F6F4F0] border border-[#A7A7A7] rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full flex items-center justify-center shadow-lg">
                <FaFire className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-geist bold text-gray-900">DNA Skill</h2>
            </div>
            
            <div className="mb-5">
              <label className="block text-base font-geist bold mb-3 text-gray-800">
                Skill yang Anda Miliki <span className="text-[#f6806d]">*</span>
              </label>
              <textarea
                name="rawSkills"
                value={skillData.rawSkills}
                onChange={handleSkillChange}
                placeholder="Contoh: programming, desain grafis, public speaking, analisis data"
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-[#75B2AB]/20 focus:border-[#75B2AB] outline-none transition-all shadow-sm bg-white border-[#A7A7A7] text-gray-900 placeholder-gray-400 hover:border-[#75B2AB] font-geist mono"
                rows="3"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-base font-geist bold mb-3 text-gray-800">
                Pengalaman Anda <span className="text-[#f6806d]">*</span>
              </label>
              <textarea
                name="experiences"
                value={skillData.experiences}
                onChange={handleSkillChange}
                placeholder="Contoh: organisasi, magang, proyek, kompetisi"
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-[#75B2AB]/20 focus:border-[#75B2AB] outline-none transition-all shadow-sm bg-white border-[#A7A7A7] text-gray-900 placeholder-gray-400 hover:border-[#75B2AB] font-geist mono"
                rows="3"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-geist bold mb-3 text-gray-800">
                Minat Awal Anda <span className="text-[#f6806d]">*</span>
              </label>
              <textarea
                name="interest"
                value={skillData.interest}
                onChange={handleSkillChange}
                placeholder="Contoh: teknologi, seni, bisnis, kesehatan"
                className="w-full px-5 py-4 border rounded-xl focus:ring-4 focus:ring-[#75B2AB]/20 focus:border-[#75B2AB] outline-none transition-all shadow-sm bg-white border-[#A7A7A7] text-gray-900 placeholder-gray-400 hover:border-[#75B2AB] font-geist mono"
                rows="3"
                required
              />
            </div>

            <Button onClick={handleNextStep} className="w-full bg-[#f6806d] hover:bg-[#f46a54] rounded-xl font-geist bold">
              ➡️ Lanjut ke Pertanyaan Psikologi
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-[#F6F4F0] border border-[#A7A7A7] rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center shadow-lg">
                <GiBrain className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-geist bold text-gray-900">DNA Psikologi</h2>
            </div>
            <p className="mb-6 leading-relaxed p-4 rounded-xl border bg-white border-[#75B2AB] text-gray-600 font-geist mono">
              <span className="font-geist bold">📝 Petunjuk:</span> Jawab pertanyaan berikut dengan skala 1-5<br/>
              <span className="text-sm">(1 = Sangat Tidak Setuju, 5 = Sangat Setuju)</span>
            </p>

            <div className="space-y-6">
              {psychologyQuestions.map((q) => (
                <div key={q.id} className="pb-6 border-b last:border-0 border-[#A7A7A7]">
                  <p className="font-geist bold mb-5 text-lg text-gray-900">{q.id}. {q.question}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-xs font-geist mono hidden sm:block text-gray-500">Sangat Tidak Setuju</span>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handlePsychologyAnswer(q.id, value)}
                          className={`w-14 h-14 rounded-full border-2 transition-all duration-300 font-geist bold text-lg shadow-lg ${
                            psychologyAnswers[q.id] === value
                              ? 'bg-gradient-to-br from-[#75B2AB] to-[#8b5cf6] text-white border-[#75B2AB] scale-110 shadow-xl'
                              : 'bg-white text-gray-700 border-[#A7A7A7] hover:border-[#75B2AB] hover:scale-105'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-geist mono hidden sm:block text-gray-500">Sangat Setuju</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 rounded-xl border-[#A7A7A7] font-geist bold">
                ⬅️ Kembali
              </Button>
              <Button 
                onClick={handleSubmitClick} 
                disabled={loading}
                className="flex-1 bg-[#f6806d] hover:bg-[#f46a54] rounded-xl font-geist bold"
              >
                {loading ? '⏳ Menyimpan...' : '✅ Simpan Assessment'}
              </Button>
            </div>
          </Card>
        )}

        {/* Modals */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleSubmit}
          title="Konfirmasi Simpan Assessment"
          message="Apakah Anda yakin ingin menyimpan DNA Assessment ini? Data yang tersimpan akan digunakan untuk matching jurusan."
          confirmText="Ya, Simpan"
          cancelText="Batal"
          type="info"
        />

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          title="Assessment Berhasil Disimpan!"
          message="DNA Assessment Anda telah berhasil disimpan. Anda akan diarahkan ke halaman Matching Jurusan."
          buttonText="Lanjut ke Matching"
        />

        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Terjadi Kesalahan"
          message={errorMessage}
          buttonText="Tutup"
        />
      </main>
    </div>
  );
}
