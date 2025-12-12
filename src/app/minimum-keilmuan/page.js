'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { HiBookOpen } from 'react-icons/hi2';
import { FaGraduationCap, FaBook, FaStar, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

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
      <div className="min-h-screen bg-register-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <HiBookOpen className="text-3xl text-white" />
            </div>
            <p className="font-geist mono text-gray-600">Loading...</p>
          </div>
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
              <HiBookOpen className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-geist bold text-teal-800">Minimum Keilmuan</h1>
              <p className="mt-1 text-lg font-geist mono text-gray-600">
                Pelajari persyaratan minimum untuk persiapan kuliah di jurusan pilihan
              </p>
            </div>
          </div>
        </div>

        {!selectedMajor ? (
          <div>
            <Card className="mb-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-geist bold text-teal-800">Pilih Jurusan</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {majors.map(major => (
                  <button
                    key={major.id}
                    onClick={() => setSelectedMajor(major)}
                    className="p-5 text-left border rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-1 border-[#E0E0E0] hover:border-[#75B2AB] bg-white"
                  >
                    <h3 className="font-geist bold text-lg text-teal-800">{major.name}</h3>
                    <p className="text-sm font-geist mono line-clamp-1 mt-1 text-gray-600">{major.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div>
            <Card className="mb-6 rounded-3xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl">
                    <FaGraduationCap className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-geist bold mb-2 text-teal-800">
                      {selectedMajor.name}
                    </h2>
                    <p className="font-geist mono leading-relaxed text-gray-600">{selectedMajor.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedMajor(null)}
                  className="rounded-full border-[#75B2AB] text-teal-800 font-geist bold"
                >
                  🔄 Ganti Jurusan
                </Button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full flex items-center justify-center shadow-lg">
                    <FaBook className="text-xl text-white" />
                  </div>
                  <h3 className="text-2xl font-geist bold text-teal-800">Minimum Keilmuan yang Diperlukan</h3>
                </div>
                <div className="border rounded-xl p-6 shadow-lg bg-white border-[#75B2AB]">
                  <p className="mb-5 leading-relaxed font-geist mono text-gray-700">
                    Berikut adalah mata kuliah dasar dan skill minimum yang perlu Anda kuasai untuk memulai perkuliahan di jurusan ini:
                  </p>
                  <ul className="space-y-3">
                    {selectedMajor.mk.split(',').map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 rounded-xl shadow-sm hover:shadow-md transition-all bg-[#F6F4F0]">
                        <FaCheckCircle className="text-[#75B2AB] text-xl mt-0.5" />
                        <span className="font-geist mono flex-1 text-gray-800">{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full flex items-center justify-center shadow-lg">
                    <FaStar className="text-xl text-white" />
                  </div>
                  <h3 className="text-2xl font-geist bold text-teal-800">Karakteristik Mahasiswa Ideal</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedMajor.traits.split(',').map((trait, index) => (
                    <span
                      key={index}
                      className="px-5 py-3 rounded-full font-geist bold shadow-md border bg-white text-teal-700 border-[#75B2AB]"
                    >
                      {trait.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <Card className="rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full flex items-center justify-center shadow-lg">
                    <FaLightbulb className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-geist bold text-teal-800">Tips Persiapan</h3>
                </div>
                <ul className="space-y-3 font-geist mono text-gray-800">
                  <li className="flex items-start gap-3">
                    <span className="text-[#f6806d] font-bold mt-1">•</span>
                    <span>Mulai belajar materi dasar dari sekarang</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#f6806d] font-bold mt-1">•</span>
                    <span>Cari sumber belajar online (YouTube, Coursera, Khan Academy)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#f6806d] font-bold mt-1">•</span>
                    <span>Latih skill praktis melalui proyek sederhana</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#f6806d] font-bold mt-1">•</span>
                    <span>Bergabung dengan komunitas atau forum terkait jurusan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#f6806d] font-bold mt-1">•</span>
                    <span>Konsultasi dengan mahasiswa yang sudah menjalani jurusan ini</span>
                  </li>
                </ul>
              </Card>

              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={() => router.push(`/modules?major=${selectedMajor.id}`)}
                  className="flex-1 bg-[#f6806d] hover:bg-[#f46a54] rounded-full font-geist bold"
                >
                  Lihat Modul Pembelajaran
                </Button>
                <Button 
                  onClick={() => router.push(`/simulator?major=${selectedMajor.id}`)}
                  variant="outline"
                  className="flex-1 rounded-full border-[#75B2AB] text-teal-800 font-geist bold"
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
            <HiBookOpen className="text-3xl text-white" />
          </div>
          <p className="font-geist mono text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <MinimumKeilmuanContent />
    </Suspense>
  );
}
