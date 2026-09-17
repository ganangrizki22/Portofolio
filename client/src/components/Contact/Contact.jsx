import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import { getProfile, sendContactMessage } from "../../services/api.js";

const socialIcons = {
  github: "bi-github",
  linkedin: "bi-linkedin",
  instagram: "bi-instagram",
  twitter: "bi-twitter-x",
  facebook: "bi-facebook",
  youtube: "bi-youtube",
};

function socialIcon(platform) {
  return socialIcons[platform.toLowerCase()] || "bi-link-45deg";
}

const initialForm = { name: "", email: "", phone: "", message: "" };

function Contact() {
  const { data: profile } = useFetch(getProfile, []);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      const res = await sendContactMessage(form);
      setStatus({ state: "success", message: res.message });
      setForm(initialForm);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Gagal mengirim pesan. Pastikan backend berjalan.";
      setStatus({ state: "error", message });
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title mb-2">Kontak</h2>
        <p className="contact-hint mb-4">
          Kalau ada proyek, kolaborasi, atau sekadar mau ngobrol, jangan ragu
          untuk menghubungi saya.
        </p>

        {profile?.socials && (
          <div className="d-flex flex-wrap gap-3 mb-4 contact-socials">
            {Object.entries(profile.socials).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="contact-social-link"
                aria-label={platform}
                title={platform}
              >
                <i className={`bi ${socialIcon(platform)}`}></i>
              </a>
            ))}
          </div>
        )}

        {profile && (
          <ul className="list-unstyled contact-info mb-4">
            {(profile.emails || [profile.email]).filter(Boolean).map((email) => (
              <li key={email}>
                <i className="bi bi-envelope-fill"></i>
                <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
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
        )}

        <form className="row g-3 contact-form" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="name" className="form-label">
              <i className="bi bi-person-fill me-1"></i>
              Nama
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="email" className="form-label">
              <i className="bi bi-envelope-fill me-1"></i>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="phone" className="form-label">
              <i className="bi bi-telephone-fill me-1"></i>
              Nomor Telepon
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="message" className="form-label">
              <i className="bi bi-chat-left-text-fill me-1"></i>
              Pesan
            </label>
            <textarea
              className="form-control"
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status.state === "loading"}
            >
              {status.state === "loading" ? (
                "Mengirim..."
              ) : (
                <>
                  <i className="bi bi-send-fill me-2"></i>
                  Kirim Pesan
                </>
              )}
            </button>
          </div>

          {status.state === "success" && (
            <p className="text-success mt-2">
              <i className="bi bi-check-circle-fill me-1"></i>
              {status.message}
            </p>
          )}
          {status.state === "error" && (
            <p className="text-danger mt-2">
              <i className="bi bi-exclamation-triangle-fill me-1"></i>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
