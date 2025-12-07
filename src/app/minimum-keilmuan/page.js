'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { HiBookOpen } from 'react-icons/hi2';
import { FaGraduationCap, FaBook, FaStar, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

function MinimumKeilmuanContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);

  const majorId = searchParams?.get('major');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchMajors();
    }
  }, [status, router]);

  const fetchMajors = async () => {
    try {
      const res = await fetch('/api/major/list');
      if (res.ok) {
        const data = await res.json();
        setMajors(data.majors || []);
        
        if (majorId) {
          const major = data.majors.find(m => m.id === parseInt(majorId));
          setSelectedMajor(major);
        }
      }
    } catch (error) {
      console.error('Error fetching majors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <HiBookOpen className="text-3xl text-white" />
            </div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
    }`}>
      {/* Bubble Background */}
      <div className={`absolute top-20 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-300'
      }`}></div>
      <div className={`absolute bottom-20 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-orange-600' : 'bg-orange-300'
      }`} style={{animationDelay: '1.5s'}}></div>
      
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
              <HiBookOpen className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Minimum Keilmuan</h1>
              <p className={`mt-1 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Pelajari persyaratan minimum untuk persiapan kuliah di jurusan pilihan
              </p>
            </div>
          </div>
        </div>

        {!selectedMajor ? (
          <div>
            <Card className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pilih Jurusan</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {majors.map(major => (
                  <button
                    key={major.id}
                    onClick={() => setSelectedMajor(major)}
                    className={`p-5 text-left border-2 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-1 ${
                      theme === 'dark'
                        ? 'border-zinc-600 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-purple-900/50 bg-zinc-700/50'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50'
                    }`}
                  >
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{major.name}</h3>
                    <p className={`text-sm line-clamp-1 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{major.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div>
            <Card className={`mb-6 border-2 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-zinc-800 to-blue-900/30 border-blue-700' 
                : 'bg-gradient-to-br from-white to-blue-50 border-blue-200'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <FaGraduationCap className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {selectedMajor.name}
                    </h2>
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{selectedMajor.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedMajor(null)}
                >
                  🔄 Ganti Jurusan
                </Button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaBook className="text-xl text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Minimum Keilmuan yang Diperlukan</h3>
                </div>
                <div className={`border-2 rounded-2xl p-6 shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-700' 
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                }`}>
                  <p className={`mb-5 leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Berikut adalah mata kuliah dasar dan skill minimum yang perlu Anda kuasai untuk memulai perkuliahan di jurusan ini:
                  </p>
                  <ul className="space-y-3">
                    {selectedMajor.mk.split(',').map((item, index) => (
                      <li key={index} className={`flex items-start gap-3 p-3 rounded-xl shadow-sm hover:shadow-md transition-all ${
                        theme === 'dark' ? 'bg-zinc-800' : 'bg-white'
                      }`}>
                        <FaCheckCircle className="text-blue-500 text-xl mt-0.5" />
                        <span className={`font-medium flex-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaStar className="text-xl text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Karakteristik Mahasiswa Ideal</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedMajor.traits.split(',').map((trait, index) => (
                    <span
                      key={index}
                      className={`px-5 py-3 rounded-full font-semibold shadow-md border-2 ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border-green-700' 
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300'
                      }`}
                    >
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <Card className={`border-2 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-700' 
                  : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaLightbulb className="text-2xl text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tips Persiapan</h3>
                </div>
                <ul className={`space-y-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Mulai belajar materi dasar dari sekarang</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Cari sumber belajar online (YouTube, Coursera, Khan Academy)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Latih skill praktis melalui proyek sederhana</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Bergabung dengan komunitas atau forum terkait jurusan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Konsultasi dengan mahasiswa yang sudah menjalani jurusan ini</span>
                  </li>
                </ul>
              </Card>

              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={() => router.push(`/modules?major=${selectedMajor.id}`)}
                  className="flex-1"
                >
                  Lihat Modul Pembelajaran
                </Button>
                <Button 
                  onClick={() => router.push(`/simulator?major=${selectedMajor.id}`)}
                  variant="outline"
                  className="flex-1"
                >
                  Coba Simulator
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MinimumKeilmuanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <MinimumKeilmuanContent />
    </Suspense>
  );
}
