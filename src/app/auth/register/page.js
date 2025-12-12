'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { HiBeaker } from 'react-icons/hi2';
import { FaUserPlus, FaTimesCircle, FaGoogle } from 'react-icons/fa';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Gagal daftar dengan Google');
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
      if (formData.password !== formData.confirmPassword) {
        setError('Password dan konfirmasi password tidak sama');
        setLoading(false);
        return;
      }

      const { name, email, password } = formData;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
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

        <Card className="w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold font-geist text-gray-900">Create Account</h2>
            <p className="text-sm font-geist mono text-gray-500">Start mapping your skill genome</p>
          </div>
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

            <Input
              label="Konfirmasi Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-teal hover:bg-teal-700"
            >
              <FaUserPlus />
              {loading ? 'Mendaftar...' : 'Create Account'}
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

          {/* Google Signup Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3"
          >
            <FaGoogle className="text-teal-500" />
            {googleLoading ? 'Menghubungkan...' : 'Daftar dengan Google'}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link
                href="/auth/login"
                className="text-teal-700 hover:text-teal-800 font-semibold transition-colors"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
