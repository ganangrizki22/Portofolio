const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "profile.json");

// GET /api/profile
// Mengembalikan data profil (nama, jabatan, bio, sosial media, dll).
function getProfile(req, res, next) {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    const profile = JSON.parse(raw);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile };
