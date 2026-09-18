import useFetch from "../../hooks/useFetch.js";
import useReveal from "../../hooks/useReveal.js";
import { getExperience, getProjects, getSkills } from "../../services/api.js";

// Mengambil tahun pertama dari string periode seperti "Nov 2019 – Jul 2026"
// atau "2019 - Sekarang", lalu menghitung sudah berapa tahun berjalan sejak
// itu. Dibuat sesederhana mungkin (cari 4 digit angka pertama) supaya tidak
// perlu format tanggal yang kaku di data JSON.
function yearsSince(periodText) {
  const match = periodText?.match(/\d{4}/);
  if (!match) return null;
  const startYear = Number(match[0]);
  const years = new Date().getFullYear() - startYear;
  return years > 0 ? years : 1;
}

function Highlights() {
  const { data: experience } = useFetch(getExperience, []);
  const { data: projects } = useFetch(getProjects, []);
  const { data: skills } = useFetch(getSkills, []);
  const revealRef = useReveal();

  const years = yearsSince(experience?.[0]?.period);
  const stats = [
    years && {
      value: `${years}+`,
      label: "Tahun Pengalaman",
      icon: "bi-briefcase-fill",
    },
    projects?.length && {
      value: `${projects.length}+`,
      label: "Proyek Dikerjakan",
      icon: "bi-kanban-fill",
    },
    skills?.length && {
      value: `${skills.length}+`,
      label: "Teknologi & Tools",
      icon: "bi-stack",
    },
  ].filter(Boolean);

  // Kalau data belum siap (masih loading atau backend belum jalan),
  // jangan tampilkan apa-apa daripada menampilkan strip kosong.
  if (stats.length === 0) return null;

  return (
    <section
      className="highlights reveal"
      ref={revealRef}
      aria-label="Ringkasan singkat"
    >
      <div className="container">
        <div className="highlights-grid">
          {stats.map((stat) => (
            <div className="highlight-item" key={stat.label}>
              <i className={`bi ${stat.icon}`}></i>
              <div>
                <span className="highlight-value">{stat.value}</span>
                <span className="highlight-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Highlights;
