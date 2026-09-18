import { useEffect, useState } from "react";

// Melacak section (berdasarkan id) mana yang sedang paling terlihat di
// viewport saat pengguna scroll, supaya Navbar bisa menyorot link yang
// sedang aktif (pola "scrollspy"). rootMargin ditarik ke atas supaya
// section dianggap "aktif" begitu bagian atasnya melewati ~30% tinggi
// layar, bukan menunggu section itu memenuhi seluruh viewport.
export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          // Kalau ada beberapa section yang sama-sama "terlihat" (transisi
          // antar section), pilih yang posisinya paling atas.
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
