'use client';

import Link from "next/link";
import Button from "@/components/Button";
import { HiBeaker } from 'react-icons/hi2';
import { FaDna, FaRocket, FaChartLine } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import { MdPsychology } from 'react-icons/md';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// Komponen Feature Card
function FeatureCard({ icon, title, description, colorClass }) {
  return (
    <div className="group relative p-8 rounded-xl bg-[#F6F4F0] border border-[#A7A7A7] shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`h-10`}>
        {icon}
      </div>
      <h3 className="text-2xl font-geist mb-3 text-gray-900">{title}</h3>
      <p className="text-sm  font-geist mono text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Komponen Bubble Cluster Visual Demo
function BubbleCluster() {
  return (
    <div className="relative w-full h-80 md:h-96 flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F6F4F0]/5 to-[#F6F4F0]/5 rounded-3xl" />
      
      {/* Bubble Utama - Skill */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 md:w-44 md:h-44 bg-gradient-to-br from-[#75B2AB] to-[#8b5cf6] rounded-full flex items-center justify-center shadow-2xl z-20 animate-pulse-glow">
        <span className="text-white font-geist bold text-lg md:text-xl">Skill</span>
      </div>
      
      {/* Bubble Sedang - Psikologi */}
      <div className="absolute right-[70%] top-[30%] w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] rounded-full flex items-center justify-center shadow-xl z-10 animate-float">
        <span className="text-white font-geist text-sm md:text-base">Psikologi</span>
      </div>
      
      {/* Bubble Kecil - Contoh Skills */}
      <div className="absolute right-[15%] top-[25%] w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full flex items-center justify-center shadow-lg z-10 animate-float" style={{animationDelay: '0.5s'}}>
        <span className="text-white font-geist text-xs">Komunikasi</span>
      </div>
      
      <div className="absolute left-[25%] bottom-[10%] w-16 w-16 md:w-20 md:h-20 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full flex items-center justify-center shadow-lg z-10 animate-float" style={{animationDelay: '1s'}}>
        <span className="text-white font-geist text-xs">Analitis</span>
      </div>
      
      <div className="absolute right-[20%] bottom-[25%] w-14 h-14 md:w-18 md:h-18 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center shadow-lg z-10 animate-float" style={{animationDelay: '1.5s'}}>
        <span className="text-white font-geist text-xs">Kreatif</span>
      </div>
      
      {/* Connecting Lines (decorative) */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-20" viewBox="0 0 400 300">
        <line x1="200" y1="150" x2="80" y2="90" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="200" y1="150" x2="320" y2="75" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="200" y1="150" x2="100" y2="240" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="200" y1="150" x2="320" y2="225" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5,5" />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#75B2AB" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Home() {
  const { status } = useSession();
  const heroBackground = 'bg-white';
  const contentBackground = 'bg-white';
  const heroTextColor = 'text-gray-900';
  const heroSubColor = 'text-gray-600';
  
  return (
    <div className="min-h-screen font-sans">
      <div className={`${heroBackground} hero-layer-blur transition-colors duration-500`}>
        <div className="hero-layer-content min-h-[778px] flex flex-col">
        <header className="flex justify-center px-4 pt-10">
          <div
            className="w-full max-w-4xl flex items-center gap-4 rounded-full border px-6 py-3 shadow-xl bg-white/90 border-white/80 text-gray-700"
          >
            <div className="flex items-center gap-3">
              <Image src="/logotr.svg" alt="Logo" width={30} height={30} />
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm font-geist">
              {status === 'authenticated' ? (
                <Link href="/dashboard">
                  <span className="px-4 py-2 rounded-full bg-[#f6806d] text-white font-semibold shadow-lg hover:bg-[#f46a54] transition-colors">
                    Dashboard
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="transition-colors text-gray-600 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/register">
                    <span className="px-4 py-2 rounded-full bg-[#f6806d] text-white font-semibold shadow-lg hover:bg-[#f46a54] transition-colors">
                      Get Started
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="w-full flex justify-start">
              <BubbleCluster />
            </div>
            <div className="relative">
               <h1
                className={`text-4xl sm:text-5xl md:text-6xl font-geist bold leading-tight ${heroTextColor}`}
              >
                Discover Your
                <span
                  className="block text-teal-600"
                >
                  Skill DNA
                </span>
              </h1>
              <p className={`text-md font-geist mono  max-w-2xl mt-6 ${heroSubColor}`}>
                Map your skills like never before. AI-powered genome analysis reveals
                your career potential, hidden strengths, and personalized learning
                journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href={status === 'authenticated' ? "/dashboard" : "/auth/register"}>
                  <button className="px-8 py-3 rounded-xl bg-[#f6806d] text-white font-geist bold shadow-lg hover:bg-[#f46a54] transition-transform hover:-translate-y-0.5">
                    {status === 'authenticated' ? 'Dashboard' : 'Start Mapping'}
                  </button>
                </Link>
                <Link href="#how-it-works">
                  <button
                    className="px-8 py-3 rounded-xl border font-geist bold transition-colors border-gray-300 text-gray-800 bg-white hover:bg-gray-50"
                  >
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>

      <main
        className={`relative overflow-hidden transition-colors duration-500 ${contentBackground}`}
      >
      {/* ============ SECTION: PENJELASAN SINGKAT (4 CARDS) ============ */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 ">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-geist bold mb-4 tracking-tight text-gray-900">
            Bagaimana GenLearn Bekerja?
          </h2>
          <p className="text-sm font-geist mono max-w-2xl mx-auto text-gray-600">
            Platform pembelajaran adaptif yang menganalisis potensimu secara menyeluruh
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<FaDna className="text-3xl text-[#f6806d] " />}
            title="DNA Skill Mapping"
            description="Identifikasi kekuatan skill dan bakat alami kamu melalui assessment berbasis neuroscience"
          />
          <FeatureCard
            icon={<MdPsychology className="text-3xl text-[#f6806d]" />}
            title="DNA Psikologis"
            description="Analisis kepribadian, minat, dan gaya belajar untuk memahami karaktermu lebih dalam"
          />
          <FeatureCard
            icon={<BiTargetLock className="text-3xl text-[#f6806d]" />}
            title="Major Matching"
            description="Algoritma AI mencocokkan profilmu dengan jurusan kuliah yang paling sesuai"
          />
          <FeatureCard
            icon={<FaChartLine className="text-3xl text-[#f6806d]" />}
            title="Learning Blueprint"
            description="Rencana belajar adaptif yang disesuaikan dengan kecepatan dan gaya belajarmu"
          />
        </div>
      </section>

      {/* ============ SECTION: BUBBLE VISUAL DEMO ============ */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-geist bold mb-4 tracking-tight text-gray-900">
            Visualisasi DNA Belajarmu
          </h2>
          <p className="text-sm font-geist mono max-w-3xl mx-auto text-gray-600">
            Lihat bagaimana skill dan psikologimu saling terhubung membentuk profil unik
          </p>
        </div>
        
        <BubbleCluster />
      </section>

      {/* ============ SECTION: KENAPA GENLEARN BERBEDA ============ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-geist bold mb-6 tracking-tight text-gray-900">
              Kenapa GenLearn <span className="bg-[#f6806d] bg-clip-text text-transparent">Berbeda?</span>
            </h2>
            
            <div className="space-y-5">
              {[
                { title: 'Personal', desc: 'Setiap rekomendasi disesuaikan dengan profil unik setiap siswa' },
                { title: 'Adaptif', desc: 'Sistem belajar yang menyesuaikan dengan kecepatan pemahamanmu' },
                { title: 'Presisi', desc: 'Algoritma AI dengan akurasi tinggi dalam mencocokkan jurusan' },
                { title: 'Berbasis Data', desc: 'Metodologi berdasarkan riset neuroscience dan psikologi kognitif' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-3 h-3 mt-2 rounded-full bg-[#f6806d] flex-shrink-0" />
                  <div>
                    <h4 className="font-geist text-lg text-gray-900">{item.title}</h4>
                    <p className="text-sm font-geist mono text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Bubble Decoration */}
          <div className="relative h-80 lg:h-96 flex items-center justify-center">
            {/* Main bubble */}
            <div className="absolute w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-[#75B2AB] to-[#8b5cf6] rounded-full opacity-80 shadow-2xl flex items-center justify-center">
              <HiBeaker className="text-6xl text-white/80" />
            </div>
            {/* Orbiting bubbles */}
            <div className="absolute w-20 h-20 bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] rounded-full top-5 right-10 opacity-70 animate-float" />
            <div className="absolute w-16 h-16 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full bottom-10 left-5 opacity-70 animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute w-12 h-12 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full top-1/4 left-10 opacity-60 animate-float" style={{animationDelay: '2s'}} />
            <div className="absolute w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full bottom-1/4 right-5 opacity-60 animate-float" style={{animationDelay: '0.5s'}} />
            {/* Glow effect */}
            <div className="absolute w-72 h-72 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION (CLOSING) ============ */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden border-2 border-[#A7A7A7] bg-gradient-to-r from-[#614AFC]/10 via-[#008F89]/10 to-[#F45000]/10">
          {/* Decorative bubbles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" /> 
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full" />
          
          <h2 className="text-3xl md:text-4xl font-geist bold text-gray-900 mb-6 tracking-tight relative z-10">
            Ready to unlock your potential?
          </h2>
          <p className="text-lg text-gray-700 mb-8 font-geist mono max-w-xl mx-auto relative z-10">
           Join thousands mapping their skill genome and accelerating their careers with AI-powered insights.          </p>
          <Link href={status === 'authenticated' ? "/dashboard" : "/auth/register"}>
            <Button className="text-base px-10 py-4 bg-[#f6806d] text-white hover:bg-[#f46a54] shadow-xl font-geist bold relative z-10">
              {status === 'authenticated' ? 'Dashboard' : 'Daftar Sekarang'}
            </Button>
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative z-10 border-t py-8 mt-10 bg-white/50 border-gray-200 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-medium text-gray-600">
            © 2025 GenLearn - Platform Pembelajaran Adaptif Berbasis AI
          </p>
        </div>
      </footer>
      </main>
    </div>
  );
}
