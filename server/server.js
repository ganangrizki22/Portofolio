require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const profileRoutes = require("./routes/profile.routes");
const skillsRoutes = require("./routes/skills.routes");
const experienceRoutes = require("./routes/experience.routes");
const projectsRoutes = require("./routes/projects.routes");
const contactRoutes = require("./routes/contact.routes");
const spotifyRoutes = require("./routes/spotify.routes");
const storeProductsRoutes = require("./routes/products.routes");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// --- Global middleware ---
app.use(cors({ origin: CLIENT_ORIGIN }));
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
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/products", storeProductsRoutes);

// --- Error handling (harus paling bawah) ---
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
