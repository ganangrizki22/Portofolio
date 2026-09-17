// Script sekali-jalan untuk memindahkan pesan lama dari data/messages.json
// ke database Neon (PostgreSQL). Jalankan manual di komputer kamu setelah
// DATABASE_URL terisi di server/.env dan `npm install` sudah dijalankan:
//
//   cd server
//   node scripts/migrate-messages.js
//
// Aman dijalankan meski data/messages.json sudah kosong/tidak ada -- script
// akan berhenti tanpa error kalau tidak ada pesan untuk dipindahkan.

const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { pool, ensureMessagesTable } = require("../config/db");

async function migrate() {
  const dataPath = path.join(__dirname, "..", "data", "messages.json");

  if (!fs.existsSync(dataPath)) {
    console.log("data/messages.json tidak ditemukan, tidak ada yang dipindahkan.");
    return;
  }

  const raw = fs.readFileSync(dataPath, "utf-8");
  const messages = JSON.parse(raw);

  if (messages.length === 0) {
    console.log("data/messages.json kosong, tidak ada yang dipindahkan.");
    return;
  }

  await ensureMessagesTable();

  for (const msg of messages) {
    await pool.query(
      `INSERT INTO messages (name, email, message, created_at) VALUES ($1, $2, $3, $4)`,
      [msg.name, msg.email, msg.message, msg.createdAt]
    );
    console.log(`Migrated: ${msg.name} (${msg.email})`);
  }

  console.log(`Selesai! ${messages.length} pesan berhasil dipindahkan ke Neon.`);
}

migrate()
  .catch((err) => {
    console.error("Migrasi gagal:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
