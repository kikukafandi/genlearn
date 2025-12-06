'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function MajorMatchingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchMatches();
    }
  }, [status, router]);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/major/match');
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      } else {
        const error = await res.json();
        if (error.error?.includes('DNA')) {
          router.push('/dna');
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMajor = async (majorId) => {
    try {
      const res = await fetch('/api/major/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ majorId })
      });

      if (res.ok) {
        setSelectedMajor(majorId);
        alert('Jurusan berhasil dipilih!');
      }
    } catch (error) {
      console.error('Error selecting major:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const top3Matches = matches.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matching Jurusan</h1>
          <p className="text-gray-600 mt-2">
            Berikut adalah 3 jurusan yang paling cocok dengan profil DNA Anda
          </p>
        </div>

        {top3Matches.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600">
              Belum ada hasil matching. Silakan lengkapi DNA Assessment terlebih dahulu.
            </p>
            <Button onClick={() => router.push('/dna')} className="mt-4 mx-auto">
              Ke DNA Assessment
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {top3Matches.map((match, index) => (
              <Card key={match.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🏆 Top Match
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {index + 1}. {match.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                          {match.score}% Match
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{match.description}</p>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Traits yang Cocok:</h3>
                      <div className="flex flex-wrap gap-2">
                        {match.traits.split(',').map((trait, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {trait.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Alasan Matching:</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {match.reasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => handleSelectMajor(match.id)}
                    disabled={selectedMajor === match.id}
                    className="flex-1"
                  >
                    {selectedMajor === match.id ? '✓ Dipilih' : 'Pilih Jurusan Ini'}
                  </Button>
                  <Button
                    onClick={() => router.push(`/minimum-keilmuan?major=${match.id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    Lihat Minimum Keilmuan
                  </Button>
                </div>
              </Card>
            ))}

            <Card className="bg-blue-50 border-2 border-blue-200">
              <h3 className="text-lg font-bold mb-3">💡 Tips Memilih Jurusan</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Pertimbangkan minat jangka panjang Anda</li>
                <li>• Lihat prospek karir dari jurusan tersebut</li>
                <li>• Konsultasikan dengan orang tua atau mentor</li>
                <li>• Pelajari minimum keilmuan yang dibutuhkan</li>
              </ul>
            </Card>

            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/modules')} variant="secondary">
                Lihat Modul Pembelajaran
              </Button>
              <Button onClick={() => router.push('/simulator')} variant="outline">
                Coba Simulator
              </Button>
            </div>
          </div>
        )}

        {/* Show all matches */}
        {matches.length > 3 && (
          <Card className="mt-8">
            <h3 className="text-xl font-bold mb-4">Jurusan Lainnya</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {matches.slice(3).map((match, index) => (
                <div key={match.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{index + 4}. {match.name}</h4>
                    <span className="text-sm text-gray-600">{match.score}%</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{match.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
