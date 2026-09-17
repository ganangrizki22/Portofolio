const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "skills.json");

// GET /api/skills
// Mengembalikan daftar seluruh skill, opsional difilter lewat query ?category=
function getSkills(req, res, next) {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    let skills = JSON.parse(raw);

    const { category } = req.query;
    if (category) {
      skills = skills.filter(
        (skill) => skill.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSkills };
