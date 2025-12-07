'use client';

import Link from "next/link";
import Button from "@/components/Button";
import { useTheme } from '@/contexts/ThemeContext';
import { HiBeaker } from 'react-icons/hi2';
import { FaDna, FaRocket, FaChartLine } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { BiTargetLock } from 'react-icons/bi';
import { MdPsychology } from 'react-icons/md';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';

// Komponen Bubble Dekoratif
function BubbleDecor({ className = "" }) {
  return (
    <div className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float pointer-events-none ${className}`} />
  );
}

// Komponen Feature Card
function FeatureCard({ icon, title, description, colorClass, theme }) {
  return (
    <div className={`group relative p-8 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
      theme === 'dark'
        ? 'bg-zinc-900/80 border-zinc-700 hover:border-purple-500/50'
        : 'bg-white/90 border-gray-100 hover:border-indigo-300'
    }`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-lg ${colorClass}`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-3 tracking-tight ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>{title}</h3>
      <p className={`leading-relaxed text-sm ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>{description}</p>
    </div>
  );
}

// Komponen Bubble Cluster Visual Demo
function BubbleCluster({ theme }) {
  return (
    <div className="relative w-full h-80 md:h-96 flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl" />
      
      {/* Bubble Utama - Skill */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl z-20 animate-pulse-glow">
        <span className="text-white font-bold text-lg md:text-xl">Skill</span>
      </div>
      
      {/* Bubble Sedang - Psikologi */}
      <div className="absolute left-[20%] top-[30%] w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-xl z-10 animate-float">
        <span className="text-white font-semibold text-sm md:text-base">Psikologi</span>
      </div>
      
      {/* Bubble Kecil - Contoh Skills */}
      <div className="absolute right-[15%] top-[25%] w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-float" style={{animationDelay: '0.5s'}}>
        <span className="text-white font-medium text-xs">Komunikasi</span>
      </div>
      
      <div className="absolute left-[25%] bottom-[20%] w-14 h-14 md:w-18 md:h-18 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-float" style={{animationDelay: '1s'}}>
        <span className="text-white font-medium text-xs">Analitis</span>
      </div>
      
      <div className="absolute right-[20%] bottom-[25%] w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-float" style={{animationDelay: '1.5s'}}>
        <span className="text-white font-medium text-xs">Kreatif</span>
      </div>
      
      {/* Connecting Lines (decorative) */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-30" viewBox="0 0 400 300">
        <line x1="200" y1="150" x2="80" y2="90" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="200" y1="150" x2="320" y2="75" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="200" y1="150" x2="100" y2="240" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="200" y1="150" x2="320" y2="225" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Home() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen relative overflow-hidden font-sans transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* ============ BUBBLE BACKGROUND ELEMENTS ============ */}
      <BubbleDecor className={`top-10 left-10 w-72 h-72 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-300'}`} />
      <BubbleDecor className={`top-1/3 right-10 w-96 h-96 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`} />
      <BubbleDecor className={`bottom-20 left-1/4 w-80 h-80 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'}`} />
      <BubbleDecor className={`top-2/3 right-1/3 w-64 h-64 ${theme === 'dark' ? 'bg-violet-600' : 'bg-violet-300'}`} />
      
      {/* ============ NAVBAR ============ */}
      <nav className={`backdrop-blur-xl shadow-lg border-b sticky top-0 z-50 ${
        theme === 'dark' 
          ? 'bg-gray-950/80 border-gray-800' 
          : 'bg-white/80 border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <HiBeaker className="text-xl text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">GenLearn</span>
            </div>
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark';
                  document.documentElement.classList.toggle('dark', newTheme === 'dark');
                  localStorage.setItem('theme', newTheme);
                  window.location.reload();
                }}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <BsSunFill className="text-lg" /> : <BsMoonStarsFill className="text-lg" />}
              </button>
              <Link href="/auth/login">
                <Button variant="outline" className="text-sm px-5 py-2">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="text-sm px-5 py-2">Daftar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Icon Hero */}
          <div className="inline-block mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mx-auto animate-pulse-glow">
              <GiBrain className="text-4xl md:text-5xl text-white" />
            </div>
          </div>
          
          {/* Headline */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Temukan Jurusan Ideal<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Berdasarkan DNA Belajarmu
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Analisis <span className="font-semibold text-indigo-500">DNA Skill</span> + <span className="font-semibold text-purple-500">DNA Psikologis</span> untuk memberikan rekomendasi jurusan kuliah yang paling cocok dengan potensi unikmu.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register">
              <Button className="text-base px-8 py-4 shadow-xl flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <FaRocket className="text-lg" />
                Mulai Sekarang Gratis
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" className="text-base px-8 py-4">
                Pelajari Cara Kerja GenLearn
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SECTION: PENJELASAN SINGKAT (4 CARDS) ============ */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Bagaimana GenLearn Bekerja?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Platform pembelajaran adaptif yang menganalisis potensimu secara menyeluruh
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<FaDna className="text-3xl text-white" />}
            title="DNA Skill Mapping"
            description="Identifikasi kekuatan skill dan bakat alami kamu melalui assessment berbasis neuroscience"
            colorClass="bg-gradient-to-br from-indigo-500 to-blue-600"
            theme={theme}
          />
          <FeatureCard
            icon={<MdPsychology className="text-3xl text-white" />}
            title="DNA Psikologis"
            description="Analisis kepribadian, minat, dan gaya belajar untuk memahami karaktermu lebih dalam"
            colorClass="bg-gradient-to-br from-purple-500 to-pink-600"
            theme={theme}
          />
          <FeatureCard
            icon={<BiTargetLock className="text-3xl text-white" />}
            title="Major Matching"
            description="Algoritma AI mencocokkan profilmu dengan jurusan kuliah yang paling sesuai"
            colorClass="bg-gradient-to-br from-cyan-500 to-teal-600"
            theme={theme}
          />
          <FeatureCard
            icon={<FaChartLine className="text-3xl text-white" />}
            title="Learning Blueprint"
            description="Rencana belajar adaptif yang disesuaikan dengan kecepatan dan gaya belajarmu"
            colorClass="bg-gradient-to-br from-orange-500 to-amber-600"
            theme={theme}
          />
        </div>
      </section>

      {/* ============ SECTION: BUBBLE VISUAL DEMO ============ */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Visualisasi DNA Belajarmu
          </h2>
          <p className={`text-lg max-w-xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Lihat bagaimana skill dan psikologimu saling terhubung membentuk profil unik
          </p>
        </div>
        
        <BubbleCluster theme={theme} />
      </section>

      {/* ============ SECTION: KENAPA GENLEARN BERBEDA ============ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Kenapa GenLearn <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Berbeda?</span>
            </h2>
            
            <div className="space-y-5">
              {[
                { title: 'Personal', desc: 'Setiap rekomendasi disesuaikan dengan profil unik setiap siswa' },
                { title: 'Adaptif', desc: 'Sistem belajar yang menyesuaikan dengan kecepatan pemahamanmu' },
                { title: 'Presisi', desc: 'Algoritma AI dengan akurasi tinggi dalam mencocokkan jurusan' },
                { title: 'Berbasis Data', desc: 'Metodologi berdasarkan riset neuroscience dan psikologi kognitif' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Bubble Decoration */}
          <div className="relative h-80 lg:h-96 flex items-center justify-center">
            {/* Main bubble */}
            <div className="absolute w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-80 shadow-2xl flex items-center justify-center">
              <HiBeaker className="text-6xl text-white/80" />
            </div>
            {/* Orbiting bubbles */}
            <div className="absolute w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full top-5 right-10 opacity-70 animate-float" />
            <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full bottom-10 left-5 opacity-70 animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full top-1/4 left-10 opacity-60 animate-float" style={{animationDelay: '2s'}} />
            <div className="absolute w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full bottom-1/4 right-5 opacity-60 animate-float" style={{animationDelay: '0.5s'}} />
            {/* Glow effect */}
            <div className="absolute w-72 h-72 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION (CLOSING) ============ */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className={`relative rounded-3xl p-10 md:p-16 text-center overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-indigo-900 to-purple-900'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
        }`}>
          {/* Decorative bubbles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight relative z-10">
            Mulai perjalanan akademismu hari ini.
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto relative z-10">
            Bergabung dengan ribuan siswa yang telah menemukan jurusan ideal mereka bersama GenLearn
          </p>
          <Link href="/auth/register">
            <Button className="text-base px-10 py-4 bg-white text-indigo-700 hover:bg-gray-100 shadow-xl font-semibold relative z-10">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className={`relative z-10 border-t py-8 mt-10 ${
        theme === 'dark'
          ? 'bg-gray-950/50 border-gray-800 backdrop-blur-lg'
          : 'bg-white/50 border-gray-200 backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 GenLearn - Platform Pembelajaran Adaptif Berbasis AI
          </p>
        </div>
      </footer>
    </div>
  );
}
