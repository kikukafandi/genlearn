'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const hasDnaSkill = userData?.dnaSkill !== null;
  const hasDnaPsychology = userData?.dnaPsychology !== null;
  const progress = ((hasDnaSkill ? 1 : 0) + (hasDnaPsychology ? 1 : 0)) / 2 * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Selamat Datang, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola perjalanan pembelajaran Anda di sini
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">Progress Assessment</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Kelengkapan Profil</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className={`p-4 rounded-lg border-2 ${hasDnaSkill ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">DNA Skill</h3>
                  <p className="text-sm text-gray-600">
                    {hasDnaSkill ? 'Sudah dilengkapi' : 'Belum dilengkapi'}
                  </p>
                </div>
                <span className="text-2xl">
                  {hasDnaSkill ? '✅' : '⭕'}
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-2 ${hasDnaPsychology ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">DNA Psikologi</h3>
                  <p className="text-sm text-gray-600">
                    {hasDnaPsychology ? 'Sudah dilengkapi' : 'Belum dilengkapi'}
                  </p>
                </div>
                <span className="text-2xl">
                  {hasDnaPsychology ? '✅' : '⭕'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-bold mb-2">🧬 DNA Assessment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Lengkapi profil DNA skill dan psikologi Anda
            </p>
            <Link href="/dna">
              <Button className="w-full">
                {hasDnaSkill && hasDnaPsychology ? 'Lihat Hasil' : 'Mulai Assessment'}
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-2">🎯 Matching Jurusan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Temukan jurusan yang cocok dengan profil Anda
            </p>
            <Link href="/major-matching">
              <Button 
                className="w-full"
                disabled={!hasDnaSkill || !hasDnaPsychology}
              >
                Mulai Matching
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-2">📚 Modul Pembelajaran</h3>
            <p className="text-sm text-gray-600 mb-4">
              Akses modul adaptif untuk persiapan kuliah
            </p>
            <Link href="/modules">
              <Button 
                className="w-full"
                disabled={!hasDnaSkill || !hasDnaPsychology}
              >
                Lihat Modul
              </Button>
            </Link>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <h3 className="text-lg font-bold mb-2">📖 Minimum Keilmuan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pelajari persyaratan minimum untuk jurusan pilihan Anda
            </p>
            <Link href="/minimum-keilmuan">
              <Button variant="outline" className="w-full">
                Lihat Detail
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-2">🎮 Simulator</h3>
            <p className="text-sm text-gray-600 mb-4">
              Coba simulasi tugas kuliah sesuai jurusan pilihan
            </p>
            <Link href="/simulator">
              <Button variant="outline" className="w-full">
                Mulai Simulasi
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
