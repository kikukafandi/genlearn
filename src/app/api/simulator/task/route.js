import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const taskTemplates = {
  'Psikologi': {
    taskDescription: 'Lakukan observasi sederhana: Amati perilaku 3 orang di tempat umum selama 15 menit. Catat pola perilaku, gesture, dan interaksi sosial mereka. Tulis analisis singkat.',
    objectives: [
      'Mengembangkan kemampuan observasi',
      'Memahami pola perilaku manusia',
      'Menulis laporan observasi sistematis'
    ],
    guidelines: [
      'Pilih lokasi yang ramai seperti kafe atau taman',
      'Catat detail tanpa mengganggu subjek',
      'Fokus pada perilaku verbal dan non-verbal',
      'Buat kesimpulan berdasarkan observasi'
    ],
    tools: ['Notebook', 'Pulpen', 'Smartphone (untuk timer)'],
    estimatedTime: '30-45 menit',
    difficulty: 'Pemula',
    nextSteps: 'Pelajari lebih dalam tentang metode observasi dan psikologi sosial'
  },
  'Teknik Informatika': {
    taskDescription: 'Buat flowchart untuk sistem login sederhana. Sertakan validasi email, password, dan penanganan error. Gunakan simbol flowchart yang benar.',
    objectives: [
      'Memahami logika pemrograman dasar',
      'Menguasai pembuatan flowchart',
      'Thinking algoritmik'
    ],
    guidelines: [
      'Mulai dengan Start dan akhiri dengan End',
      'Gunakan simbol decision untuk validasi',
      'Tambahkan penanganan untuk input salah',
      'Pastikan alur logis dan mudah dipahami'
    ],
    tools: ['Draw.io', 'Lucidchart', 'Kertas & Pensil', 'Microsoft Visio'],
    estimatedTime: '45-60 menit',
    difficulty: 'Pemula',
    nextSteps: 'Coba implementasi flowchart ke dalam kode sederhana'
  },
  'Manajemen Bisnis': {
    taskDescription: 'Buat business model canvas sederhana untuk ide bisnis kecil (contoh: jasa cuci motor, warung kopi kecil). Isi 9 blok canvas dengan detail.',
    objectives: [
      'Memahami konsep business model',
      'Berpikir strategis',
      'Menganalisis value proposition'
    ],
    guidelines: [
      'Mulai dengan Customer Segments',
      'Definisikan Value Proposition yang jelas',
      'Pikirkan Revenue Streams yang realistis',
      'Identifikasi Key Resources dan Partners'
    ],
    tools: ['Canva', 'PowerPoint', 'Kertas besar', 'Strategyzer'],
    estimatedTime: '60-90 menit',
    difficulty: 'Pemula',
    nextSteps: 'Validasi model dengan riset pasar sederhana'
  },
  'Desain Komunikasi Visual': {
    taskDescription: 'Design poster sederhana untuk event kampus (ukuran A4). Terapkan prinsip desain: hierarchy, contrast, alignment, dan repetition.',
    objectives: [
      'Menerapkan prinsip desain dasar',
      'Menggunakan tipografi efektif',
      'Komposisi visual yang menarik'
    ],
    guidelines: [
      'Pilih maksimal 2 jenis font',
      'Gunakan kontras warna yang baik',
      'Buat hierarchy informasi yang jelas',
      'Pastikan readable dan eye-catching'
    ],
    tools: ['Canva', 'Figma', 'Adobe Illustrator', 'CorelDRAW'],
    estimatedTime: '90-120 menit',
    difficulty: 'Pemula',
    nextSteps: 'Pelajari teori warna dan tipografi lebih dalam'
  },
  'Arsitektur': {
    taskDescription: 'Gambar denah rumah sederhana (6x8 meter) dengan 2 kamar tidur, 1 kamar mandi, ruang tamu, dan dapur. Gunakan skala dan simbol arsitektur yang benar.',
    objectives: [
      'Memahami konsep spatial planning',
      'Menguasai gambar teknik dasar',
      'Berpikir fungsional dan estetis'
    ],
    guidelines: [
      'Gunakan skala 1:100',
      'Perhatikan sirkulasi dan pencahayaan',
      'Tambahkan dimensi dan keterangan',
      'Pertimbangkan ergonomi ruangan'
    ],
    tools: ['Penggaris', 'Kertas millimeter', 'AutoCAD', 'SketchUp'],
    estimatedTime: '120-150 menit',
    difficulty: 'Menengah',
    nextSteps: 'Pelajari standar gambar arsitektur dan building code'
  },
  'Kedokteran': {
    taskDescription: 'Buat mind map sistem pencernaan manusia. Sertakan organ utama, fungsi, dan gangguan umum. Gunakan warna dan ilustrasi sederhana.',
    objectives: [
      'Memahami anatomi sistem pencernaan',
      'Mengorganisir informasi kompleks',
      'Visual learning untuk medis'
    ],
    guidelines: [
      'Mulai dari mulut hingga anus',
      'Tambahkan fungsi tiap organ',
      'Cantumkan 2-3 penyakit umum per organ',
      'Gunakan terminologi medis yang tepat'
    ],
    tools: ['Kertas besar', 'Spidol warna', 'MindMeister', 'XMind'],
    estimatedTime: '60-90 menit',
    difficulty: 'Pemula',
    nextSteps: 'Pelajari fisiologi sistem pencernaan lebih detail'
  },
  'Akuntansi': {
    taskDescription: 'Buat jurnal umum sederhana untuk transaksi warung kecil selama 1 minggu. Minimal 10 transaksi (pembelian, penjualan, biaya).',
    objectives: [
      'Memahami konsep debit-kredit',
      'Mencatat transaksi dengan benar',
      'Dasar pembukuan'
    ],
    guidelines: [
      'Gunakan format jurnal yang benar',
      'Perhatikan akun debit dan kredit',
      'Hitung saldo setiap transaksi',
      'Pastikan balance (debit = kredit)'
    ],
    tools: ['Excel', 'Buku jurnal', 'Kalkulator', 'Accurate'],
    estimatedTime: '45-60 menit',
    difficulty: 'Pemula',
    nextSteps: 'Lanjut ke pembuatan buku besar dan neraca'
  },
  'Hukum': {
    taskDescription: 'Analisis kasus sederhana: Seseorang membeli barang online tapi tidak sesuai foto. Identifikasi: (1) dasar hukum, (2) hak konsumen, (3) solusi hukum.',
    objectives: [
      'Berpikir analitis hukum',
      'Memahami hak konsumen',
      'Menulis argumentasi hukum'
    ],
    guidelines: [
      'Identifikasi fakta kasus',
      'Cari dasar hukum yang relevan (UU Perlindungan Konsumen)',
      'Buat argumentasi logis',
      'Berikan rekomendasi penyelesaian'
    ],
    tools: ['Browser (cari UU)', 'Kertas', 'Template analisis kasus'],
    estimatedTime: '60-75 menit',
    difficulty: 'Pemula',
    nextSteps: 'Pelajari metode analisis kasus yang lebih mendalam'
  },
  'Ilmu Komunikasi': {
    taskDescription: 'Buat skrip dan rekam video public speaking 2-3 menit tentang topik bebas. Perhatikan: opening, body, closing, gestur, dan intonasi.',
    objectives: [
      'Mengembangkan kemampuan public speaking',
      'Menyusun pesan yang efektif',
      'Body language dan delivery'
    ],
    guidelines: [
      'Buat outline: opening hook, 3 poin utama, closing CTA',
      'Latih gestur dan kontak mata',
      'Gunakan intonasi yang variatif',
      'Rekam dan review sendiri'
    ],
    tools: ['Smartphone', 'Tripod (optional)', 'Cermin untuk latihan'],
    estimatedTime: '90-120 menit',
    difficulty: 'Pemula',
    nextSteps: 'Minta feedback dari orang lain dan improve'
  },
  'Teknik Sipil': {
    taskDescription: 'Hitung kebutuhan material untuk membuat jalan beton sederhana (panjang 10m, lebar 3m, tebal 10cm). Hitung volume beton, semen, pasir, dan kerikil.',
    objectives: [
      'Memahami perhitungan volume',
      'Mengerti komposisi material',
      'Estimasi biaya sederhana'
    ],
    guidelines: [
      'Hitung volume total beton (pxlxt)',
      'Gunakan mix design standar (1:2:3)',
      'Konversi ke satuan sak semen',
      'Tambahkan waste factor 5-10%'
    ],
    tools: ['Kalkulator', 'Excel', 'Tabel konversi material'],
    estimatedTime: '45-60 menit',
    difficulty: 'Pemula',
    nextSteps: 'Pelajari RAB (Rencana Anggaran Biaya) lebih detail'
  }
};

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const majorId = searchParams.get('majorId');

    let major;
    if (majorId) {
      major = await prisma.major.findUnique({
        where: { id: parseInt(majorId) }
      });
    } else {
      // Get first major as default
      const majors = await prisma.major.findMany();
      major = majors[0];
    }

    if (!major) {
      return NextResponse.json(
        { error: 'Jurusan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get task template for this major
    const template = taskTemplates[major.name] || taskTemplates['Teknik Informatika'];

    return NextResponse.json({
      majorName: major.name,
      ...template
    });
  } catch (error) {
    console.error('Simulator task error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil task' },
      { status: 500 }
    );
  }
}
