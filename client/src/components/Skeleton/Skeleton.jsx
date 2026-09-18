// Blok placeholder abu-abu dengan efek shimmer, dipakai menggantikan teks
// "Memuat..." polos saat data dari API masih diambil. className dipakai
// untuk mengatur lebar/tinggi/bentuk sesuai konten asli yang akan
// menggantikannya (lihat _skeleton.scss untuk varian ukuran).
function Skeleton({ className = "", style }) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={style}
      aria-hidden="true"
    ></span>
  );
}

export default Skeleton;
