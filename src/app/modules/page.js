'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { HiDocumentText } from 'react-icons/hi2';
import { FaBook, FaCheckCircle, FaClock } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';

function ModulesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState(null);

  const majorId = searchParams.get('major');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (majorId) {
        fetchModules(majorId);
      } else {
        fetchModulesFromProfile();
      }
    }
  }, [status, router, majorId]);

  const fetchModules = async (id) => {
    try {
      const res = await fetch(`/api/modules/generate?majorId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal memuat modul');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModulesFromProfile = async () => {
    try {
      const res = await fetch('/api/modules/generate');
      if (res.ok) {
        const data = await res.json();
        setModules(data);
      } else {
        const error = await res.json();
        if (error.error?.includes('jurusan')) {
          alert('Silakan pilih jurusan di halaman Major Matching terlebih dahulu');
          router.push('/major-matching');
        }
      }
    } catch (error) {
      console.error('Error:', error);
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <HiDocumentText className="text-3xl text-white" />
            </div>
            <p className={`font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Generating modules...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!modules) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <HiDocumentText className="text-3xl text-white" />
              </div>
              <p className={`mb-4 text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>Belum ada modul tersedia</p>
              <Button onClick={() => router.push('/major-matching')} className="flex items-center gap-2 mx-auto">
                <BiTargetLock /> Pilih Jurusan Dulu
              </Button>
            </div>
          </Card>
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
      <div className={`absolute top-20 right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'
      }`}></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-3xl">📚</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Modul Pembelajaran</h1>
              <p className="text-gray-600 mt-1 text-lg">
                Program persiapan 4 minggu untuk jurusan {modules.majorName}
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">🎓</span>
            </div>
            <h2 className="text-3xl font-bold">{modules.majorName}</h2>
          </div>
          <p className="mb-5 text-blue-100 leading-relaxed text-lg">{modules.majorDescription}</p>
          <div className="flex gap-4 text-sm flex-wrap">
            <div className="bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm border border-white/30">
              <span className="font-bold">Gaya Belajar:</span> {modules.learningStyle}
            </div>
            <div className="bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm border border-white/30">
              <span className="font-bold">Motivasi:</span> {modules.motivation}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {modules.weeks.map((week, index) => (
            <Card key={index} className="border-l-8 border-blue-500 bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all animate-bubble-pop" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-xl">{week.week}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Minggu {week.week}: {week.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{week.description}</p>
                  </div>
                </div>
                <div className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-sm shadow-lg">
                  Week {week.week}
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Materi</h3>
                </div>
                <ul className="space-y-3">
                  {week.materials.map((material, i) => (
                    <li key={i} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                      <span className="text-blue-600 mr-3 font-bold text-xl">•</span>
                      <span className="text-gray-700 flex-1">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✍️</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Aktivitas</h3>
                </div>
                <ul className="space-y-3">
                  {week.activities.map((activity, i) => (
                    <li key={i} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                      <span className="text-green-600 mr-3 font-bold text-xl">✓</span>
                      <span className="text-gray-700 flex-1">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {week.project && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <h3 className="font-bold text-yellow-900 text-lg">Proyek Minggu Ini</h3>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{week.project}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Setelah Menyelesaikan Program</h3>
          </div>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">•</span>
              <span>Anda akan memiliki pemahaman dasar yang kuat</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">•</span>
              <span>Siap menghadapi tantangan awal perkuliahan</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">•</span>
              <span>Memiliki portofolio proyek sederhana</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">•</span>
              <span>Lebih percaya diri dalam memilih jurusan</span>
            </li>
          </ul>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.push('/simulator')} className="px-8">
            🎮 Coba Simulator Tugas Kuliah
          </Button>
          <Button 
            onClick={() => router.push('/minimum-keilmuan')} 
            variant="outline"
            className="px-8"
          >
            📖 Lihat Minimum Keilmuan
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ModulesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
            <span className="text-3xl">📚</span>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <ModulesContent />
    </Suspense>
  );
}
