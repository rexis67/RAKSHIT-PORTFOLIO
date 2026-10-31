import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Code2, Compass } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import { BEYOND, TIMELINE } from "../data/site.js";

const focus = [
  {
    icon: <BookOpen size={18} />,
    label: "Learning",
    title: "Data analytics",
    copy: "Working through the PW Data Analyst course and building practical data skills."
  },
  {
    icon: <Code2 size={18} />,
    label: "Building",
    title: "Full-stack projects",
    copy: "Turning ideas into interfaces, APIs, and databases — one project at a time."
  },
  {
    icon: <Compass size={18} />,
    label: "Exploring",
    title: "AI / ML fundamentals",
    copy: "Reading, experimenting, and learning how intelligent tools actually work."
  }
];

export default function Journey() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        index="03"
        eyebrow="Journey"
        title="Learning by"
        accent="doing."
        copy="No invented milestones — just the courses, projects, and questions shaping what I learn next."
        panel={
          <div className="hero-panel-inner hero-panel-journey">
            <span className="hero-panel-kicker">The path so far</span>
            <div className="hero-panel-path">
              <span>NOW</span>
              <i />
              <span>01</span>
              <i />
              <span>02</span>
              <i />
              <span>NEXT</span>
            </div>
            <p>Course · Practice · Projects · What comes next</p>
          </div>
        }
        meta={[
          { label: "Course", value: "Data analytics" },
          { label: "Practice", value: "Full-stack" },
          { label: "Next", value: "AI / ML" }
        ]}
      />

      <section className="section timeline-section">
        <div className="section-head" data-reveal="up">
          <span className="kicker">01 / The journey so far</span>
          <div className="section-head-row">
            <h2>Every step <em>counted.</em></h2>
            <p>
              The formal course, the independent practice, and the projects where the two meet.
              Everything here is either in progress or already built.
            </p>
          </div>
        </div>

        <ol className="timeline-list timeline-list-page">
          {TIMELINE.map((item, index) => (
            <li className="timeline-item" key={`${item.title}-${index}`} data-reveal="up" style={{ "--delay": `${index * 50}ms` }}>
              <span className="timeline-year">{item.marker}</span>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-body">
                <span className="timeline-kicker">{item.kicker}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <span className="timeline-state">{item.state}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section focus-section">
        <div className="section-head" data-reveal="up">
          <span className="kicker">02 / Right now</span>
          <div className="section-head-row">
            <h2>What I&apos;m <em>focused on.</em></h2>
            <p>Three threads running in parallel — a course, a build, and the next thing to understand.</p>
          </div>
        </div>

        <div className="focus-grid">
          {focus.map((item, index) => (
            <article className="focus-card" key={item.title} data-reveal="up" style={{ "--delay": `${index * 60}ms` }}>
              <span className="focus-icon">{item.icon}</span>
              <span className="focus-label">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section beyond-section">
        <div className="section-head" data-reveal="up">
          <span className="kicker">03 / Beyond the editor</span>
          <div className="section-head-row">
            <h2>Curiosity is part <em>of the process.</em></h2>
            <p>
              I like learning by experimenting: explore a question, make a small tool, and see what
              the next iteration teaches me.
            </p>
          </div>
        </div>

        <div className="beyond-grid">
          {BEYOND.map((item, index) => (
            <article className="beyond-card" key={item.title} data-reveal="up" style={{ "--delay": `${index * 60}ms` }}>
              <span className="beyond-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band" data-reveal="up">
        <div className="cta-band-copy">
          <span className="kicker">04 / Keep going</span>
          <h2>The next step is <em>the interesting one.</em></h2>
          <p>See what the learning has turned into, or start a conversation about what comes next.</p>
        </div>
        <div className="cta-band-actions">
          <Link className="button button-lime" to="/projects">
            Explore projects <ArrowUpRight size={15} />
          </Link>
          <Link className="text-link text-link-light" to="/contact">
            Say hello <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
