import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">GenLearn</h1>
            <div className="space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Daftar Sekarang</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Temukan Jurusan Ideal Anda
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform pembelajaran adaptif yang menganalisis DNA skill dan psikologi Anda
            untuk merekomendasikan jurusan kuliah yang paling cocok
          </p>
          <Link href="/auth/register">
            <Button className="text-lg px-8 py-4">
              Mulai Sekarang Gratis
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🧬</div>
            <h3 className="text-xl font-bold mb-2">DNA Assessment</h3>
            <p className="text-gray-600">
              Identifikasi skill, minat, dan karakter psikologi Anda melalui assessment komprehensif
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Major Matching</h3>
            <p className="text-gray-600">
              Dapatkan rekomendasi jurusan yang paling sesuai dengan profil Anda
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Modul Adaptif</h3>
            <p className="text-gray-600">
              Akses materi pembelajaran yang disesuaikan dengan gaya belajar Anda
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
