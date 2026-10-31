import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import Marquee from "../components/Marquee.jsx";
import { BEYOND, HERO, MARQUEE, SITE, SKILLS, STATEMENT } from "../data/site.js";

export default function About() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        index="01"
        eyebrow="About"
        title="Curious by nature,"
        accent="builder by practice."
        copy="A student developer who enjoys turning ideas into real things people can use — and learning how every piece fits together along the way."
        image={HERO.image}
        imageAlt={HERO.imageAlt}
        meta={[
          { label: "Role", value: "Student developer" },
          { label: "Focus", value: "Full-stack & data" },
          { label: "Based", value: SITE.based }
        ]}
      />

      <Marquee items={MARQUEE} className="marquee-dark" speed={36} />

      <section className="section about-story">
        <div className="section-head" data-reveal="up">
          <span className="kicker">01 / A little about me</span>
          <div className="section-head-row">
            <h2>Learning in <em>public.</em></h2>
            <p>Still early in the journey — and that&apos;s the exciting part.</p>
          </div>
        </div>

        <div className="about-story-grid">
          <div className="about-story-body" data-reveal="up">
            <p className="about-lead">
              I&apos;m a student developer who enjoys turning ideas into real things people can
              use, and learning how every piece fits together along the way.
            </p>
            <p>
              Right now, I&apos;m exploring web development, Python, AI/ML fundamentals, and data
              analytics. Most of what I know has come from building small, practical projects:
              starting with a real need, making the experience clear, and improving it through
              feedback and testing.
            </p>
            <p>
              I care about work that is honest and useful. No invented milestones, no pretending
              the journey is further along than it is. Just steady progress, thoughtful details,
              and the next thing worth understanding.
            </p>
            <div className="about-note">
              <Sparkles size={17} />
              <span>{STATEMENT.note}</span>
            </div>
          </div>

          <aside className="about-facts" data-reveal="up">
            <div>
              <span>Role</span>
              <strong>Student developer</strong>
            </div>
            <div>
              <span>Focus</span>
              <strong>Full-stack &amp; data</strong>
            </div>
            <div>
              <span>Currently</span>
              <strong>PW Data Analyst course</strong>
            </div>
            <div>
              <span>Based</span>
              <strong>{SITE.based}</strong>
            </div>
            <div>
              <span>Open to</span>
              <strong>Collaborations &amp; feedback</strong>
            </div>
            <Link className="button button-dark" to="/contact">
              Say hello <ArrowUpRight size={15} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section skills-section">
        <div className="section-head" data-reveal="up">
          <span className="kicker">02 / A growing toolkit</span>
          <div className="section-head-row">
            <h2>Things I&apos;m <em>learning.</em></h2>
            <p>
              Grouped by where I&apos;m experimenting. No scores, no percentages — just honest
              progress.
            </p>
          </div>
        </div>

        <div className="skills-grid">
          {SKILLS.map((skill, index) => (
            <article className="skill-card" key={skill.title} data-reveal="up" style={{ "--delay": `${index * 60}ms` }}>
              <span className="skill-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="skill-status">{skill.status}</span>
              <h3>{skill.title}</h3>
              <p>{skill.note}</p>
              <div className="skill-tags">
                {skill.items.map(item => <span key={item}>{item}</span>)}
              </div>
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
          <span className="kicker">04 / See the work</span>
          <h2>Ideas become <em>projects.</em></h2>
          <p>A full-stack civic platform and a clearer school website — with more on the way.</p>
        </div>
        <div className="cta-band-actions">
          <Link className="button button-lime" to="/projects">
            Explore projects <ArrowUpRight size={15} />
          </Link>
          <Link className="text-link text-link-light" to="/journey">
            See the journey <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
