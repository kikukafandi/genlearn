'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { FaDna, FaUserGraduate, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';
import { MdDashboard, MdSchool } from 'react-icons/md';
import { BiTargetLock } from 'react-icons/bi';
import { HiDocumentText } from 'react-icons/hi2';

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
      <div className="bg-register-gradient">
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

  const hasDnaSkill = userData?.dnaSkill !== null;
  const hasDnaPsychology = userData?.dnaPsychology !== null;
  const progress = ((hasDnaSkill ? 1 : 0) + (hasDnaPsychology ? 1 : 0)) / 2 * 100;

  return (
    <div className="min-h-screen bg-register-gradient relative overflow-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Progress Card */}
        <Card className=" mb-6 bg-[#F6F4F0] border border-[#A7A7A7] rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-geist bold text-gray-900">Progress Assessment</h2>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-geist text-gray-700">Kelengkapan Profil</span>
              <span className="font-geist bold text-[#75B2AB] text-lg">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#75B2AB] to-[#f6806d] h-4 rounded-full transition-all duration-1000 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className={`p-5 rounded-xl border transition-all duration-300 ${hasDnaSkill ? 'bg-white border-[#75B2AB] shadow-lg' : 'bg-white border-[#A7A7A7]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-geist bold text-lg text-gray-900">DNA Skill</h3>
                  <p className="text-sm font-geist mono text-gray-600 mt-1 flex items-center gap-2">
                    {hasDnaSkill ? (
                      <><FaCheckCircle className="text-[#75B2AB]" /> Sudah dilengkapi</>
                    ) : (
                      <><FaClock className="text-gray-500" /> Belum dilengkapi</>
                    )}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasDnaSkill ? 'bg-[#75B2AB]' : 'bg-gray-300'}`}>
                  {hasDnaSkill ? <FaCheckCircle className="text-2xl text-white" /> : <FaClock className="text-2xl text-white" />}
                </div>
              </div>
            </div>
            <div className={`p-5 rounded-xl border transition-all duration-300 ${hasDnaPsychology ? 'bg-white border-[#75B2AB] shadow-lg' : 'bg-white border-[#A7A7A7]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-geist bold text-lg text-gray-900">DNA Psikologi</h3>
                  <p className="text-sm font-geist mono text-gray-600 mt-1 flex items-center gap-2">
                    {hasDnaPsychology ? (
                      <><FaCheckCircle className="text-[#75B2AB]" /> Sudah dilengkapi</>
                    ) : (
                      <><FaClock className="text-gray-500" /> Belum dilengkapi</>
                    )}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasDnaPsychology ? 'bg-[#75B2AB]' : 'bg-gray-300'}`}>
                  {hasDnaPsychology ? <FaCheckCircle className="text-2xl text-white" /> : <FaClock className="text-2xl text-white" />}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:scale-105 transition-transform duration-300 bg-[#F6F4F0] border border-[#A7A7A7] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
                <FaDna className="text-3xl text-[#f6806d]" />
              <h3 className="text-xl font-geist bold text-gray-900">DNA Assessment</h3>
            </div>
            <p className="text-sm font-geist mono text-gray-600 mb-4 leading-relaxed">
              Lengkapi profil DNA skill dan psikologi Anda untuk mendapatkan rekomendasi terbaik
            </p>
            <Link href="/dna">
              <Button className="w-full flex items-center justify-center gap-2 bg-[#f6806d] hover:bg-[#f46a54] rounded-xl">
                {hasDnaSkill && hasDnaPsychology ? (
                  <><FaChartLine /> Lihat Hasil</>
                ) : (
                  <><FaDna /> Mulai Assessment</>
                )}
              </Button>
            </Link>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 bg-[#F6F4F0] border border-[#A7A7A7] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
                <BiTargetLock className="text-3xl text-[#f6806d]" />
              <h3 className="text-xl font-geist bold text-gray-900">Matching Jurusan</h3>
            </div>
            <p className="text-sm font-geist mono text-gray-600 mb-4 leading-relaxed">
              Temukan jurusan yang cocok dengan profil unik Anda melalui AI matching
            </p>
            <Link href="/major-matching">
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-[#f6806d] hover:bg-[#f46a54] rounded-xl"
                disabled={!hasDnaSkill || !hasDnaPsychology}
              >
                <BiTargetLock /> Mulai Matching
              </Button>
            </Link>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 bg-[#F6F4F0] border border-[#A7A7A7] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
                <HiDocumentText className="text-3xl text-[#f6806d]" />
              <h3 className="text-xl font-geist bold text-gray-900">Modul Adaptif</h3>
            </div>
            <p className="text-sm font-geist mono text-gray-600 mb-4 leading-relaxed">
              Akses modul pembelajaran adaptif untuk persiapan kuliah yang optimal
            </p>
            <Link href="/modules">
              <Button 
                className="w-full flex items-center justify-center gap-2 bg-[#f6806d] hover:bg-[#f46a54] rounded-xl"
                disabled={!hasDnaSkill || !hasDnaPsychology}
              >
                <HiDocumentText /> Lihat Modul
              </Button>
            </Link>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-[#F6F4F0] border border-[#A7A7A7] rounded-xl hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
                <MdSchool className="text-3xl text-[#f6806d]" />
              <h3 className="text-xl font-geist bold text-gray-900">Minimum Keilmuan</h3>
            </div>
            <p className="text-sm font-geist mono text-gray-600 mb-4 leading-relaxed">
              Pelajari persyaratan minimum untuk jurusan pilihan Anda
            </p>
            <Link href="/minimum-keilmuan">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-xl border-[#A7A7A7]">
                <MdSchool /> Lihat Detail
              </Button>
            </Link>
          </Card>

          <Card className="bg-[#F6F4F0] border border-[#A7A7A7] rounded-xl hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-3">
                <FaUserGraduate className="text-2xl text-[#f6806d]" />
              <h3 className="text-xl font-geist bold text-gray-900">Simulator</h3>
            </div>
            <p className="text-sm font-geist mono text-gray-600 mb-4 leading-relaxed">
              Coba simulasi tugas kuliah sesuai jurusan pilihan
            </p>
            <Link href="/simulator">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-xl border-[#A7A7A7]">
                <FaUserGraduate /> Mulai Simulasi
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
