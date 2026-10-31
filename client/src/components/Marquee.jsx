export default function Marquee({ items, className = "", speed = 34 }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee ${className}`.trim()} aria-hidden="true">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {row.map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`}>
            {item}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
