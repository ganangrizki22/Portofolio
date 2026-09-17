import React from "react";
import ReactDOM from "react-dom/client";
import TodoApp from "./pages/TodoApp/TodoApp.jsx";

// Bootstrap JS (dipakai TodoApp untuk hal-hal interaktif ringan, konsisten
// dengan halaman portofolio utama)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Entry point SCSS yang sama dengan halaman portofolio utama, supaya
// tema (warna, font, dark/light mode) tetap konsisten.
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>
);
