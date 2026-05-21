export default function EventSection({ eyebrow, title, copy, children }) {
  return (
    <section className="section neo-section">
      <div className="neo-accent neo-accent-blue" />
      <div className="neo-accent neo-accent-orange" />
      <div className="neo-accent neo-accent-green" />
      <div className="section-header">
        <div className="section-hero-copy">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1 className="page-title">{title}</h1>
          <p className="lead">{copy}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
