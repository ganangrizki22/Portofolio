import { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import { getProfile } from "../../services/api.js";
import Skeleton from "../Skeleton/Skeleton.jsx";
import Toast from "../Toast/Toast.jsx";

// Lama spinner tampil sebelum toast konfirmasi muncul. Ini murni feedback
// UI (bukan hasil pantauan progres jaringan yang sebenarnya) -- unduhan
// file statis kecil seperti ini biasanya sudah selesai dalam sekejap,
// jadi jeda ini sengaja dibuat supaya prosesnya tetap terasa oleh
// pengguna, bukan cuma kedip sekilas.
const DOWNLOAD_FEEDBACK_MS = 900;

function Hero() {
  const { data: profile, loading } = useFetch(getProfile, []);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState({ show: false, tone: "success", message: "" });
  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(feedbackTimerRef.current);
  }, []);

  function handleDownloadResume() {
    // SENGAJA tidak pakai fetch()/blob untuk mengunduh berkasnya sendiri.
    // Atribut `download` native di bawah ini dibiarkan bekerja apa adanya
    // supaya browser (atau ekstensi download manager seperti IDM/ADM, jika
    // terpasang) yang menangani unduhannya langsung. Kalau unduhan di-
    // fetch manual lewat JS, ekstensi semacam itu bisa meng-intercept
    // request-nya dan membuat fetch() gagal/diblokir di level JS --
    // padahal berkasnya tetap terunduh lewat ekstensi tsb -- sehingga kita
    // salah menampilkan pesan error padahal unduhan sebenarnya berhasil.
    // Spinner + toast di sini jadi murni indikator "proses lagi berjalan",
    // dipicu independen dari status request jaringan mana pun.
    if (isDownloading) return;

    setIsDownloading(true);
    clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setIsDownloading(false);
      setToast({ show: true, tone: "success", message: "CV sedang diunduh." });
    }, DOWNLOAD_FEEDBACK_MS);
  }

  return (
    <section id="hero" className="hero d-flex align-items-center">
      <div className="container text-center text-lg-start">
        <div className="row align-items-center">
          <div className="col-lg-8 order-2 order-lg-1">
            {loading ? (
              <div
                className="hero-skeleton mx-auto mx-lg-0"
                aria-busy="true"
                aria-label="Memuat data profil"
              >
                <Skeleton style={{ height: "0.9rem", maxWidth: 180 }} className="mb-3" />
                <Skeleton style={{ height: "3rem", maxWidth: 420 }} className="mb-3" />
                <Skeleton style={{ height: "2.4rem", maxWidth: 220, borderRadius: 999 }} className="mb-3" />
                <Skeleton style={{ height: "1.1rem", maxWidth: 320 }} className="mb-4" />
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <Skeleton style={{ height: "3.1rem", width: 160, borderRadius: 8 }} />
                  <Skeleton style={{ height: "3.1rem", width: 170, borderRadius: 8 }} />
                </div>
              </div>
            ) : (
              <>
                <p className="hero-eyebrow mb-2">Halo, perkenalkan saya</p>
                <h1 className="hero-title mb-3">{profile?.name}</h1>
                <h2 className="hero-subtitle mb-4">
                  <span className="hero-subtitle-highlight">
                    {profile?.title}
                  </span>
                </h2>
                <p className="hero-tagline mb-4">{profile?.tagline}</p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <a href="#projects" className="btn btn-light btn-lg">
                    <i className="bi bi-kanban me-2"></i>
                    Lihat Proyek
                  </a>
                  <a href="#contact" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-envelope me-2"></i>
                    Hubungi Saya
                  </a>
                  {profile?.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      className={`btn btn-outline-light btn-lg hero-download-btn${
                        isDownloading ? " is-loading" : ""
                      }`}
                      download={`Resume ${profile.name}.pdf`}
                      onClick={handleDownloadResume}
                      aria-disabled={isDownloading}
                      aria-busy={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <progress
                            className="hero-download-spinner me-2"
                            aria-label="Sedang memproses unduhan CV"
                          ></progress>
                          Menyiapkan CV...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-download me-2"></i>
                          Unduh CV
                        </>
                      )}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {loading && (
            <div className="col-lg-4 order-1 order-lg-2 d-flex justify-content-center mb-4 mb-lg-0">
              <div className="hero-avatar-wrap">
                <Skeleton className="hero-avatar skeleton-circle" />
              </div>
            </div>
          )}

          {!loading && profile?.avatar && (
            <div className="col-lg-4 order-1 order-lg-2 d-flex justify-content-center mb-4 mb-lg-0">
              <div className="hero-avatar-wrap">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="hero-avatar img-fluid mx-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <a
        href="#about"
        className="hero-scroll-cue d-none d-lg-inline-flex"
        aria-label="Gulir ke bawah"
      >
        <i className="bi bi-chevron-down"></i>
      </a>

      <Toast
        show={toast.show}
        tone={toast.tone}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </section>
  );
}

export default Hero;
