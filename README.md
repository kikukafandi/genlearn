# GenLearn - Platform Pembelajaran Adaptif

Platform pembelajaran adaptif yang membantu mahasiswa menemukan jurusan ideal berdasarkan DNA skill dan psikologi.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Auth.js)
- **Password Hashing**: bcryptjs

## Features

1. **Authentication System** - Register & Login dengan credentials
2. **DNA Assessment** - DNA Skill dan Psikologi
3. **Major Matching** - Rekomendasi 10 jurusan dengan scoring
4. **Minimum Keilmuan** - Persyaratan minimum setiap jurusan
5. **Modul Pembelajaran** - Program 4 minggu adaptif
6. **Simulator** - Simulasi tugas kuliah per jurusan

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Buat database MySQL
CREATE DATABASE genlearn;

# Copy environment file
cp .env.example .env

# Edit .env dengan kredensial database Anda
```

### 3. Run Prisma

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
/src
  /app              # Pages and API routes
  /components       # Reusable UI components
  /lib              # Libraries (auth, prisma)
  middleware.js     # Route protection
/prisma             # Database schema and seeder
```

## Usage Flow

1. Register → Login → Dashboard
2. DNA Assessment → Major Matching
3. Select Major → Minimum Keilmuan
4. Modules → Simulator

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

