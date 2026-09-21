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
// Tabel "messages" (Neon/PostgreSQL) dipastikan ada dulu sebelum server
// mulai menerima request, supaya form kontak tidak gagal di request pertama.
async function start() {
  try {
    await ensureMessagesTable();
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Gagal konek ke database (Neon). Cek DATABASE_URL di .env.");
    console.error(err.message);
    process.exit(1);
  }
}

start();
