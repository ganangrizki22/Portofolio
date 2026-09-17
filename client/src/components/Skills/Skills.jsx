import useFetch from "../../hooks/useFetch.js";
import { getSkills } from "../../services/api.js";

const categoryIcons = {
  Frontend: "bi-code-slash",
  Backend: "bi-hdd-network-fill",
  Tools: "bi-tools",
  "Soft Skills": "bi-people-fill",
};

function categoryIcon(category) {
  return categoryIcons[category] || "bi-star-fill";
}

function Skills() {
  const { data: skills, loading, error } = useFetch(getSkills, []);

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <h2 className="section-title mb-2">Toolkit Saya</h2>
        <p className="skills-hint mb-4">
          Kumpulan bahasa, framework dan tools yang biasa saya pakai
          sehari-hari.
        </p>

        {loading && <p>Memuat...</p>}
        {error && <p className="text-danger">Gagal memuat data skill.</p>}

        <div className="skills-grid">
          {skills?.map((skill) => (
            <div className="skill-pill" key={skill.id}>
              <i className={`bi ${categoryIcon(skill.category)}`}></i>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
