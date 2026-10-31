import Contour from "./Contour.jsx";

export default function PageHero({ index, eyebrow, title, accent, copy, image, imageAlt, meta = [], panel }) {
  return (
    <section className="page-hero">
      <Contour className="page-hero-contour" />
      <div className="page-hero-copy" data-reveal="up">
        <span className="kicker">{index} / {eyebrow}</span>
        <h1>
          {title}
          {accent && <em>{accent}</em>}
        </h1>
        <p>{copy}</p>
        {meta.length > 0 && (
          <dl className="page-hero-meta">
            {meta.map(item => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {image ? (
        <figure className="page-hero-media" data-reveal="up">
          <img src={image} alt={imageAlt} decoding="async" />
          <figcaption>
            <span>Rakshit Thakur</span>
            <span>Student developer / 2026</span>
          </figcaption>
        </figure>
      ) : (
        <div className="page-hero-panel" data-reveal="up">
          {panel}
        </div>
      )}
    </section>
  );
}
