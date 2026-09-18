import useFetch from "../../hooks/useFetch.js";
import useActiveSection from "../../hooks/useActiveSection.js";
import { getProfile } from "../../services/api.js";

const navLinks = [
  { href: "#about", label: "Tentang", icon: "bi-person-fill" },
  { href: "#experience", label: "Pengalaman", icon: "bi-briefcase-fill" },
  { href: "#skills", label: "Skill", icon: "bi-tools" },
  { href: "#projects", label: "Proyek", icon: "bi-kanban-fill" },
  { href: "#contact", label: "Kontak", icon: "bi-envelope-fill" },
];

const sectionIds = navLinks.map((link) => link.href.slice(1));

function Navbar() {
  const { data: profile } = useFetch(getProfile, []);
  const activeId = useActiveSection(sectionIds);

  return (
    <>
      <header className="app-navbar">
        <div className="container d-flex align-items-center justify-content-between">
          <a className="navbar-brand d-flex align-items-center" href="#hero">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name || "Portofolio"}
                className="navbar-avatar"
              />
            ) : (
              <span className="fw-bold">{profile?.name || "Portofolio"}</span>
            )}
          </a>

          <ul className="app-navbar-links d-none d-xl-flex align-items-center list-unstyled mb-0">
            {navLinks.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={isActive ? "active" : undefined}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <i className={`bi ${link.icon} me-2`}></i>
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            className="navbar-menu-toggle d-xl-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-label="Buka menu"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </header>

      <div
        className="offcanvas offcanvas-end app-offcanvas"
        tabIndex="-1"
        id="mainNav"
        aria-labelledby="mainNavLabel"
      >
        <div className="offcanvas-header">
          <span className="offcanvas-title" id="mainNavLabel">
            {profile?.name || "Menu"}
          </span>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Tutup"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="offcanvas-nav list-unstyled">
            {navLinks.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-bs-dismiss="offcanvas"
                    className={isActive ? "active" : undefined}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <i className={`bi ${link.icon} me-2`}></i>
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
