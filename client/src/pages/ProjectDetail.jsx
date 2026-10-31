import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Github } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview.jsx";
import { PROJECTS } from "../data/site.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = PROJECTS.find(item => item.slug === slug);
  const index = PROJECTS.findIndex(item => item.slug === slug);
  const nextProject = index >= 0 ? PROJECTS[(index + 1) % PROJECTS.length] : null;

  useEffect(() => {
    document.title = project
      ? `${project.title} — Rakshit Thakur`
      : "Project unavailable — Rakshit Thakur";
  }, [project]);

  if (!project) {
    return (
      <main id="main-content" tabIndex={-1} className="case-study">
        <div className="case-missing" data-reveal="up">
          <span className="kicker">Project unavailable</span>
          <h1>That case study <em>isn&apos;t here.</em></h1>
          <p>The project may have moved, or the link might be out of date.</p>
          <Link className="button button-dark" to="/projects">
            <ArrowLeft size={15} /> Back to all projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="case-study">
      <div className="case-top">
        <Link className="back-link" to="/projects">
          <ArrowLeft size={14} /> All projects
        </Link>
        <span className="case-label">Case study / {project.number}</span>
      </div>

      <header className="case-hero">
        <div className="case-hero-copy" data-reveal="up">
          <span className="kicker">{project.category}</span>
          <h1>{project.title}</h1>
          <p className="case-subtitle">{project.subtitle}</p>
          <p className="case-intro">{project.description}</p>
          <div className="case-actions">
            {project.liveUrl && (
              <a className="button button-dark" href={project.liveUrl} target="_blank" rel="noreferrer">
                Visit hosted demo <ArrowUpRight size={15} />
              </a>
            )}
            {project.repositoryUrl && (
              <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">
                <Github size={15} /> View source
              </a>
            )}
            {!project.liveUrl && !project.repositoryUrl && (
              <Link className="text-link" to="/contact">
                Ask about this project <ArrowUpRight size={15} />
              </Link>
            )}
          </div>
        </div>

        <dl className="case-meta" data-reveal="up">
          <div><dt>Role</dt><dd>Design &amp; development</dd></div>
          <div><dt>Category</dt><dd>{project.category}</dd></div>
          <div><dt>Status</dt><dd>{project.status}</dd></div>
          <div><dt>Tools</dt><dd>{project.technologies.join(" · ")}</dd></div>
        </dl>
      </header>

      <div className="case-preview" data-reveal="up">
        <ProjectPreview variant={project.preview} />
        <p className="case-preview-caption">Illustrative interface preview, not a screenshot of the live project.</p>
      </div>

      <section className="case-body">
        <div className="case-main" data-reveal="up">
          <span className="kicker">01 / Overview</span>
          <h2>Making something <em>useful.</em></h2>
          <p>{project.full}</p>

          <span className="kicker case-kicker">02 / What it does</span>
          <ul className="case-highlights">
            {project.highlights.map(item => (
              <li key={item}><Check size={15} /> {item}</li>
            ))}
          </ul>

          <span className="kicker case-kicker">03 / Implementation</span>
          <ul className="case-highlights">
            {project.implementation.map(item => (
              <li key={item}><Check size={15} /> {item}</li>
            ))}
          </ul>
        </div>

        <aside className="case-side" data-reveal="up">
          <div className="case-side-block">
            <span className="kicker">Tools &amp; technologies</span>
            <div className="project-tags">
              {project.technologies.map(tech => <span key={tech}>{tech}</span>)}
            </div>
          </div>
          <div className="case-side-block">
            <span className="kicker">A note on details</span>
            <p>These notes describe the documented build, not proposed features.</p>
          </div>
          <div className="case-side-block">
            <span className="kicker">Project</span>
            <strong>{project.number} / {String(PROJECTS.length).padStart(2, "0")}</strong>
            <p>{project.status}</p>
          </div>
        </aside>
      </section>

      {project.availabilityNote && (
        <p className="case-availability">{project.availabilityNote}</p>
      )}

      {nextProject && nextProject.slug !== project.slug && (
        <Link className="case-next" to={`/projects/${nextProject.slug}`} data-reveal="up">
          <span>
            <span className="kicker">Next project</span>
            <strong>{nextProject.title}</strong>
          </span>
          <ArrowUpRight size={26} />
        </Link>
      )}
    </main>
  );
}
