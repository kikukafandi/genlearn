'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function ModulesPage() {
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Generating modules...</p>
        </div>
      </div>
    );
  }

  if (!modules) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card>
            <p className="text-gray-600 mb-4">Belum ada modul tersedia</p>
            <Button onClick={() => router.push('/major-matching')}>
              Pilih Jurusan Dulu
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modul Pembelajaran</h1>
          <p className="text-gray-600 mt-2">
            Program persiapan 4 minggu untuk jurusan {modules.majorName}
          </p>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-2xl font-bold mb-3">🎓 {modules.majorName}</h2>
          <p className="mb-4">{modules.majorDescription}</p>
          <div className="flex gap-4 text-sm">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <span className="font-bold">Gaya Belajar:</span> {modules.learningStyle}
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <span className="font-bold">Motivasi:</span> {modules.motivation}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {modules.weeks.map((week, index) => (
            <Card key={index} className="border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Minggu {week.week}: {week.title}
                  </h2>
                  <p className="text-gray-600">{week.description}</p>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                  Week {week.week}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-3">📚 Materi</h3>
                <ul className="space-y-2">
                  {week.materials.map((material, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      <span className="text-gray-700">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-3">✍️ Aktivitas</h3>
                <ul className="space-y-2">
                  {week.activities.map((activity, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-600 mr-3">✓</span>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {week.project && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 mb-2">🎯 Proyek Minggu Ini</h3>
                  <p className="text-gray-700">{week.project}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-green-50 border-2 border-green-200">
          <h3 className="text-xl font-bold mb-3">✅ Setelah Menyelesaikan Program</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Anda akan memiliki pemahaman dasar yang kuat</li>
            <li>• Siap menghadapi tantangan awal perkuliahan</li>
            <li>• Memiliki portofolio proyek sederhana</li>
            <li>• Lebih percaya diri dalam memilih jurusan</li>
          </ul>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.push('/simulator')} className="px-8">
            Coba Simulator Tugas Kuliah
          </Button>
          <Button 
            onClick={() => router.push('/minimum-keilmuan')} 
            variant="outline"
            className="px-8"
          >
            Lihat Minimum Keilmuan
          </Button>
        </div>
      </main>
    </div>
  );
}
