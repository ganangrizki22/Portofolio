import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Bootstrap JS (butuh komponen interaktif seperti navbar collapse, dsb.)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Ikon (di-bundle secara lokal, tidak lagi lewat CDN jsDelivr supaya situs
// tetap tampil benar walau CDN lambat/diblokir, dan tidak ada request pihak
// ketiga ke jaringan pengunjung).
import "bootstrap-icons/font/bootstrap-icons.css";

// Font Karla + Nanum Pen Script (di-bundle secara lokal, bukan lewat Google
// Fonts) supaya render font sudah tersedia sejak awal (tanpa flash-of-
// unstyled-text) dan situs tetap berfungsi normal walau koneksi ke Google
// diblokir/lambat.
import "@fontsource/karla/400.css";
import "@fontsource/karla/500.css";
import "@fontsource/karla/700.css";
import "@fontsource/karla/800.css";
import "@fontsource/nanum-pen-script/400.css";

// Entry point SCSS utama (meng-import Bootstrap + partial kustom kita)
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
