const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "projects.json");

// GET /api/projects
// Mengembalikan seluruh daftar proyek.
function getProjects(req, res, next) {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    const projects = JSON.parse(raw);
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:id
// Mengembalikan satu proyek berdasarkan id.
function getProjectById(req, res, next) {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    const projects = JSON.parse(raw);
    const project = projects.find((p) => p.id === Number(req.params.id));

    if (!project) {
      const error = new Error("Proyek tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProjects, getProjectById };
