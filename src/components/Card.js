'use client';

export default function Card({ children, className = '' }) {
  return (
    <div className={`w-auto rounded-xl shadow-xl p-6 border hover:shadow-xl transition-all duration-300 bg-[#F6F4F0] border-2 border-[#75B2AB] ${className}`}>
      {children}
    </div>
  );
}
