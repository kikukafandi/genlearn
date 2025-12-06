'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { HiBeaker } from 'react-icons/hi2';
import { MdLogin } from 'react-icons/md';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get('registered');

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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
      <div className={`absolute top-10 left-10 w-48 h-48 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float ${
        theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
      }`}></div>
      <div className={`absolute bottom-10 right-10 w-56 h-56 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float ${
        theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
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
          }`}>Login ke Akun Anda</h2>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
          }`}>Selamat datang kembali! Masuk untuk melanjutkan perjalanan Anda</p>
        </div>

        <Card>
          {registered && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl">
              <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                <FaCheckCircle />
                Registrasi berhasil! Silakan login.
              </p>
            </div>
          )}

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
              placeholder="Masukkan password"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <MdLogin />
              {loading ? 'Login...' : 'Login Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
