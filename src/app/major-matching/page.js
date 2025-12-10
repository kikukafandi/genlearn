'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { ConfirmModal, SuccessModal } from '@/components/Modal';
import { useTheme } from '@/contexts/ThemeContext';
import { BiTargetLock } from 'react-icons/bi';
import { FaUniversity, FaCheckCircle, FaTrophy, FaMedal, FaRobot, FaLightbulb } from 'react-icons/fa';
import { MdSchool } from 'react-icons/md';
import { HiDocumentText, HiSparkles } from 'react-icons/hi2';

export default function MajorMatchingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingMajorId, setPendingMajorId] = useState(null);
  const [pendingMajorName, setPendingMajorName] = useState('');
  
  // AI Explanation states
  const [aiExplanations, setAiExplanations] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [dnaData, setDnaData] = useState({ skill: null, psycho: null });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchMatches();
    }
  }, [status, router]);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/major/match');
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        // Also store DNA data for AI explanation
        if (data.dnaSkill || data.dnaPsycho) {
          setDnaData({ skill: data.dnaSkill, psycho: data.dnaPsycho });
        }
      } else {
        const error = await res.json();
        if (error.error?.includes('DNA')) {
          router.push('/dna');
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI explanation for majors
  const generateAiExplanation = async () => {
    if (matches.length === 0) return;
    
    setAiLoading(true);
    try {
      const top3 = matches.slice(0, 3);
      const res = await fetch('/api/ai/major-explainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dnaSkill: dnaData.skill,
          dnaPsycho: dnaData.psycho,
          topMajors: top3.map(m => ({
            id: m.id,
            name: m.name,
            score: m.score,
            traits: m.traits,
            description: m.description
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Convert array to object keyed by major id
        const explanationsMap = {};
        data.majors.forEach(m => {
          explanationsMap[m.id] = {
            explanation: m.aiExplanation,
            keyStrengths: m.keyStrengths,
            growthAreas: m.growthAreas
          };
        });
        setAiExplanations(explanationsMap);
        setAiGenerated(true);
      }
    } catch (error) {
      console.error('Error generating AI explanation:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectMajorClick = (majorId, majorName) => {
    setPendingMajorId(majorId);
    setPendingMajorName(majorName);
    setShowConfirmModal(true);
  };

  const handleSelectMajor = async () => {
    setShowConfirmModal(false);
    try {
      const res = await fetch('/api/major/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ majorId: pendingMajorId })
      });

      if (res.ok) {
        setSelectedMajor(pendingMajorId);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error selecting major:', error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push(`/minimum-keilmuan?major=${pendingMajorId}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-linear-to-br from-gray-900 via-blue-900 to-purple-900'
          : 'bg-linear-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <BiTargetLock className="text-3xl text-white" />
            </div>
            <p className={`font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const top3Matches = matches.slice(0, 3);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-linear-to-br from-gray-900 via-blue-900 to-purple-900'
        : 'bg-linear-to-br from-blue-50 via-purple-50 to-indigo-100'
    }`}>
      {/* Bubble Background */}
      <div className={`absolute top-20 right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
      }`}></div>
      <div className={`absolute bottom-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
      }`} style={{animationDelay: '1.5s'}}></div>
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
              <BiTargetLock className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Matching Jurusan</h1>
              <p className={`mt-1 text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Berikut adalah 3 jurusan yang paling cocok dengan profil DNA Anda
              </p>
            </div>
          </div>
        </div>

        {top3Matches.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-linear-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <BiTargetLock className="text-4xl text-white" />
              </div>
              <p className={`mb-4 text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Belum ada hasil matching. Silakan lengkapi DNA Assessment terlebih dahulu.
              </p>
              <Button onClick={() => router.push('/dna')} className="mt-4 mx-auto flex items-center gap-2">
                <BiTargetLock /> Ke DNA Assessment
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {top3Matches.map((match, index) => (
              <Card key={match.id} className={`relative animate-bubble-pop bg-linear-to-br ${
                index === 0 ? 'from-white to-yellow-50 border-4 border-yellow-300' : 
                index === 1 ? 'from-white to-blue-50 border-2 border-blue-200' : 
                'from-white to-purple-50 border-2 border-purple-200'
              }`} style={{animationDelay: `${index * 0.1}s`}}>
                {index === 0 && (
                  <div className="absolute -top-4 -right-4 bg-linear-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-base shadow-2xl animate-pulse-glow flex items-center gap-2">
                    <FaTrophy /> Top Match
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${
                        index === 0 ? 'bg-linear-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-linear-to-br from-blue-500 to-cyan-500' :
                        'bg-linear-to-br from-purple-500 to-pink-500'
                      }`}>
                        <span className="text-3xl text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {match.name}
                        </h2>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg shadow-lg">
                          <FaMedal />
                          <span>{match.score}% Match</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-5 leading-relaxed text-lg">{match.description}</p>
                    
                    <div className="mb-5">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                        <FaCheckCircle className="text-green-600" />
                        <span>Traits yang Cocok:</span>
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {match.traits.split(',').map((trait, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-linear-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-semibold border-2 border-green-300 shadow-sm"
                          >
                            {trait.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5 p-5 bg-blue-50 rounded-2xl border-2 border-blue-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                        <MdSchool className="text-blue-600" />
                        <span>Alasan Matching:</span>
                      </h3>
                      <ul className="space-y-2">
                        {match.reasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700">
                            <FaCheckCircle className="text-blue-600 mt-1 shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Explanation Section */}
                    {aiExplanations[match.id] && (
                      <div className="mb-5 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                        <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                          <HiSparkles className="text-purple-600" />
                          <span>Insight AI untuk Anda:</span>
                        </h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {aiExplanations[match.id].explanation}
                        </p>
                        
                        {aiExplanations[match.id].keyStrengths?.length > 0 && (
                          <div className="mb-3">
                            <p className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                              <FaLightbulb className="text-yellow-500" /> Kekuatan Anda:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {aiExplanations[match.id].keyStrengths.map((strength, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {aiExplanations[match.id].growthAreas?.length > 0 && (
                          <div>
                            <p className="font-semibold text-purple-800 mb-2">Area Pengembangan:</p>
                            <div className="flex flex-wrap gap-2">
                              {aiExplanations[match.id].growthAreas.map((area, i) => (
                                <span key={i} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => handleSelectMajorClick(match.id, match.name)}
                    disabled={selectedMajor === match.id}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    {selectedMajor === match.id ? (
                      <><FaCheckCircle /> Dipilih</>
                    ) : (
                      <><BiTargetLock /> Pilih Jurusan Ini</>
                    )}
                  </Button>
                  <Button
                    onClick={() => router.push(`/minimum-keilmuan?major=${match.id}`)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <MdSchool /> Lihat Minimum Keilmuan
                  </Button>
                </div>
              </Card>
            ))}

            {/* AI Explanation Card */}
            <Card className={`border-2 ${aiGenerated ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300' : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${aiGenerated ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>
                    <FaRobot className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Major Explanation</h3>
                    <p className="text-sm text-gray-600">
                      {aiGenerated ? 'Insight AI sudah tersedia di setiap kartu jurusan' : 'Dapatkan penjelasan personal dari AI tentang kecocokan Anda'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={generateAiExplanation}
                  disabled={aiLoading || aiGenerated}
                  variant={aiGenerated ? 'secondary' : 'primary'}
                  className="flex items-center gap-2"
                >
                  {aiLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
                  ) : aiGenerated ? (
                    <><HiSparkles /> Generated</>
                  ) : (
                    <><HiSparkles /> Generate AI Insight</>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="bg-linear-to-br from-blue-50 to-indigo-100 border-2 border-blue-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <MdSchool className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tips Memilih Jurusan</h3>
              </div>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Pertimbangkan minat jangka panjang Anda</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Lihat prospek karir dari jurusan tersebut</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Konsultasikan dengan orang tua atau mentor</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-blue-600 mt-1 shrink-0" />
                  <span>Pelajari minimum keilmuan yang dibutuhkan</span>
                </li>
              </ul>
            </Card>

            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/modules')} variant="secondary" className="flex items-center gap-2">
                <HiDocumentText /> Lihat Modul Pembelajaran
              </Button>
              <Button onClick={() => router.push('/simulator')} variant="outline">
                🎮 Coba Simulator
              </Button>
            </div>
          </div>
        )}

        {/* Show all matches */}
        {matches.length > 3 && (
          <Card className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Jurusan Lainnya</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {matches.slice(3).map((match, index) => (
                <div key={match.id} className="p-5 border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-gray-900">{index + 4}. {match.name}</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">{match.score}%</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{match.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Modals */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleSelectMajor}
          title="Konfirmasi Pilihan Jurusan"
          message={`Apakah Anda yakin ingin memilih "${pendingMajorName}" sebagai jurusan pilihan Anda?`}
          confirmText="Ya, Pilih"
          cancelText="Batal"
          type="info"
        />

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          title="Jurusan Berhasil Dipilih!"
          message={`Selamat! "${pendingMajorName}" telah dipilih sebagai jurusan Anda. Anda akan diarahkan ke halaman Minimum Keilmuan.`}
          buttonText="Lihat Minimum Keilmuan"
        />
      </main>
    </div>
  );
}
