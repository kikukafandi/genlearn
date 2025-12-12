'use client';

import { useState, Suspense, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { HiBeaker } from 'react-icons/hi2';
import { MdLogin } from 'react-icons/md';
import { FaCheckCircle, FaTimesCircle, FaGoogle } from 'react-icons/fa';
import Image from 'next/image';


function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const registered = searchParams.get('registered');

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Gagal login dengan Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Don't render if authenticated (redirecting)
  if (status === 'authenticated') {
    return null;
  }

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
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-register-gradient'
      }`}
    >
        <div className="max-w-xl w-full mx-auto space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logotext.svg" alt="Logo" width={300} height={300} />
            </div>
          </div>
        <Card>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold font-geist text-gray-900">Log In</h2>
            <p className="text-sm font-geist mono text-gray-500">Let's Continue Exploring Your Potential</p>
          </div>

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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 font-geist mono bg-[#F6F4F0] text-gray-600 `}>or</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3"
          >
            <FaGoogle className="text-teal-500" />
            {googleLoading ? 'Menghubungkan...' : 'Login dengan Google'}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
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
