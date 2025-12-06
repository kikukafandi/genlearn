'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Loading simulator...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Card>
            <p className="text-gray-600 mb-4">Belum ada task tersedia</p>
            <Button onClick={() => router.push('/major-matching')}>
              Pilih Jurusan Dulu
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Simulator Tugas Kuliah</h1>
          <p className="text-gray-600 mt-2">
            Coba simulasi tugas yang biasa diberikan di jurusan {task.majorName}
          </p>
        </div>

        <Card className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.majorName}</h2>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {task.difficulty}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">📝 Tugas</h3>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <p className="text-gray-900 text-lg">{task.taskDescription}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">🎯 Objektif</h3>
            <ul className="space-y-2">
              {task.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">💡 Panduan</h3>
            <ul className="space-y-2">
              {task.guidelines.map((guideline, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-3">✓</span>
                  <span className="text-gray-700">{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {task.tools && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">🛠️ Tools yang Bisa Digunakan</h3>
              <div className="flex flex-wrap gap-2">
                {task.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!completed ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-yellow-900 mb-3">⏱️ Waktu Pengerjaan</h3>
              <p className="text-gray-700 mb-4">
                Estimasi waktu: <span className="font-bold">{task.estimatedTime}</span>
              </p>
              <p className="text-sm text-gray-600">
                Setelah Anda selesai mengerjakan tugas ini (bisa di kertas, software, atau aplikasi lain), 
                klik tombol di bawah untuk melihat feedback.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-green-900 mb-3">✅ Tugas Selesai!</h3>
              <p className="text-gray-700 mb-4">
                <span className="font-bold">Feedback: </span>
                {feedback}
              </p>
              <p className="text-gray-700">
                {task.nextSteps}
              </p>
            </div>
          )}

          {!completed ? (
            <Button onClick={handleComplete} className="w-full">
              Tandai Selesai & Lihat Feedback
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
                Coba Lagi
              </Button>
              <Button 
                onClick={() => router.push('/modules')}
                className="flex-1"
              >
                Lihat Modul Pembelajaran
              </Button>
            </div>
          )}
        </Card>

        <Card className="bg-indigo-50 border-2 border-indigo-200">
          <h3 className="text-lg font-bold mb-3">💪 Tips Mengerjakan</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Baca instruksi dengan teliti sebelum memulai</li>
            <li>• Buat draft atau outline terlebih dahulu</li>
            <li>• Jangan takut mencoba dan bereksperimen</li>
            <li>• Manfaatkan sumber belajar online jika perlu</li>
            <li>• Review hasil pekerjaan sebelum submit</li>
          </ul>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={() => router.push('/minimum-keilmuan')} 
            variant="outline"
          >
            Lihat Minimum Keilmuan
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <SimulatorContent />
    </Suspense>
  );
}
