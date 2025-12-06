'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { FaDna, FaUserGraduate, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';
import { MdDashboard, MdSchool } from 'react-icons/md';
import { BiTargetLock } from 'react-icons/bi';
import { HiDocumentText } from 'react-icons/hi2';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();

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
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <FaDna className="text-3xl text-white" />
            </div>
            <p className={`font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasDnaSkill = userData?.dnaSkill !== null;
  const hasDnaPsychology = userData?.dnaPsychology !== null;
  const progress = ((hasDnaSkill ? 1 : 0) + (hasDnaPsychology ? 1 : 0)) / 2 * 100;

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <MdDashboard className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Selamat Datang, {session?.user?.name}!
              </h1>
              <p className={`mt-1 text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Kelola perjalanan pembelajaran Anda di sini
              </p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Progress Assessment</h2>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-semibold text-gray-700">Kelengkapan Profil</span>
              <span className="font-bold text-blue-600 text-lg">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${hasDnaSkill ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">DNA Skill</h3>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    {hasDnaSkill ? (
                      <><FaCheckCircle className="text-green-600" /> Sudah dilengkapi</>
                    ) : (
                      <><FaClock className="text-gray-500" /> Belum dilengkapi</>
                    )}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasDnaSkill ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {hasDnaSkill ? <FaCheckCircle className="text-2xl text-white" /> : <FaClock className="text-2xl text-white" />}
                </div>
              </div>
            </div>
            <div className={`p-5 rounded-2xl border-2 transition-all duration-300 ${hasDnaPsychology ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">DNA Psikologi</h3>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    {hasDnaPsychology ? (
                      <><FaCheckCircle className="text-green-600" /> Sudah dilengkapi</>
                    ) : (
                      <><FaClock className="text-gray-500" /> Belum dilengkapi</>
                    )}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasDnaPsychology ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {hasDnaPsychology ? <FaCheckCircle className="text-2xl text-white" /> : <FaClock className="text-2xl text-white" />}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white to-cyan-50 border-2 border-cyan-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <FaDna className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">DNA Assessment</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Lengkapi profil DNA skill dan psikologi Anda untuk mendapatkan rekomendasi terbaik
            </p>
            <Link href="/dna">
              <Button className="w-full flex items-center justify-center gap-2">
                {hasDnaSkill && hasDnaPsychology ? (
                  <><FaChartLine /> Lihat Hasil</>
                ) : (
                  <><FaDna /> Mulai Assessment</>
                )}
              </Button>
            </Link>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <BiTargetLock className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Matching Jurusan</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Temukan jurusan yang cocok dengan profil unik Anda melalui AI matching
            </p>
            <Link href="/major-matching">
              <Button 
                className="w-full flex items-center justify-center gap-2"
                disabled={!hasDnaSkill || !hasDnaPsychology}
              >
                <BiTargetLock /> Mulai Matching
              </Button>
            </Link>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <HiDocumentText className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Modul Adaptif</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Akses modul pembelajaran adaptif untuk persiapan kuliah yang optimal
            </p>
            <Link href="/modules">
              <Button 
                className="w-full flex items-center justify-center gap-2"
                disabled={!hasDnaSkill || !hasDnaPsychology}
              >
                <HiDocumentText /> Lihat Modul
              </Button>
            </Link>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <MdSchool className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Minimum Keilmuan</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Pelajari persyaratan minimum untuk jurusan pilihan Anda
            </p>
            <Link href="/minimum-keilmuan">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <MdSchool /> Lihat Detail
              </Button>
            </Link>
          </Card>

          <Card className="bg-gradient-to-br from-white to-pink-50 border-2 border-pink-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUserGraduate className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Simulator</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Coba simulasi tugas kuliah sesuai jurusan pilihan
            </p>
            <Link href="/simulator">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <FaUserGraduate /> Mulai Simulasi
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
