import useFetch from "../../hooks/useFetch.js";
import { getProfile } from "../../services/api.js";

function About() {
  const { data: profile, loading, error } = useFetch(getProfile, []);

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <h2 className="section-title mb-4">Tentang Saya</h2>

        {loading && <p>Memuat...</p>}
        {error && (
          <p className="text-danger">
            Gagal memuat data profil. Pastikan backend (server Node.js) sudah
            berjalan.
          </p>
        )}

        {profile && (
          <div className="row align-items-center g-4 my-3">
            {profile.aboutPhoto && (
              <div className="col-lg-4 d-flex justify-content-center">
                <img
                  src={profile.aboutPhoto}
                  alt={profile.name}
                  className="about-avatar img-fluid mx-auto"
                />
              </div>
            )}
            <div className={profile.aboutPhoto ? "col-lg-8" : "col-lg-12"}>
              <p className="about-text">{profile.about}</p>
              <ul className="list-unstyled about-meta">
                <li>
                  <i className="bi bi-geo-alt-fill"></i>
                  <strong>Lokasi:</strong> {profile.location}
                </li>
                {(profile.emails || [profile.email])
                  .filter(Boolean)
                  .map((email) => (
                    <li key={email}>
                      <i className="bi bi-envelope-fill"></i>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${email}`}>{email}</a>
                    </li>
                  ))}
                {profile.phone && (
                  <li>
                    <i className="bi bi-telephone-fill"></i>
                    <strong>Telepon:</strong>{" "}
                    <a href={`tel:${profile.phone.replace(/[\s-]/g, "")}`}>
                      {profile.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {profile &&
          (profile.education?.length > 0 || profile.languages?.length > 0) && (
            <div className="row g-4 mt-1 about-extra">
              {profile.education?.length > 0 && (
                <div className="col-md-6">
                  <h3 className="h5 mb-3">
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    Pendidikan
                  </h3>
                  {profile.education.map((edu) => (
                    <div className="education-item mb-2" key={edu.school}>
                      {edu.logo && (
                        <img
                          src={edu.logo}
                          alt={edu.school}
                          className="education-logo"
                        />
                      )}
                      <div>
                        <p className="mb-0 fw-semibold">{edu.school}</p>
                        <p className="mb-0 text-muted">
                          {edu.degree} ({edu.period})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profile.languages?.length > 0 && (
                <div className="col-md-6">
                  <h3 className="h5 mb-3">
                    <i className="bi bi-translate me-2"></i>
                    Bahasa
                  </h3>
                  <ul className="list-unstyled about-meta">
                    {profile.languages.map((lang) => (
                      <li key={lang.name}>
                        <i className="bi bi-check-circle-fill"></i>
                        {lang.name} – {lang.level}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  );
}

export default About;
