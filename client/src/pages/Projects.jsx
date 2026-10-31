import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import ProjectPreview from "../components/ProjectPreview.jsx";
import Marquee from "../components/Marquee.jsx";
import { PROJECTS, SITE } from "../data/site.js";

const projectMarquee = [
  "CivicGuard",
  "React · Express · SQLite",
  "Gemini triage",
  "School website refresh",
  "HTML · CSS · JavaScript"
];

export default function Projects() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        index="02"
        eyebrow="Projects"
        title="Built to"
        accent="be useful."
        copy="Real projects, real learning. Each one starts with a practical question and ends with something people can actually open and use."
        panel={
          <div className="hero-panel-inner">
            <span className="hero-panel-kicker">Selected work</span>
            <strong>02</strong>
            <p>Full-stack platform · Website refresh</p>
            <div className="hero-panel-tags">
              <span>React</span>
              <span>Express</span>
              <span>SQLite</span>
              <span>Gemini</span>
            </div>
          </div>
        }
        meta={[
          { label: "Projects", value: "02" },
          { label: "Stack", value: "React / Express" },
          { label: "Status", value: "Building" }
        ]}
      />

      <Marquee items={projectMarquee} className="marquee-lime" speed={40} />

      <section className="section projects-section projects-section-page">
        <div className="section-head" data-reveal="up">
          <span className="kicker">01 / The work</span>
          <div className="section-head-row">
            <h2>Two projects, <em>two lessons.</em></h2>
            <p>
              One is a full-stack platform with authentication, data, and AI-assisted triage. The
              other is a focused website refresh built around clarity.
            </p>
          </div>
        </div>

        <div className="project-list">
          {PROJECTS.map(project => (
            <article className="project-card" key={project.slug} data-reveal="up">
              <Link className="project-preview-link" to={`/projects/${project.slug}`} aria-label={`View ${project.title} case study`}>
                <ProjectPreview variant={project.preview} />
              </Link>
              <div className="project-info">
                <div className="project-meta">
                  <span>{project.number} / {project.category}</span>
                  <span>{project.status}</span>
                </div>
                <h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.technologies.map(tech => <span key={tech}>{tech}</span>)}
                </div>
                <div className="project-actions">
                  <Link className="text-link" to={`/projects/${project.slug}`}>
                    View case study <ArrowUpRight size={15} />
                  </Link>
                  {project.liveUrl && (
                    <a className="project-external" href={project.liveUrl} target="_blank" rel="noreferrer">
                      Live project <ArrowUpRight size={13} />
                    </a>
                  )}
                  {project.repositoryUrl && (
                    <a className="project-external" href={project.repositoryUrl} target="_blank" rel="noreferrer">
                      <Github size={13} /> Source
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <a className="github-more" href={SITE.github} target="_blank" rel="noreferrer" data-reveal="up">
          <Github size={16} /> More experiments on GitHub <ArrowUpRight size={14} />
        </a>
      </section>

      <section className="cta-band" data-reveal="up">
        <div className="cta-band-copy">
          <span className="kicker">02 / Build together</span>
          <h2>Have a problem <em>worth solving?</em></h2>
          <p>I&apos;m always looking for a useful problem to explore and a good reason to learn something new.</p>
        </div>
        <div className="cta-band-actions">
          <Link className="button button-lime" to="/contact">
            Start a conversation <ArrowUpRight size={15} />
          </Link>
          <Link className="text-link text-link-light" to="/journey">
            See the journey <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
