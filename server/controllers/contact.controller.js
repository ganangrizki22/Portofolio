const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "messages.json");

// POST /api/contact
// Menerima pesan dari form kontak lalu menyimpannya ke messages.json.
// Ini murni contoh belajar: di project nyata sebaiknya pesan dikirim
// lewat email/service pihak ketiga atau disimpan ke database sungguhan.
function submitContact(req, res, next) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      const error = new Error("Nama, email, dan pesan wajib diisi");
      error.statusCode = 400;
      throw error;
    }

    const raw = fs.readFileSync(dataPath, "utf-8");
    const messages = JSON.parse(raw);

    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    fs.writeFileSync(dataPath, JSON.stringify(messages, null, 2));

    res.status(201).json({
      success: true,
      message: "Pesan berhasil dikirim, terima kasih!",
      data: newMessage,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact };
