'use client';

import Link from "next/link";
import Button from "@/components/Button";
import { useTheme } from '@/contexts/ThemeContext';
import { HiBeaker } from 'react-icons/hi2';
import { FaDna, FaRocket, FaUserGraduate, FaBook } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { BiTargetLock } from 'react-icons/bi';

export default function Home() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
    }`}>
      {/* Bubble Background Elements */}
      <div className={`absolute top-20 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
      }`}></div>
      <div className={`absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
      }`} style={{animationDelay: '1s'}}></div>
      <div className={`absolute -bottom-20 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
        theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'
      }`} style={{animationDelay: '2s'}}></div>
      
      <nav className={`backdrop-blur-lg shadow-xl border-b sticky top-0 z-50 ${
        theme === 'dark' 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <HiBeaker className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GenLearn</h1>
            </div>
            <div className="space-x-3">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Daftar Sekarang</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-6 animate-bubble-pop">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mx-auto animate-pulse-glow">
              <GiBrain className="text-5xl text-white" />
            </div>
          </div>
          <h1 className={`text-6xl font-extrabold mb-6 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Temukan <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Jurusan Ideal</span> Anda
          </h1>
          <p className={`text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Platform pembelajaran adaptif berbasis <span className="font-semibold text-blue-400">neuroscience</span> yang menganalisis DNA skill dan psikologi Anda
            untuk merekomendasikan jurusan kuliah yang paling cocok
          </p>
          <Link href="/auth/register">
            <Button className="text-lg px-10 py-4 shadow-2xl flex items-center gap-3 mx-auto">
              <FaRocket className="text-xl" />
              Mulai Sekarang Gratis
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className={`backdrop-blur-sm p-8 rounded-3xl shadow-xl border hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700'
              : 'bg-white/80 border-gray-100'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-5 shadow-lg">
              <FaDna className="text-4xl text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>DNA Assessment</h3>
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Identifikasi skill, minat, dan karakter psikologi Anda melalui assessment komprehensif berbasis cognitive mapping
            </p>
          </div>

          <div className={`backdrop-blur-sm p-8 rounded-3xl shadow-xl border hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700'
              : 'bg-white/80 border-gray-100'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-5 shadow-lg">
              <BiTargetLock className="text-4xl text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Major Matching</h3>
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Dapatkan rekomendasi jurusan yang paling sesuai dengan profil unik Anda melalui algoritma AI adaptif
            </p>
          </div>

          <div className={`backdrop-blur-sm p-8 rounded-3xl shadow-xl border hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
            theme === 'dark'
              ? 'bg-gray-800/80 border-gray-700'
              : 'bg-white/80 border-gray-100'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mb-5 shadow-lg">
              <FaBook className="text-4xl text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Modul Adaptif</h3>
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Akses materi pembelajaran yang disesuaikan dengan gaya belajar dan kecepatan pemahaman Anda
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Kenapa GenLearn?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4">
                  🔬
                </div>
                <h3 className="font-bold text-xl mb-2">Berbasis Sains</h3>
                <p className="text-blue-100">Metode assessment berdasarkan riset neuroscience dan psikologi kognitif</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4">
                  🎓
                </div>
                <h3 className="font-bold text-xl mb-2">Akademis & Profesional</h3>
                <p className="text-blue-100">Dirancang oleh para ahli pendidikan dan psikolog berpengalaman</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4">
                  💡
                </div>
                <h3 className="font-bold text-xl mb-2">Personalisasi Penuh</h3>
                <p className="text-blue-100">Setiap rekomendasi disesuaikan dengan profil unik setiap siswa</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-lg border-t border-gray-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="font-medium">© 2025 GenLearn - Platform Pembelajaran Adaptif Berbasis AI</p>
        </div>
      </footer>
    </div>
  );
}
