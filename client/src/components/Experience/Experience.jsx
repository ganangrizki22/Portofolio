import useFetch from "../../hooks/useFetch.js";
import { getExperience } from "../../services/api.js";

function Experience() {
  const { data: experience, loading, error } = useFetch(getExperience, []);

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <h2 className="section-title mb-4">Pengalaman</h2>

        {loading && <p>Memuat...</p>}
        {error && (
          <p className="text-danger">Gagal memuat data pengalaman.</p>
        )}

        <div className="experience-timeline">
          {experience?.map((item) => (
            <div className="experience-item" key={item.id}>
              <div className="experience-item-header">
                <h3 className="h5 mb-1">
                  <i className="bi bi-briefcase-fill me-2"></i>
                  {item.role}
                </h3>
                <span className="experience-period">
                  <i className="bi bi-calendar3 me-1"></i>
                  {item.period}
                </span>
              </div>
              <p className="experience-company mb-2">
                <i className="bi bi-building me-1"></i>
                {item.company}
              </p>
              <ul className="experience-points">
                {item.points.map((point) => (
                  <li key={point}>
                    <i className="bi bi-check2-circle"></i>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
