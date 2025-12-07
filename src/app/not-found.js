'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Button from '@/components/Button';
import { FaDna, FaHome, FaFlask } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { HiBeaker } from 'react-icons/hi2';

export default function NotFound() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Bubble Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating bubbles */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full filter blur-3xl animate-float opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-float opacity-25" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-400/20 rounded-full filter blur-2xl animate-float opacity-20" style={{ animationDelay: '2s' }} />
        
        {/* Smaller accent bubbles */}
        <div className="absolute top-20 right-20 w-24 h-24 bg-cyan-300/30 rounded-full filter blur-xl animate-pulse opacity-40" />
        <div className="absolute bottom-32 left-16 w-32 h-32 bg-purple-400/25 rounded-full filter blur-xl animate-pulse opacity-35" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 left-10 w-20 h-20 bg-indigo-400/30 rounded-full filter blur-lg animate-float opacity-30" style={{ animationDelay: '1.5s' }} />
        
        {/* DNA-like decorative elements - small circles in helix pattern */}
        <div className="absolute top-1/4 right-10 flex flex-col gap-4">
          <div className="w-3 h-3 bg-cyan-400/50 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse ml-4" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-cyan-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse ml-4" style={{ animationDelay: '0.6s' }} />
          <div className="w-3 h-3 bg-cyan-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
        </div>
        
        <div className="absolute bottom-1/4 left-8 flex flex-col gap-4">
          <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-cyan-400/50 rounded-full animate-pulse ml-4" style={{ animationDelay: '0.3s' }} />
          <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-3 h-3 bg-cyan-400/50 rounded-full animate-pulse ml-4" style={{ animationDelay: '0.7s' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Floating Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 w-28 h-28 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full filter blur-xl opacity-50 animate-pulse" />
            {/* Icon container */}
            <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center shadow-2xl border border-white/10">
              <HiBeaker className="text-5xl text-white/90" />
            </div>
            {/* Orbiting bubbles */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400/60 rounded-full animate-bounce filter blur-[1px]" style={{ animationDuration: '2s' }} />
            <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-purple-400/60 rounded-full animate-bounce filter blur-[1px]" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* 404 Text with Glow Effect */}
        <h1 
          className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 mb-4"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(120, 200, 255, 0.45)) drop-shadow(0 0 60px rgba(167, 139, 250, 0.3))',
          }}
        >
          404
        </h1>

        {/* Subtitle */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-md mx-auto">
            Sepertinya kamu keluar dari jalur akademis. 
            <br className="hidden md:block" />
            Halaman yang kamu cari tidak ada di dalam laboratorium kami.
          </p>
        </div>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-cyan-400/50 rounded-full" />
          <FaDna className="text-cyan-400/60 text-xl animate-spin" style={{ animationDuration: '8s' }} />
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-purple-400/50 rounded-full" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {session ? (
            <Link href="/dashboard">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden">
                {/* Button glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
                <MdDashboard className="text-xl relative z-10" />
                <span className="relative z-10">Kembali ke Dashboard</span>
              </button>
            </Link>
          ) : (
            <Link href="/">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden">
                {/* Button glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
                <FaHome className="text-xl relative z-10" />
                <span className="relative z-10">Kembali ke Beranda</span>
              </button>
            </Link>
          )}

          <Link href="/dna">
            <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white/80 font-semibold rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300 hover:scale-105 flex items-center gap-3">
              <FaFlask className="text-lg" />
              <span>Mulai Assessment DNA</span>
            </button>
          </Link>
        </div>

        {/* Additional Helper Text */}
        <p className="mt-10 text-sm text-white/40">
          Butuh bantuan? Coba kembali ke halaman utama atau mulai perjalanan akademis baru.
        </p>

        {/* Bottom Bubble Cluster */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-30">
          <div className="w-8 h-8 bg-cyan-400/40 rounded-full filter blur-sm animate-float" />
          <div className="w-12 h-12 bg-purple-400/40 rounded-full filter blur-sm animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="w-6 h-6 bg-blue-400/40 rounded-full filter blur-sm animate-float" style={{ animationDelay: '1s' }} />
          <div className="w-10 h-10 bg-indigo-400/40 rounded-full filter blur-sm animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="w-7 h-7 bg-cyan-400/40 rounded-full filter blur-sm animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Subtle grid overlay for futuristic feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
