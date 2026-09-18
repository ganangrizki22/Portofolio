import useFetch from "../../hooks/useFetch.js";
import useReveal from "../../hooks/useReveal.js";
import { getTestimonials } from "../../services/api.js";
import Skeleton from "../Skeleton/Skeleton.jsx";

// Dipisah jadi komponen sendiri (bukan langsung di dalam .map di Testimonials)
// supaya tiap kartu bisa punya IntersectionObserver-nya masing-masing lewat
// useReveal, mengikuti pola yang sama dengan Skills/Projects.
function TestimonialCard({ testimonial, index }) {
  const revealRef = useReveal();
  const paragraphs = testimonial.quote.split("\n\n");

  return (
    <div
      className="testimonial-card reveal"
      ref={revealRef}
      style={{ "--reveal-delay": `${Math.min(index * 120, 400)}ms` }}
    >
      <i className="bi bi-quote testimonial-quote-icon"></i>

      <div className="testimonial-body">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="testimonial-footer">
        <p className="testimonial-name mb-0">{testimonial.name}</p>
        <p className="testimonial-title mb-0">{testimonial.title}</p>
        {testimonial.relation && (
          <p className="testimonial-relation mb-0">
            <i className="bi bi-person-check-fill me-1"></i>
            {testimonial.relation}
          </p>
        )}
        <p className="testimonial-meta mb-0">
          {testimonial.source && (
            <span className="testimonial-source">
              <i className="bi bi-linkedin me-1"></i>
              {testimonial.source}
            </span>
          )}
          {testimonial.date && (
            <span className="testimonial-date">{testimonial.date}</span>
          )}
        </p>
      </div>
    </div>
  );
}

function Testimonials() {
  const { data: testimonials, loading, error } = useFetch(getTestimonials, []);
  const revealRef = useReveal();

  return (
    <section
      id="testimonials"
      className="section testimonials-section reveal"
      ref={revealRef}
    >
      <div className="container">
        <h2 className="section-title mb-2">Testimoni</h2>
        <p className="testimonials-hint mb-4">
          Rekomendasi asli dari rekan dan atasan yang pernah bekerja langsung
          dengan saya, diambil dari profil LinkedIn saya.
        </p>

        {loading && (
          <div className="row g-4" aria-busy="true" aria-label="Memuat testimoni">
            <div className="col-md-6">
              <Skeleton className="skeleton-card" />
            </div>
            <div className="col-md-6">
              <Skeleton className="skeleton-card" />
            </div>
          </div>
        )}
        {error && <p className="text-danger">Gagal memuat data testimoni.</p>}

        <div className="row g-4">
          {testimonials?.map((testimonial, index) => (
            <div className="col-md-6" key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
