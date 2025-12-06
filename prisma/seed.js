const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Clear existing data
  await prisma.major.deleteMany();

  // Create 10 majors
  const majors = [
    {
      name: 'Psikologi',
      description: 'Ilmu mempelajari perilaku manusia, proses mental, dan interaksi sosial',
      traits: 'sosial, empati, auditory, analitis, komunikatif',
      mk: 'observasi dasar, menulis reflektif, statistik sederhana, psikologi umum, metodologi penelitian'
    },
    {
      name: 'Teknik Informatika',
      description: 'Ilmu komputer dan pemrograman untuk mengembangkan software dan sistem',
      traits: 'logis, visual, problem-solving, teknis, kreatif',
      mk: 'algoritma dasar, pemrograman dasar, matematika diskrit, logika, struktur data'
    },
    {
      name: 'Manajemen Bisnis',
      description: 'Ilmu mengelola organisasi, strategi bisnis, dan kepemimpinan',
      traits: 'kepemimpinan, komunikatif, analitis, sosial, strategis',
      mk: 'pengantar bisnis, matematika ekonomi, komunikasi bisnis, manajemen dasar, akuntansi dasar'
    },
    {
      name: 'Desain Komunikasi Visual',
      description: 'Seni dan desain untuk komunikasi visual melalui media digital dan cetak',
      traits: 'kreatif, visual, artistik, inovatif, estetis',
      mk: 'dasar desain, tipografi, warna dan komposisi, sketching, software desain'
    },
    {
      name: 'Arsitektur',
      description: 'Ilmu merancang bangunan dan ruang dengan mempertimbangkan fungsi dan estetika',
      traits: 'visual, spasial, kreatif, teknis, detail-oriented',
      mk: 'gambar teknik, matematika dasar, fisika bangunan, sejarah arsitektur, dasar konstruksi'
    },
    {
      name: 'Kedokteran',
      description: 'Ilmu kesehatan untuk mendiagnosis dan mengobati penyakit',
      traits: 'analitis, empati, kinestetik, teliti, memorizing',
      mk: 'biologi dasar, kimia organik, anatomi dasar, fisika medis, bahasa medis'
    },
    {
      name: 'Akuntansi',
      description: 'Ilmu pencatatan dan pelaporan keuangan untuk pengambilan keputusan',
      traits: 'detail-oriented, logis, sistematis, analitis, teliti',
      mk: 'pengantar akuntansi, matematika bisnis, dasar perpajakan, sistem informasi, ekonomi mikro'
    },
    {
      name: 'Hukum',
      description: 'Ilmu tentang peraturan, regulasi, dan sistem hukum',
      traits: 'auditory, analitis, komunikatif, argumentatif, teliti',
      mk: 'pengantar hukum, logika hukum, bahasa hukum, tata negara, hukum perdata dasar'
    },
    {
      name: 'Ilmu Komunikasi',
      description: 'Ilmu tentang penyampaian pesan dan informasi melalui berbagai media',
      traits: 'komunikatif, sosial, kreatif, auditory, ekspresif',
      mk: 'pengantar komunikasi, public speaking, menulis, media literacy, teori komunikasi'
    },
    {
      name: 'Teknik Sipil',
      description: 'Ilmu merancang dan membangun infrastruktur seperti jalan, jembatan, dan gedung',
      traits: 'logis, spasial, teknis, analitis, problem-solving',
      mk: 'matematika teknik, fisika teknik, gambar teknik, mekanika, material konstruksi'
    }
  ];

  for (const major of majors) {
    await prisma.major.create({
      data: major
    });
    console.log(`✅ Created major: ${major.name}`);
  }

  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
