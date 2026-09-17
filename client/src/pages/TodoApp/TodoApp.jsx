import { useEffect, useState } from "react";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle.jsx";

const STORAGE_KEY = "portfolio-todo-tasks";

const CATEGORIES = ["Kerja", "Pribadi", "Belajar", "Lainnya"];
const PRIORITIES = ["Rendah", "Sedang", "Tinggi"];

const PRIORITY_ICON = {
  Rendah: "bi-arrow-down",
  Sedang: "bi-dash",
  Tinggi: "bi-arrow-up",
};

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function TodoApp() {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [text, setText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState(PRIORITIES[1]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      // localStorage tidak bisa diakses -- abaikan, data cukup hidup di memori.
    }
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTask = {
      id: Date.now(),
      text: trimmed,
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setText("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="todo-page">
      <div className="container">
        <header className="todo-header">
          <a href="/#projects" className="todo-back-link">
            <i className="bi bi-arrow-left me-2"></i>
            Kembali ke Portofolio
          </a>
          <div>
            <h1 className="todo-title">To-Do List</h1>
            <p className="todo-subtitle">
              Aplikasi manajemen tugas sederhana -- kategori, prioritas, dan
              filter status, tersimpan langsung di browser kamu.
            </p>
          </div>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control todo-input"
            placeholder="Tulis tugas baru..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Tugas baru"
          />

          <select
            className="form-select todo-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Kategori"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="form-select todo-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Prioritas"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary todo-add-btn">
            <i className="bi bi-plus-lg me-1"></i>
            Tambah
          </button>
        </form>

        <div className="todo-toolbar">
          <div className="todo-filters" role="tablist">
            <button
              type="button"
              className={`todo-filter-btn${filter === "all" ? " active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Semua
            </button>
            <button
              type="button"
              className={`todo-filter-btn${
                filter === "active" ? " active" : ""
              }`}
              onClick={() => setFilter("active")}
            >
              Aktif
            </button>
            <button
              type="button"
              className={`todo-filter-btn${
                filter === "completed" ? " active" : ""
              }`}
              onClick={() => setFilter("completed")}
            >
              Selesai
            </button>
          </div>

          <span className="todo-count">
            {remainingCount} tugas tersisa
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="todo-empty">
            {tasks.length === 0
              ? "Belum ada tugas. Tambahkan satu di atas."
              : "Tidak ada tugas pada filter ini."}
          </p>
        ) : (
          <ul className="todo-list list-unstyled">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`todo-item${task.completed ? " completed" : ""}`}
              >
                <label className="todo-item-check">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="todo-item-text">{task.text}</span>
                </label>

                <div className="todo-item-meta">
                  <span className="badge todo-badge">
                    <i className="bi bi-tag-fill me-1"></i>
                    {task.category}
                  </span>
                  <span className="badge todo-badge">
                    <i className={`bi ${PRIORITY_ICON[task.priority]} me-1`}></i>
                    {task.priority}
                  </span>
                  <button
                    type="button"
                    className="todo-delete-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Hapus tugas ${task.text}`}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {tasks.some((task) => task.completed) && (
          <div className="todo-footer-actions">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={clearCompleted}
            >
              Hapus semua yang selesai
            </button>
          </div>
        )}
      </div>

      <ThemeToggle />
    </div>
  );
}

export default TodoApp;
