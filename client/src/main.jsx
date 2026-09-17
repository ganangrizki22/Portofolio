import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Bootstrap JS (butuh komponen interaktif seperti navbar collapse, dsb.)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Entry point SCSS utama (meng-import Bootstrap + partial kustom kita)
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
