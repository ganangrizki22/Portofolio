const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "experience.json");

// GET /api/experience
// Mengembalikan daftar riwayat pengalaman kerja (role, perusahaan, periode, detail).
function getExperience(req, res, next) {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    const experience = JSON.parse(raw);
    res.json({ success: true, data: experience });
  } catch (err) {
    next(err);
  }
}

module.exports = { getExperience };
