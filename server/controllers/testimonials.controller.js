const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "testimonials.json");

// GET /api/testimonials
// Mengembalikan daftar rekomendasi/testimoni (nama, jabatan, tanggal, kutipan).
function getTestimonials(req, res, next) {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    const testimonials = JSON.parse(raw);
    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTestimonials };
