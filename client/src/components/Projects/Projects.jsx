import useFetch from "../../hooks/useFetch.js";
import useReveal from "../../hooks/useReveal.js";
import { getProjects } from "../../services/api.js";
import Skeleton from "../Skeleton/Skeleton.jsx";

// Dipisah jadi komponen sendiri (bukan langsung di dalam .map di Projects)
// supaya tiap panel bisa punya IntersectionObserver-nya masing-masing lewat
// useReveal, tanpa melanggar Rules of Hooks React (jumlah item proyek baru
// diketahui setelah data selesai di-fetch).
function ProjectPanel({ project, index }) {
  const revealRef = useReveal();
  const hasLinks = project.demoUrl || project.repoUrl;
  // internalUrl biasanya halaman demo di situs sendiri (mis. /todo.html),
  // tapi bisa juga link keluar (mis. https://ovelia.my.id) -- kalau bentuknya
  // URL lengkap, buka di tab baru supaya pengunjung tidak "kelempar" keluar
  // dari portofolio tanpa sadar.
  const isExternalInternalUrl = /^https?:\/\//.test(project.internalUrl || "");

  return (
    <article
      className={`project-panel reveal${
        index % 2 === 1 ? " project-panel-alt" : ""
      }`}
      ref={revealRef}
      style={{ "--reveal-delay": `${Math.min(index * 90, 400)}ms` }}
    >
      <div className="project-panel-visual">
        {project.image ? (
          <div className="project-panel-frame">
            <div className="project-panel-frame-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <img
              src={project.image}
              alt={`Tampilan ${project.title}`}
              loading="lazy"
            />

            {project.internalUrl && (
              <div className="project-panel-overlay">
                <div className="project-panel-overlay-inner">
                  <i className="bi bi-box-arrow-up-right"></i>
                  <p className="project-panel-overlay-title">{project.title}</p>
                  <a
                    href={project.internalUrl}
                    className="btn btn-primary"
                    {...(isExternalInternalUrl
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    Pergi Ke <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="project-panel-confidential">
            <i className="bi bi-shield-lock-fill"></i>
            <p className="mb-0 fw-semibold">Proyek Internal</p>
            {project.company && (
              <p className="mb-0 project-panel-confidential-company">
                {project.company}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="project-panel-body">
        <div className="project-panel-index">
          {String(index + 1).padStart(2, "0")}
        </div>
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
        {project.secondtags?.length > 0 && (
          <div className="project-panel-tags">
            {project.secondtags.map((tagsecond) => (
              <span className="badge project-badge me-1" key={tagsecond}>
                <i className="bi bi-tag me-1"></i>
                {tagsecond}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 mt-3">
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
          {!hasLinks && project.company && (
            <span className="badge project-panel-internal-badge">
              <i className="bi bi-building-lock me-1"></i>
              Proyek Perusahaan &middot; Tidak Dipublikasikan
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function Projects() {
  const { data: projects, loading, error } = useFetch(getProjects, []);
  const revealRef = useReveal();

  return (
    <section
      id="projects"
      className="section projects-section reveal"
      ref={revealRef}
    >
      <div className="container">
        <h2 className="section-title mb-2">Proyek</h2>
        <p className="projects-hint mb-4">
          Beberapa proyek yang pernah saya kerjakan.
        </p>

        {loading && (
          <div aria-busy="true" aria-label="Memuat data proyek">
            <Skeleton className="skeleton-card" />
            <Skeleton className="skeleton-card" />
          </div>
        )}
        {error && <p className="text-danger">Gagal memuat data proyek.</p>}

        <div className="projects-stack">
          {projects?.map((project, index) => (
            <ProjectPanel project={project} index={index} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
