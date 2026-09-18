import { useEffect, useState } from "react";

// Tombol mengambang untuk kembali ke atas halaman, hanya muncul setelah
// pengunjung scroll melewati tinggi layar pertama (Hero) supaya tidak
// mengganggu saat halaman baru dibuka.
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={scrollToTop}
      aria-label="Kembali ke atas halaman"
      title="Kembali ke atas"
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  );
}

export default BackToTop;
