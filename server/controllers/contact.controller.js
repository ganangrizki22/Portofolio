const { pool } = require("../config/db");

// POST /api/contact
// Menerima pesan dari form kontak lalu menyimpannya ke database Neon
// (PostgreSQL) -- supaya data tidak hilang saat di-deploy ke hosting yang
// filesystem-nya tidak permanen (lihat catatan lama di bawah).
//
// Sebelumnya pesan disimpan ke file server/data/messages.json. Itu cukup
// untuk belajar di lokal, tapi bermasalah begitu di-deploy: banyak hosting
// backend murah/gratis (Render free, dsb.) punya "ephemeral filesystem",
// jadi file yang ditulis saat runtime bisa hilang tiap server restart/deploy
// ulang. Makanya dipindah ke database sungguhan.
async function submitContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      const error = new Error(
        "Nama, email, nomor telepon, dan pesan wajib diisi",
      );
      error.statusCode = 400;
      throw error;
    }

    const result = await pool.query(
      `INSERT INTO messages (name, email, phone, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, message, created_at AS "createdAt"`,
      [name, email, phone, message],
    );

    res.status(201).json({
      success: true,
      message:
        "Pesan berhasil dikirim, akan saya respon secepatnya, terima kasih!",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact };
