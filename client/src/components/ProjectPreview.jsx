export default function ProjectPreview({ variant = "civic" }) {
  if (variant === "school") {
    return (
      <div className="preview preview-school" aria-hidden="true">
        <div className="preview-bar">
          <span className="preview-dots"><i /><i /><i /></span>
          <span className="preview-url">school-website.refresh</span>
          <span className="preview-badge">UI PREVIEW</span>
        </div>
        <div className="school-bar">
          <span>SCHOOL WEBSITE</span>
          <span>ABOUT&nbsp;&nbsp; ACADEMICS&nbsp;&nbsp; ADMISSIONS</span>
        </div>
        <div className="school-body">
          <span className="school-kicker">LEARN. GROW. LEAD.</span>
          <b>A brighter<br />way to learn.</b>
          <p>One place for notices, links, and school life.</p>
          <span className="school-btn">EXPLORE ↗</span>
        </div>
        <div className="school-cards">
          <span>📌 Latest notices</span>
          <span>📚 Quick links</span>
          <span>✦ School life</span>
        </div>
      </div>
    );
  }

  return (
    <div className="preview preview-civic" aria-hidden="true">
      <div className="preview-bar">
        <span className="preview-dots"><i /><i /><i /></span>
        <span className="preview-url">civicguard / project preview</span>
        <span className="preview-badge">UI PREVIEW</span>
      </div>
      <div className="civic-top">
        <span className="civic-brand"><b>C</b> CivicGuard</span>
        <span className="civic-nav">Dashboard&nbsp;&nbsp; Report&nbsp;&nbsp; About</span>
      </div>
      <div className="civic-body">
        <div className="civic-copy">
          <span className="civic-kicker">YOUR NEIGHBOURHOOD, HEARD.</span>
          <b>Better streets<br />start with a<br /><em>report.</em></b>
          <span className="civic-btn">Report an issue ↗</span>
        </div>
        <div className="civic-map">
          <span className="map-road road-a" />
          <span className="map-road road-b" />
          <span className="map-road road-c" />
          <span className="map-pin pin-a" />
          <span className="map-pin pin-b" />
          <span className="map-pin pin-c" />
          <span className="map-label">MAP PREVIEW</span>
        </div>
      </div>
      <div className="civic-foot">
        <span>Issue reporting</span>
        <span>Gemini-assisted triage</span>
      </div>
    </div>
  );
}
