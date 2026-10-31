export default function NowCard({ className = "" }) {
  return (
    <aside className={`now-card ${className}`.trim()} aria-label="What I am working on now">
      <div className="now-top">
        <span>Currently</span>
        <span className="now-pill">Building</span>
      </div>

      <svg className="now-route" viewBox="0 0 220 74" fill="none" aria-hidden="true">
        <path
          d="M6 56c18 0 18-34 38-34s20 30 40 30 18-38 40-38 20 34 40 34 16-22 34-22"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="3 5"
        />
        <circle cx="6" cy="56" r="3" fill="currentColor" />
        <circle cx="198" cy="26" r="4" fill="currentColor" />
      </svg>

      <div className="now-main">
        <strong>CivicGuard</strong>
        <span>Municipal incident intelligence</span>
      </div>

      <ul className="now-list">
        <li><span>Learning</span><b>Data analytics</b></li>
        <li><span>Exploring</span><b>AI / ML</b></li>
      </ul>

      <div className="now-bottom">
        <span>Open to collaborations</span>
        <span>2026</span>
      </div>
    </aside>
  );
}
