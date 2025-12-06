'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { HiBeaker } from 'react-icons/hi2';
import { FaUserPlus, FaTimesCircle } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registrasi gagal');
      }

      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
    }`}>
      {/* Bubble Background Elements */}
      <div className={`absolute top-10 right-10 w-48 h-48 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float ${
        theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
      }`}></div>
      <div className={`absolute bottom-10 left-10 w-56 h-56 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float ${
        theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
      }`} style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mx-auto animate-pulse-glow">
              <HiBeaker className="text-4xl text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">GenLearn</h1>
          <h2 className={`text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          }`}>Buat Akun Baru</h2>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
          }`}>Bergabunglah dan temukan jurusan ideal Anda</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-2xl">
                <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                  <FaTimesCircle />
                  {error}
                </p>
              </div>
            )}

            <Input
              label="Nama Lengkap"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <FaUserPlus />
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors">
                Login di sini
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
