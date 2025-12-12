'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { HiDocumentText } from 'react-icons/hi2';
import { FaBook, FaCheckCircle, FaClock } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';

function ModulesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="min-h-screen bg-register-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <HiDocumentText className="text-3xl text-white" />
            </div>
            <p className="font-geist mono text-gray-600">Generating modules...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!modules) {
    return (
      <div className="min-h-screen bg-register-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card className="rounded-3xl">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <HiDocumentText className="text-3xl text-white" />
              </div>
              <p className="mb-4 text-lg font-geist mono text-gray-700">Belum ada modul tersedia</p>
              <Button onClick={() => router.push('/major-matching')} className="flex items-center gap-2 mx-auto bg-[#f6806d] hover:bg-[#f46a54] rounded-full px-8">
                <BiTargetLock /> Pilih Jurusan Dulu
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-register-gradient">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-3xl">📚</span>
            </div>
            <div>
              <h1 className="text-4xl font-geist bold text-teal-800">Modul Pembelajaran</h1>
              <p className="font-geist mono text-gray-600 mt-1 text-lg">
                Program persiapan 4 minggu untuk jurusan {modules.majorName}
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-[#75B2AB] via-[#8b5cf6] to-[#06b6d4] text-white border-none rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">🎓</span>
            </div>
            <h2 className="text-3xl font-geist bold">{modules.majorName}</h2>
          </div>
          <p className="mb-5 text-white/90 leading-relaxed text-lg font-geist mono">{modules.majorDescription}</p>
          <div className="flex gap-4 text-sm flex-wrap">
            <div className="bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm border border-white/30">
              <span className="font-geist bold">Gaya Belajar:</span> {modules.learningStyle}
            </div>
            <div className="bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm border border-white/30">
              <span className="font-geist bold">Motivasi:</span> {modules.motivation}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {modules.weeks.map((week, index) => (
            <Card key={index} className="border-2 border-[#75B2AB] bg-[#F6F4F0] hover:shadow-2xl transition-all rounded-3xl" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-[#8b5cf6] rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white font-geist bold text-xl">{week.week}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-geist bold text-teal-800 mb-2">
                      Minggu {week.week}: {week.title}
                    </h2>
                    <p className="font-geist mono text-gray-600 leading-relaxed">{week.description}</p>
                  </div>
                </div>
                <div className="px-5 py-2 bg-gradient-to-r from-[#75B2AB] to-[#8b5cf6] text-white rounded-full font-geist bold text-sm shadow-lg">
                  Week {week.week}
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <h3 className="font-geist bold text-gray-900 text-lg">Materi</h3>
                </div>
                <ul className="space-y-3">
                  {week.materials.map((material, i) => (
                    <li key={i} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                      <span className="text-[#75B2AB] mr-3 font-bold text-xl">•</span>
                      <span className="font-geist mono text-gray-700 flex-1">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✍️</span>
                  </div>
                  <h3 className="font-geist bold text-gray-900 text-lg">Aktivitas</h3>
                </div>
                <ul className="space-y-3">
                  {week.activities.map((activity, i) => (
                    <li key={i} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                      <span className="text-[#75B2AB] mr-3 font-bold text-xl">✓</span>
                      <span className="font-geist mono text-gray-700 flex-1">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {week.project && (
                <div className="bg-white border border-[#f6806d] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <h3 className="font-geist bold text-gray-900 text-lg">Proyek Minggu Ini</h3>
                  </div>
                  <p className="font-geist mono text-gray-800 leading-relaxed">{week.project}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-2xl font-geist bold text-teal-800">Setelah Menyelesaikan Program</h3>
          </div>
          <ul className="space-y-3 font-geist mono text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-[#75B2AB] font-bold mt-1">•</span>
              <span>Anda akan memiliki pemahaman dasar yang kuat</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#75B2AB] font-bold mt-1">•</span>
              <span>Siap menghadapi tantangan awal perkuliahan</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#75B2AB] font-bold mt-1">•</span>
              <span>Memiliki portofolio proyek sederhana</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#75B2AB] font-bold mt-1">•</span>
              <span>Lebih percaya diri dalam memilih jurusan</span>
            </li>
          </ul>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.push('/simulator')} className="px-8 bg-[#f6806d] hover:bg-[#f46a54] rounded-full font-geist bold">
            🎮 Coba Simulator Tugas Kuliah
          </Button>
          <Button 
            onClick={() => router.push('/minimum-keilmuan')} 
            variant="outline"
            className="px-8 rounded-full border-[#75B2AB] text-teal-800 font-geist bold"
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
            <span className="text-3xl">📚</span>
          </div>
          <p className="font-geist mono text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ModulesContent />
    </Suspense>
  );
}
