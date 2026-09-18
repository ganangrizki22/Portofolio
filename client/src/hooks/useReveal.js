import { useCallback, useRef } from "react";

// Custom hook kecil untuk animasi "muncul saat di-scroll" (scroll reveal).
// Menambahkan class "is-visible" begitu elemen masuk viewport, memakai
// IntersectionObserver (dukungan browser modern sudah luas, tanpa perlu
// library tambahan). Kalau pengguna mengaktifkan preferensi sistem
// "kurangi animasi" (prefers-reduced-motion), elemen langsung ditampilkan
// tanpa animasi sama sekali.
//
// Dipakai sebagai CALLBACK ref (bukan object ref biasa) supaya tetap benar
// untuk elemen yang baru muncul belakangan setelah data dari API selesai
// di-fetch (mis. komponen Highlights yang awalnya me-return null sebelum
// datanya siap) -- kalau pakai object ref + useEffect(fn, []), observer
// hanya akan dipasang sekali di render pertama, dan kalau elemen belum ada
// saat itu, observer tidak akan pernah terpasang sama sekali.
export default function useReveal() {
  const observerRef = useRef(null);

  const setRef = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return setRef;
}
