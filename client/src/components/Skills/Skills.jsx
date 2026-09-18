import useFetch from "../../hooks/useFetch.js";
import useReveal from "../../hooks/useReveal.js";
import { getSkills } from "../../services/api.js";
import Skeleton from "../Skeleton/Skeleton.jsx";

const categoryIcons = {
  Frontend: "bi-code-slash",
  Backend: "bi-hdd-network-fill",
  Tools: "bi-tools",
  "Soft Skills": "bi-people-fill",
};

function categoryIcon(category) {
  return categoryIcons[category] || "bi-star-fill";
}

// Dipisah jadi komponen sendiri (bukan langsung di dalam .map di Skills)
// supaya tiap pill bisa punya IntersectionObserver-nya masing-masing lewat
// useReveal -- kalau dipanggil langsung di dalam callback .map, jumlah
// pemanggilan hook akan berubah-ubah (0 saat loading, N setelah data
// datang) dan melanggar Rules of Hooks React.
function SkillPill({ skill, index }) {
  const revealRef = useReveal();

  return (
    <div
      className="skill-pill reveal"
      ref={revealRef}
      style={{ "--reveal-delay": `${Math.min(index * 45, 400)}ms` }}
    >
      <i className={`bi ${categoryIcon(skill.category)}`}></i>
      <span>{skill.name}</span>
    </div>
  );
}

function Skills() {
  const { data: skills, loading, error } = useFetch(getSkills, []);
  const revealRef = useReveal();

  return (
    <section id="skills" className="section skills-section reveal" ref={revealRef}>
      <div className="container">
        <h2 className="section-title mb-2">Toolkit Saya</h2>
        <p className="skills-hint mb-4">
          Kumpulan bahasa, framework dan tools yang biasa saya pakai
          sehari-hari.
        </p>

        {loading && (
          <div aria-busy="true" aria-label="Memuat data skill">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="skeleton-pill" />
            ))}
          </div>
        )}
        {error && <p className="text-danger">Gagal memuat data skill.</p>}

        <div className="skills-grid">
          {skills?.map((skill, index) => (
            <SkillPill skill={skill} index={index} key={skill.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
