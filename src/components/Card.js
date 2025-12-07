'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function Card({ children, className = '' }) {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-3xl shadow-xl p-6 border hover:shadow-2xl transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-zinc-800 border-zinc-700' 
        : 'bg-white border-gray-100'
    } ${className}`}>
      {children}
    </div>
  );
}
