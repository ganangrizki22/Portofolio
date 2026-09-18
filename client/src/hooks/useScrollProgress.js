import { useEffect, useState } from "react";

// Hook kecil untuk melacak seberapa jauh pengguna sudah scroll ke bawah
// halaman, dalam persen (0-100). Dipakai oleh <ScrollProgress /> untuk
// menampilkan bar tipis di bagian atas layar.
export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return progress;
}
