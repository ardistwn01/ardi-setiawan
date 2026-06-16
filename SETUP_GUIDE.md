# 🚀 Panduan Setup Portfolio — Supabase + Vercel

---

## DAFTAR ISI
1. [Setup Supabase](#1-setup-supabase)
2. [Isi Kredensial di Kode](#2-isi-kredensial-di-kode)
3. [Buat Akun Admin](#3-buat-akun-admin)
4. [Deploy ke Vercel](#4-deploy-ke-vercel)
5. [Kustomisasi Konten](#5-kustomisasi-konten)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Setup Supabase

### 1.1 — Buat akun & project

1. Buka [supabase.com](https://supabase.com) → klik **Start your project** → login/daftar
2. Klik **New project**
3. Isi:
   - **Name:** `portfolio` (bebas)
   - **Database Password:** buat password yang kuat, **simpan** — ini untuk database PostgreSQL kamu
   - **Region:** pilih `Southeast Asia (Singapore)` — paling dekat dari Indonesia
4. Klik **Create new project** → tunggu ~2 menit sampai selesai

### 1.2 — Jalankan SQL Schema

1. Di sidebar Supabase, klik **SQL Editor** → **New query**
2. Buka file `supabase_schema.sql` (ada di folder project)
3. **Copy semua isinya** → paste ke SQL Editor
4. Klik tombol **Run** (atau Ctrl+Enter)
5. Pastikan muncul pesan `Success. No rows returned`

> ⚠️ Jika ada error "relation already exists", berarti tabel sudah ada — tidak masalah, lanjutkan saja.

### 1.3 — Ambil Kredensial

1. Di sidebar, klik **Project Settings** (ikon gear) → **API**
2. Catat dua nilai ini:
   - **Project URL** → contoh: `https://abcdefghijkl.supabase.co`
   - **anon / public key** → string panjang mulai dengan `eyJ...`

---

## 2. Isi Kredensial di Kode

Buka **DUA file** berikut dan ganti bagian yang ditandai:

### File 1: `js/supabase.js`
```js
const SUPABASE_URL = 'https://GANTI_INI.supabase.co';   // ← Project URL kamu
const SUPABASE_ANON_KEY = 'GANTI_INI';                   // ← anon/public key kamu
```

### File 2: `admin/admin.js`
```js
const SUPABASE_URL = 'https://GANTI_INI.supabase.co';   // ← sama seperti di atas
const SUPABASE_ANON_KEY = 'GANTI_INI';                   // ← sama seperti di atas
```

> 💡 **anon key aman diexpose** di frontend — Supabase sudah dirancang untuk ini.
> Row Level Security (RLS) yang melindungi data, bukan menyembunyikan key-nya.

---

## 3. Buat Akun Admin

Akun admin dipakai untuk login ke `/admin` dan mengelola seluruh konten portofolio.

1. Di Supabase dashboard → **Authentication** → **Users**
2. Klik **Add user** → **Create new user**
3. Isi email dan password yang kuat
4. Klik **Create user**

> ✅ Selesai! Gunakan email & password ini untuk login di `yourdomain.com/admin`

---

## 4. Deploy ke Vercel

### 4.1 — Upload ke GitHub dulu

```bash
# Di folder project kamu (portfolio/)
git init
git add .
git commit -m "Initial portfolio commit"

# Buat repo baru di github.com/new, lalu:
git remote add origin https://github.com/USERNAME/portfolio.git
git push -u origin main
```

### 4.2 — Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → login dengan GitHub
2. Klik **Add New → Project**
3. Pilih repo `portfolio` yang baru dibuat
4. **Framework Preset:** pilih `Other` (bukan Next.js, bukan Vite — ini pure HTML)
5. **Root Directory:** biarkan `/` (default)
6. **Build Command:** kosongkan (tidak ada)
7. **Output Directory:** kosongkan (tidak ada)
8. Klik **Deploy**
9. Tunggu ~30 detik → selesai ✅

### 4.3 — Custom Domain (Opsional)

1. Di Vercel dashboard → project kamu → **Settings → Domains**
2. Tambahkan domain kamu (misal: `ardi.dev`)
3. Ikuti instruksi DNS yang Vercel berikan

---

## 5. Kustomisasi Konten

### Via Admin Dashboard

1. Buka `https://yourdomain.vercel.app/admin`
2. Login dengan akun yang dibuat di langkah 3
3. Kelola semua konten:
   - **Profile** — nama, bio, foto, link sosial, CV
   - **Projects** — tambah/edit/hapus project, toggle featured
   - **Experience** — riwayat pekerjaan & magang
   - **Skills** — kategori, nama, level (progress bar)
   - **Certificates** — sertifikat + link credential
   - **Messages** — baca & balas pesan dari form kontak

### Update Data Proyek GitHub/Vercel

Di admin → **Projects** → Edit project → isi field **Live URL** dengan link Vercel project kamu, contoh:
```
https://zuppazuppa.vercel.app
```
Saat diklik di portofolio, langsung redirect ke halaman tsb.

### Ganti Foto Profil

Ada 2 cara:
1. **Upload ke Supabase Storage:**
   - Supabase → Storage → New bucket: `avatars` (public)
   - Upload foto → copy URL-nya
   - Admin → Profile → Avatar URL → paste URL

2. **Pakai link langsung** dari Google Drive, Imgur, atau hosting lain:
   - Pastikan URL diakhiri `.jpg` / `.png` / `.webp`
   - Paste ke field Avatar URL

---

## 6. Troubleshooting

### ❌ Halaman kosong / data tidak muncul
- Buka DevTools (F12) → Console
- Kalau ada error `Invalid API key` → cek `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `js/supabase.js`
- Kalau error `new row violates row-level security` → pastikan SQL schema sudah dijalankan lengkap

### ❌ Admin tidak bisa login
- Pastikan user sudah dibuat di Supabase → Authentication → Users
- Cek kredensial di `admin/admin.js` sudah benar
- Coba buka DevTools → Network tab → cari request ke supabase → lihat response error-nya

### ❌ Form kontak tidak bisa kirim
- Cek RLS policy: `public insert messages` harus ada
- Jalankan ulang bagian RLS di `supabase_schema.sql`

### ❌ Di Vercel, halaman /admin 404
- Pastikan file `vercel.json` ada di root folder
- Cek isinya sudah benar (tidak ada typo)
- Di Vercel dashboard → Deployments → klik deployment terbaru → Functions — pastikan tidak ada error build

### ❌ CORS error
- Buka Supabase → Project Settings → API → **Allowed Origins**
- Tambahkan URL Vercel kamu: `https://yourproject.vercel.app`
- Tambahkan juga `http://localhost:3000` untuk development lokal

---

## Struktur File Final

```
portfolio/
├── index.html              ← Halaman utama portofolio
├── vercel.json             ← Konfigurasi routing Vercel
├── supabase_schema.sql     ← Schema database (jalankan sekali di Supabase)
├── css/
│   ├── style.css           ← CSS halaman utama
│   └── admin.css           ← CSS admin dashboard
├── js/
│   ├── supabase.js         ← ⚠️ GANTI kredensial di sini
│   └── main.js             ← Logic halaman utama
└── admin/
    ├── index.html          ← Halaman admin dashboard
    └── admin.js            ← ⚠️ GANTI kredensial di sini
```

---

## Catatan Penting

| Hal | Keterangan |
|-----|-----------|
| **Biaya Supabase** | Gratis selamanya (500MB DB, 1GB storage, 50K auth users) |
| **Biaya Vercel** | Gratis selamanya untuk personal project |
| **Database** | PostgreSQL di Supabase — tidak perlu bayar apapun |
| **Update konten** | Cukup lewat Admin Dashboard, tidak perlu redeploy |
| **Backup data** | Supabase → Database → Backups (tersedia di free tier) |

---

> Dibuat untuk Ardi · UHAMKA Teknik Informatika 2023
