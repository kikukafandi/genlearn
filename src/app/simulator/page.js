'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { FaUserGraduate, FaCheckCircle, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';

function SimulatorContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="min-h-screen bg-register-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
              <FaUserGraduate className="text-3xl text-white" />
            </div>
            <p className="font-geist mono text-gray-600">Loading simulator...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-register-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card className="rounded-3xl">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <span className="text-3xl">🤔</span>
              </div>
              <p className="font-geist mono text-gray-700 mb-4 text-lg">Belum ada task tersedia</p>
              <Button onClick={() => router.push('/major-matching')} className="bg-[#f6806d] hover:bg-[#f46a54] rounded-full font-geist bold px-8">
                🎯 Pilih Jurusan Dulu
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-register-gradient">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-3xl">🎮</span>
            </div>
            <div>
              <h1 className="text-4xl font-geist bold text-teal-800">Simulator Tugas Kuliah</h1>
              <p className="font-geist mono text-gray-600 mt-1 text-lg">
                Coba simulasi tugas yang biasa diberikan di jurusan {task.majorName}
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6 rounded-3xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#75B2AB] to-teal-400 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h2 className="text-3xl font-geist bold text-teal-800 mb-2">{task.majorName}</h2>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#75B2AB] to-[#8b5cf6] text-white rounded-full text-sm font-geist bold shadow-lg">
                  {task.difficulty}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="text-2xl font-geist bold text-teal-800">Tugas</h3>
            </div>
            <div className="bg-white border border-[#75B2AB] rounded-xl p-6 shadow-lg">
              <p className="font-geist mono text-gray-900 text-lg leading-relaxed">{task.taskDescription}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-2xl font-geist bold text-teal-800">Objektif</h3>
            </div>
            <ul className="space-y-3">
              {task.objectives.map((objective, index) => (
                <li key={index} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-[#75B2AB] mr-3 font-bold text-xl">•</span>
                  <span className="font-geist mono text-gray-700 flex-1">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">💡</span>
              </div>
              <h3 className="text-2xl font-geist bold text-teal-800">Panduan</h3>
            </div>
            <ul className="space-y-3">
              {task.guidelines.map((guideline, index) => (
                <li key={index} className="flex items-start p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-[#75B2AB] mr-3 font-bold text-xl">✓</span>
                  <span className="font-geist mono text-gray-700 flex-1">{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {task.tools && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">🛠️</span>
                </div>
                <h3 className="text-2xl font-geist bold text-teal-800">Tools yang Bisa Digunakan</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {task.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-5 py-3 bg-white text-teal-700 rounded-full font-geist bold shadow-md border border-[#75B2AB]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!completed ? (
            <div className="bg-white border border-[#f6806d] rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f6806d] to-[#f46a54] rounded-full flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
                <h3 className="font-geist bold text-teal-800 text-lg">Waktu Pengerjaan</h3>
              </div>
              <p className="font-geist mono text-gray-800 mb-4 text-lg">
                Estimasi waktu: <span className="font-geist bold text-[#f6806d]">{task.estimatedTime}</span>
              </p>
              <p className="text-sm font-geist mono text-gray-700 leading-relaxed">
                Setelah Anda selesai mengerjakan tugas ini (bisa di kertas, software, atau aplikasi lain), 
                klik tombol di bawah untuk melihat feedback.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#75B2AB] rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#75B2AB] to-[#06b6d4] rounded-full flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
                <h3 className="font-geist bold text-gray-900 text-lg">Tugas Selesai!</h3>
              </div>
              <p className="font-geist mono text-gray-800 mb-4 leading-relaxed">
                <span className="font-geist bold text-[#75B2AB]">Feedback: </span>
                {feedback}
              </p>
              <p className="font-geist mono text-gray-800 leading-relaxed">
                {task.nextSteps}
              </p>
            </div>
          )}

          {!completed ? (
            <Button onClick={handleComplete} className="w-full text-lg py-4 bg-[#f6806d] hover:bg-[#f46a54] rounded-full font-geist bold">
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
                className="flex-1 rounded-full border-[#75B2AB] text-teal-800 font-geist bold"
              >
                🔄 Coba Lagi
              </Button>
              <Button 
                onClick={() => router.push('/modules')}
                className="flex-1 bg-[#f6806d] hover:bg-[#f46a54] rounded-full font-geist bold"
              >
                📚 Lihat Modul Pembelajaran
              </Button>
            </div>
          )}
        </Card>

        <Card className="bg-[#F6F4F0] border border-[#8b5cf6] rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-xl font-geist bold text-teal-800">Tips Mengerjakan</h3>
          </div>
          <ul className="space-y-3 font-geist mono text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-[#8b5cf6] font-bold mt-1">•</span>
              <span>Baca instruksi dengan teliti sebelum memulai</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b5cf6] font-bold mt-1">•</span>
              <span>Buat draft atau outline terlebih dahulu</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b5cf6] font-bold mt-1">•</span>
              <span>Jangan takut mencoba dan bereksperimen</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b5cf6] font-bold mt-1">•</span>
              <span>Manfaatkan sumber belajar online jika perlu</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b5cf6] font-bold mt-1">•</span>
              <span>Review hasil pekerjaan sebelum submit</span>
            </li>
          </ul>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={() => router.push('/minimum-keilmuan')} 
            variant="outline"
            className="rounded-full border-[#75B2AB] text-teal-800 font-geist bold px-8"
          >
            📖 Lihat Minimum Keilmuan
          </Button>
          <Button onClick={() => router.push('/dashboard')} className="bg-[#f6806d] hover:bg-[#f46a54] rounded-full font-geist bold px-8">
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse-glow">
            <span className="text-3xl">🎮</span>
          </div>
          <p className="font-geist mono text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SimulatorContent />
    </Suspense>
  );
}
