import { useEffect, useRef } from "react";

// Notifikasi singkat (feedback aksi) yang tidak boleh hilang saat pengguna
// mengetuk/klik bagian lain halaman -- karena itu pakai popover="manual"
// (tanpa "light-dismiss") sekaligus otomatis naik ke top layer, jadi selalu
// tampil di atas navbar sticky, offcanvas, atau elemen fixed lain apa pun.
// Di browser yang belum mendukung Popover API, komponen ini tetap berfungsi
// normal sebagai <div> biasa yang posisinya diatur lewat CSS (position: fixed).

const AUTO_DISMISS_MS = 4000;

const TONE_ICON = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-triangle-fill",
};

function Toast({ show, tone = "success", message, onClose }) {
  const toastRef = useRef(null);

  useEffect(() => {
    const node = toastRef.current;
    const supportsPopover = typeof node?.showPopover === "function";

    if (show) {
      if (supportsPopover) {
        try {
          node.showPopover();
        } catch {
          // sudah terbuka -- abaikan
        }
      }
      const timer = setTimeout(() => onClose?.(), AUTO_DISMISS_MS);
      return () => clearTimeout(timer);
    }

    if (supportsPopover) {
      try {
        node.hidePopover();
      } catch {
        // sudah tertutup -- abaikan
      }
    }

    return undefined;
  }, [show, onClose]);

  if (!message) return null;

  return (
    <div
      ref={toastRef}
      popover="manual"
      role="status"
      aria-live="polite"
      className={`app-toast app-toast-${tone}${show ? " is-visible" : ""}`}
    >
      <i
        className={`bi ${TONE_ICON[tone] || TONE_ICON.success} app-toast-icon`}
        aria-hidden="true"
      ></i>
      <span className="app-toast-message">{message}</span>
      <button
        type="button"
        className="app-toast-close"
        aria-label="Tutup notifikasi"
        onClick={onClose}
      >
        <i className="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default Toast;
