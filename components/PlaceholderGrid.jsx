export default function PlaceholderGrid({ items = [] }) {
  return (
    <div className="placeholder-grid">
      {items.map((item) => (
        <article
          className="placeholder-card"
          key={item.title}
          style={{
            "--accent-a": item.accentA || "#4f8cff",
            "--accent-b": item.accentB || "#f3b36a",
            "--accent-c": item.accentC || "#69f0ae",
          }}
        >
          <span className="placeholder-index">{item.index}</span>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </article>
      ))}
    </div>
  );
}
