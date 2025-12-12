'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdLogout, MdLogin } from 'react-icons/md';
import { FaDna, FaUserGraduate } from 'react-icons/fa';
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: MdDashboard },
    { href: '/dna', label: 'DNA Assessment', icon: FaDna },
    { href: '/major-matching', label: 'Matching Jurusan', icon: FaUserGraduate },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-[#E8E1D5] bg-white/95 backdrop-blur-2xl shadow-[0_12px_40px_rgba(117,178,171,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-20">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logotext.svg"
                alt="GenLearn Logo"
                width={180}
                height={48}
                priority
                className="h-10 w-auto"
              />
            </Link>
            {session && (
              <div className="hidden md:flex items-center gap-2 rounded-full bg-teal-500 px-2 py-2 shadow-lg absolute left-1/2 -translate-x-1/2">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname?.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`px-4 py-2 rounded-full text-sm font-geist bold transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? 'bg-white text-teal-500 shadow-sm'
                          : 'text-white/90 hover:bg-white/20'
                      }`}
                    >
                      <Icon className="text-lg" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center space-x-3">
            {session ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full border border-[#E8E1D5] bg-white shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center text-white font-geist bold text-sm">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-geist mono text-gray-700">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-5 py-2 rounded-full text-sm font-geist bold text-[#f6806d] bg-white border border-[#F0EDEA] hover:bg-[#FFF8F6] transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <MdLogout className="text-lg" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-5 py-2 rounded-full text-sm font-geist bold text-gray-800 border border-transparent hover:border-[#75B2AB] hover:text-[#75B2AB] transition-all duration-300 flex items-center gap-2"
                >
                  <MdLogin className="text-lg" />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 rounded-full text-sm font-geist bold text-white bg-gradient-to-r from-[#f6806d] to-[#f46a54] hover:shadow-xl transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
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
