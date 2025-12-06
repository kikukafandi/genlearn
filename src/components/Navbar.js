'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';
import { HiBeaker } from 'react-icons/hi2';
import { MdDashboard, MdLogout, MdLogin } from 'react-icons/md';
import { FaDna, FaUserGraduate } from 'react-icons/fa';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl border-b border-white/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <HiBeaker className="text-2xl text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">GenLearn</span>
            </Link>
            {session && (
              <div className="hidden md:ml-10 md:flex md:space-x-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <MdDashboard className="text-lg" />
                  Dashboard
                </Link>
                <Link
                  href="/dna"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <FaDna className="text-lg" />
                  DNA Assessment
                </Link>
                <Link
                  href="/major-matching"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <FaUserGraduate className="text-lg" />
                  Matching Jurusan
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <BsMoonStarsFill className="w-5 h-5" />
              ) : (
                <BsSunFill className="w-5 h-5" />
              )}
            </button>
            
            {session ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-5 py-2 rounded-full text-sm font-semibold text-purple-600 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <MdLogout className="text-lg" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-5 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <MdLogin className="text-lg" />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 rounded-full text-sm font-semibold text-purple-600 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
