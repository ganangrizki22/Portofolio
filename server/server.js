require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { ensureMessagesTable } = require("./config/db");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const profileRoutes = require("./routes/profile.routes");
const skillsRoutes = require("./routes/skills.routes");
const experienceRoutes = require("./routes/experience.routes");
const testimonialsRoutes = require("./routes/testimonials.routes");
const projectsRoutes = require("./routes/projects.routes");
const contactRoutes = require("./routes/contact.routes");
const spotifyRoutes = require("./routes/spotify.routes");
const storeProductsRoutes = require("./routes/products.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Boleh diisi beberapa origin sekaligus, dipisah koma (CLIENT_ORIGIN=a,b,c) --
// berguna karena Vite otomatis pindah ke port berikutnya (5174, 5175, dst.)
// kalau port 5173 sudah dipakai project lain yang dibuka bersamaan (mis.
// project TokoOnline). Tanpa ini, browser akan menolak response API dengan
// error CORS begitu client kebetulan tidak jalan persis di 5173. Kalau
// CLIENT_ORIGIN tidak diisi di .env, tiga port dev yang paling umum dipakai
// Vite berturut-turut sudah diizinkan by default.
const DEFAULT_DEV_ORIGINS = "http://localhost:5173,http://localhost:5174,http://localhost:5175";
const allowedOrigins = (process.env.CLIENT_ORIGIN || DEFAULT_DEV_ORIGINS)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// --- Kesiapan tabel Neon ---
// Di server tradisional cukup di-await sekali di fase startup sebelum
// app.listen(). Tapi di serverless (Vercel) tidak ada fase startup yang jelas
// -- tiap request bisa jadi "cold start" baru begitu instance function-nya
// baru dinyalakan. Jadi promise-nya dibuat sekali di scope module (supaya
// query CREATE TABLE-nya tidak diulang tiap request -- cold start berikutnya
// pakai instance yang sama akan langsung dapat promise yang sudah resolved),
// lalu di-await lewat middleware kecil di bawah sebelum request apa pun
// diproses -- ini juga otomatis bikin request pertama nunggu tabelnya siap,
// baik di mode server biasa maupun serverless.
const dbReady = ensureMessagesTable().catch((err) => {
  console.error("Gagal menyiapkan tabel database (Neon). Cek DATABASE_URL.");
  console.error(err.message);
  throw err;
});

app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    next(err);
  }
});

// --- Global middleware ---
app.use(
  cors({
    origin(origin, callback) {
      // origin kosong = request bukan dari browser (curl, Postman, dsb) -- izinkan.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS menolak origin "${origin}". Origin yang diizinkan: ${allowedOrigins.join(", ")}`);
      return callback(new Error("Origin tidak diizinkan oleh CORS."));
    },
  })
);
app.use(express.json());

// --- Health check ---
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API sedang berjalan 🚀",
  });
});

// --- Routes utama ---
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/products", storeProductsRoutes);

// --- Error handling (harus paling bawah) ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Start server ---
// app.listen() cuma dipanggil kalau file ini dieksekusi LANGSUNG (`node
// server.js` / `npm run dev`, dipakai untuk dev lokal atau hosting server
// tradisional) -- dideteksi lewat require.main === module, idiom standar
// Node.js untuk itu. Di Vercel, file ini di-import lewat api/index.js sebagai
// handler serverless (lihat file itu), jadi baris require.main === module
// bernilai false di sana dan app.listen() dilewati -- Vercel yang urus
// port/servernya sendiri, kita cukup export `app`-nya lewat module.exports
// di bawah.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
