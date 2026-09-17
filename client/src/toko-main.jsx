import React from "react";
import ReactDOM from "react-dom/client";
import TokoApp from "./pages/TokoApp/TokoApp.jsx";

// Bootstrap JS (dipakai untuk panel keranjang belanja berupa offcanvas)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Entry point SCSS yang sama dengan halaman portofolio utama, supaya
// tema (warna, font, dark/light mode) tetap konsisten.
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TokoApp />
  </React.StrictMode>
);
