# Portofolio Pribadi — React + SCSS/Bootstrap + Node.js

Project ini adalah starter/boilerplate website portofolio pribadi, dibuat sebagai
bahan belajar full-stack sederhana:

- **Frontend**: React.js (Vite) + SCSS berstruktur (pola 7-1 ringkas) + Bootstrap 5
- **Backend**: Node.js + Express sebagai penyedia data (REST API) — data disimpan
  dalam file JSON, tanpa database, supaya mudah dipahami dulu sebelum lanjut ke
  database sungguhan (MongoDB/PostgreSQL, dsb.)

## Struktur Folder

```
portfolio-project/
├── client/                     # Frontend React
│   ├── index.html
│   ├── src/
│   │   ├── components/         # Navbar, Hero, About, Skills, Projects, Contact, Footer
│   │   ├── hooks/
│   │   │   └── useFetch.js     # custom hook untuk fetch data dari API
│   │   ├── services/
│   │   │   └── api.js          # semua request ke backend (axios)
│   │   ├── styles/             # SCSS 7-1 pattern (ringkas)
│   │   │   ├── abstracts/      # variabel & mixin (override Bootstrap di sini)
│   │   │   ├── base/           # reset & tipografi
│   │   │   ├── layout/         # navbar, footer, section wrapper
│   │   │   ├── components/     # hero, card, tombol, form
│   │   │   └── main.scss       # entry point yang meng-import semuanya
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Backend Node.js/Express
│   ├── data/                   # "database" sederhana berupa file JSON
│   │   ├── profile.json
│   │   ├── skills.json
│   │   ├── projects.json
│   │   └── messages.json       # hasil submit form kontak tersimpan di sini
│   ├── routes/                 # definisi endpoint
│   ├── controllers/            # logika tiap endpoint
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js               # entry point Express
│   └── package.json
│
└── README.md
```

## Cara Menjalankan

Dibutuhkan Node.js versi 18 ke atas.

### 1. Jalankan Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Server akan berjalan di `http://localhost:5000`. Coba buka di browser untuk
memastikan API hidup — akan muncul pesan JSON `"Portfolio API sedang berjalan"`.

### 2. Jalankan Frontend

Buka terminal baru:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` dan otomatis mengambil data
profil, skill, dan proyek dari backend di `http://localhost:5000/api`.

> Backend harus dijalankan terlebih dahulu (atau bersamaan) supaya frontend
> berhasil mengambil data. Jika belum berjalan, bagian About/Skills/Projects
> akan menampilkan pesan error yang menjelaskan hal ini.

## Daftar Endpoint API

| Method | Endpoint             | Keterangan                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/api/profile`        | Data profil (nama, bio, sosial media)    |
| GET    | `/api/skills`         | Daftar skill (bisa difilter `?category=`)|
| GET    | `/api/projects`       | Daftar seluruh proyek                    |
| GET    | `/api/projects/:id`   | Detail satu proyek                       |
| POST   | `/api/contact`        | Kirim pesan dari form kontak             |

## Yang Bisa Dipelajari & Dikembangkan Lagi

Karena tujuannya untuk belajar, berikut beberapa langkah lanjutan yang bisa dicoba:

1. **Ganti isi data** di `server/data/*.json` dengan data dirimu sendiri
   (nama, bio, skill, proyek, foto).
2. **Sambungkan ke database sungguhan** (MongoDB dengan Mongoose, atau
   PostgreSQL dengan Prisma) menggantikan file JSON di `server/data/`.
3. **Tambah halaman baru** dengan React Router (misalnya halaman detail
   proyek `/projects/:id`).
4. **Deploy**: frontend bisa di-deploy ke Vercel/Netlify (`npm run build`
   menghasilkan folder `dist/`), backend bisa di-deploy ke Render/Railway.
5. **Tambah validasi & keamanan** di endpoint `/api/contact` (rate limiting,
   sanitasi input) sebagai latihan keamanan dasar backend.
6. **Ubah warna & font** cukup dengan mengedit
   `client/src/styles/abstracts/_variables.scss` — karena semua warna
   Bootstrap sudah di-override dari satu tempat.

Selamat belajar! 🚀
