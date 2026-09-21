// Entry point serverless untuk Vercel. Vercel otomatis mengenali file apa pun
// di dalam folder /api sebagai satu "serverless function" -- jadi file ini
// cukup mengekspor ulang Express app dari server.js (yang sudah diekspor
// lewat module.exports di sana, lihat komentar di server.js bagian
// "--- Start server ---"). Semua request (apa pun path-nya) diarahkan ke sini
// lewat rewrite di vercel.json, lalu Express sendiri yang urus routing
// internalnya (/api/profile, /api/skills, dst.) seperti biasa.
module.exports = require("../server.js");
