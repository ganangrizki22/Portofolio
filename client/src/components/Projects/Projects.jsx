import useFetch from "../../hooks/useFetch.js";
import { getProjects } from "../../services/api.js";

function Projects() {
  const { data: projects, loading, error } = useFetch(getProjects, []);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <h2 className="section-title mb-2">Proyek</h2>
        <p className="projects-hint mb-4">
          Beberapa proyek yang pernah saya kerjakan.
        </p>

        {loading && <p>Memuat...</p>}
        {error && <p className="text-danger">Gagal memuat data proyek.</p>}

        <div className="projects-stack">
          {projects?.map((project, index) => (
            <article
              className={`project-panel${
                index % 2 === 1 ? " project-panel-alt" : ""
              }`}
              key={project.id}
            >
              <div className="project-panel-index">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="project-panel-body">
                <h3 className="project-panel-title">
                  <i className="bi bi-folder2-open me-2"></i>
                  {project.title}
                </h3>
                <p className="project-panel-desc">{project.description}</p>
                <div className="project-panel-tags">
                  {project.tags.map((tag) => (
                    <span className="badge project-badge me-1" key={tag}>
                      <i className="bi bi-tag-fill me-1"></i>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="d-flex gap-2 mt-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-github me-1"></i>
                      Kode Sumber
                    </a>
                  )}
                </div>
              </div>

              {project.internalUrl && (
                <div className="project-panel-overlay">
                  <div className="project-panel-overlay-inner">
                    <i className="bi bi-box-arrow-up-right"></i>
                    <p className="project-panel-overlay-title">
                      {project.title}
                    </p>
                    <a
                      href={project.internalUrl}
                      className="btn btn-primary btn-lg"
                    >
                      Pergi Ke <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
