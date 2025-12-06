'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { FaUserGraduate, FaCheckCircle, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';

function SimulatorContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const majorId = searchParams.get('major');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (majorId) {
        fetchTask(majorId);
      } else {
        fetchTaskFromProfile();
      }
    }
  }, [status, router, majorId]);

  const fetchTask = async (id) => {
    try {
      const res = await fetch(`/api/simulator/task?majorId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskFromProfile = async () => {
    try {
      const res = await fetch('/api/simulator/task');
      if (res.ok) {
        const data = await res.json();
        setTask(data);
      } else {
        const error = await res.json();
        if (error.error?.includes('jurusan')) {
          alert('Silakan pilih jurusan terlebih dahulu');
          router.push('/major-matching');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    // Generate feedback based on major
    const feedbacks = [
      'Bagus! Anda menunjukkan pemahaman yang baik terhadap konsep dasar.',
      'Pendekatan yang Anda ambil menunjukkan kemampuan problem-solving yang kuat.',
      'Hasil yang memuaskan! Terus kembangkan skill ini untuk persiapan kuliah.',
      'Kerja yang baik! Anda siap untuk menghadapi tantangan serupa di perkuliahan.'
    ];
    setFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
  };

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100'
      }`}>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <FaUserGraduate className="text-3xl text-white" />
            </div>
            <p className={`font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Loading simulator...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <span className="text-3xl">🤔</span>
              </div>
              <p className="text-gray-600 mb-4 text-lg">Belum ada task tersedia</p>
              <Button onClick={() => router.push('/major-matching')}>
                🎯 Pilih Jurusan Dulu
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Bubble Background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-3xl">🎮</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Simulator Tugas Kuliah</h1>
              <p className="text-gray-600 mt-1 text-lg">
                Coba simulasi tugas yang biasa diberikan di jurusan {task.majorName}
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{task.majorName}</h2>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
                  {task.difficulty}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Tugas</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 shadow-lg">
              <p className="text-gray-900 text-lg leading-relaxed font-medium">{task.taskDescription}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Objektif</h3>
            </div>
            <ul className="space-y-3">
              {task.objectives.map((objective, index) => (
                <li key={index} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-blue-600 mr-3 font-bold text-xl">•</span>
                  <span className="text-gray-700 flex-1">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Panduan</h3>
            </div>
            <ul className="space-y-3">
              {task.guidelines.map((guideline, index) => (
                <li key={index} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-green-600 mr-3 font-bold text-xl">✓</span>
                  <span className="text-gray-700 flex-1">{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {task.tools && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">🛠️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Tools yang Bisa Digunakan</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {task.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full font-semibold shadow-md border border-gray-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!completed ? (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
                <h3 className="font-bold text-yellow-900 text-lg">Waktu Pengerjaan</h3>
              </div>
              <p className="text-gray-800 mb-4 text-lg">
                Estimasi waktu: <span className="font-bold text-orange-700">{task.estimatedTime}</span>
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Setelah Anda selesai mengerjakan tugas ini (bisa di kertas, software, atau aplikasi lain), 
                klik tombol di bawah untuk melihat feedback.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
                <h3 className="font-bold text-green-900 text-lg">Tugas Selesai!</h3>
              </div>
              <p className="text-gray-800 mb-4 leading-relaxed">
                <span className="font-bold text-green-800">Feedback: </span>
                {feedback}
              </p>
              <p className="text-gray-800 leading-relaxed">
                {task.nextSteps}
              </p>
            </div>
          )}

          {!completed ? (
            <Button onClick={handleComplete} className="w-full text-lg py-4">
              ✅ Tandai Selesai & Lihat Feedback
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button 
                onClick={() => {
                  setCompleted(false);
                  setFeedback('');
                }}
                variant="outline"
                className="flex-1"
              >
                🔄 Coba Lagi
              </Button>
              <Button 
                onClick={() => router.push('/modules')}
                className="flex-1"
              >
                📚 Lihat Modul Pembelajaran
              </Button>
            </div>
          )}
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tips Mengerjakan</h3>
          </div>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>Baca instruksi dengan teliti sebelum memulai</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>Buat draft atau outline terlebih dahulu</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>Jangan takut mencoba dan bereksperimen</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>Manfaatkan sumber belajar online jika perlu</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>Review hasil pekerjaan sebelum submit</span>
            </li>
          </ul>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={() => router.push('/minimum-keilmuan')} 
            variant="outline"
          >
            📖 Lihat Minimum Keilmuan
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            🏠 Kembali ke Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
            <span className="text-3xl">🎮</span>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <SimulatorContent />
    </Suspense>
  );
}
