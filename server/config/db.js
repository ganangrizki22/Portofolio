const { Pool } = require("pg");

// Koneksi ke database Neon (PostgreSQL) memakai connection string dari
// environment variable DATABASE_URL (diisi di server/.env, lihat .env.example
// untuk formatnya). ssl wajib untuk Neon; rejectUnauthorized: false dipakai
// supaya tidak perlu setup certificate authority manual -- cukup aman untuk
// kebutuhan project belajar seperti ini.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Membuat tabel "messages" kalau belum ada. Dipanggil sekali saat server
// start, supaya tidak perlu jalankan migration terpisah secara manual.
async function ensureMessagesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // Migrasi otomatis: kalau tabel "messages" sudah ada dari sebelumnya
  // (dibuat sebelum kolom "phone" ditambahkan), tambahkan kolomnya di sini
  // supaya tidak perlu jalankan migration manual terpisah. Aman dipanggil
  // berkali-kali (IF NOT EXISTS).
  await pool.query(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS phone TEXT`);
}

module.exports = { pool, ensureMessagesTable };
