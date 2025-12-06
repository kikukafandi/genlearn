'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';

function MinimumKeilmuanContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minimum Keilmuan</h1>
          <p className="text-gray-600 mt-2">
            Pelajari persyaratan minimum untuk persiapan kuliah di jurusan pilihan
          </p>
        </div>

        {!selectedMajor ? (
          <div>
            <Card className="mb-6">
              <h2 className="text-xl font-bold mb-4">Pilih Jurusan</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {majors.map(major => (
                  <button
                    key={major.id}
                    onClick={() => setSelectedMajor(major)}
                    className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <h3 className="font-bold">{major.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{major.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div>
            <Card className="mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedMajor.name}
                  </h2>
                  <p className="text-gray-600">{selectedMajor.description}</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedMajor(null)}
                >
                  Ganti Jurusan
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Minimum Keilmuan yang Diperlukan</h3>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    Berikut adalah mata kuliah dasar dan skill minimum yang perlu Anda kuasai untuk memulai perkuliahan di jurusan ini:
                  </p>
                  <ul className="space-y-3">
                    {selectedMajor.mk.split(',').map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-3 text-xl">✓</span>
                        <span className="text-gray-800">{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Karakteristik Mahasiswa Ideal</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMajor.traits.split(',').map((trait, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium"
                    >
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <Card className="bg-yellow-50 border-2 border-yellow-200">
                <h3 className="text-lg font-bold mb-3">💡 Tips Persiapan</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Mulai belajar materi dasar dari sekarang</li>
                  <li>• Cari sumber belajar online (YouTube, Coursera, Khan Academy)</li>
                  <li>• Latih skill praktis melalui proyek sederhana</li>
                  <li>• Bergabung dengan komunitas atau forum terkait jurusan</li>
                  <li>• Konsultasi dengan mahasiswa yang sudah menjalani jurusan ini</li>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <MinimumKeilmuanContent />
    </Suspense>
  );
}
