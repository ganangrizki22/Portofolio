import useScrollProgress from "../../hooks/useScrollProgress.js";

// Bar tipis di paling atas layar yang menunjukkan seberapa jauh pengunjung
// sudah scroll ke bawah halaman -- sentuhan kecil yang umum dipakai di
// situs/portofolio modern untuk kasih konteks "masih berapa jauh lagi".
function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ScrollProgress;
