import useFetch from "../../hooks/useFetch.js";
import { getProfile } from "../../services/api.js";
import Skeleton from "../Skeleton/Skeleton.jsx";

function Hero() {
  const { data: profile, loading } = useFetch(getProfile, []);

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
                      className="btn btn-outline-light btn-lg"
                      download={`Resume ${profile.name}.pdf`}
                    >
                      <i className="bi bi-download me-2"></i>
                      Unduh CV
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
    </section>
  );
}

export default Hero;
