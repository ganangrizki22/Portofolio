import React from "react";
import ReactDOM from "react-dom/client";
import TokoApp from "./pages/TokoApp/TokoApp.jsx";

// Bootstrap JS (dipakai untuk panel keranjang belanja berupa offcanvas)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Ikon & font di-bundle lokal, sama seperti halaman portofolio utama.
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fontsource/karla/400.css";
import "@fontsource/karla/500.css";
import "@fontsource/karla/700.css";
import "@fontsource/karla/800.css";
import "@fontsource/nanum-pen-script/400.css";

// Entry point SCSS yang sama dengan halaman portofolio utama, supaya
// tema (warna, font, dark/light mode) tetap konsisten.
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TokoApp />
  </React.StrictMode>
);
