import useFetch from "../../hooks/useFetch.js";
import { getProfile } from "../../services/api.js";

function Hero() {
  const { data: profile, loading } = useFetch(getProfile, []);

  return (
    <section id="hero" className="hero d-flex align-items-center">
      <div className="container text-center text-lg-start">
        <div className="row align-items-center">
          <div className="col-lg-8 order-2 order-lg-1">
            {loading ? (
              <p className="text-light">Memuat data profil...</p>
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
                </div>
              </>
            )}
          </div>

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
