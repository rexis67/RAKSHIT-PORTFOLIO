import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Code2 } from "lucide-react";
import Contour from "../components/Contour.jsx";
import Marquee from "../components/Marquee.jsx";
import NowCard from "../components/NowCard.jsx";
import ProjectPreview from "../components/ProjectPreview.jsx";
import ContactForm from "../components/ContactForm.jsx";
import {
  BEYOND, HERO, MARQUEE, PROJECTS, PROJECT_EVIDENCE, SITE, SKILLS, STATEMENT, TIMELINE
} from "../data/site.js";

function Hero() {
  const heroRef = useRef(null);
  const dust = Array.from({ length: 22 }, (_, index) => ({
    left: `${(index * 47 + 13) % 100}%`,
    top: `${(index * 61 + 9) % 100}%`,
    size: `${index % 5 === 0 ? 4 : index % 3 === 0 ? 3 : 2}px`,
    delay: `${-((index * 7) % 19)}s`,
    duration: `${12 + (index * 11) % 17}s`
  }));

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    let frame = 0;
    function updateScrollProgress() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height));
        hero.style.setProperty("--hero-scroll", String(progress));
        hero.style.setProperty("--hero-shift", `${progress * 52}px`);
        hero.style.setProperty("--hero-up-35", `${progress * -18}px`);
        hero.style.setProperty("--hero-up-70", `${progress * -36}px`);
        hero.style.setProperty("--hero-up-25", `${progress * -13}px`);
        hero.style.setProperty("--hero-down-50", `${progress * 26}px`);
        hero.style.setProperty("--hero-contour-shift", `${progress * -26}px`);
        hero.style.setProperty("--hero-opacity", String(1 - progress * 0.4));
        frame = 0;
      });
    }

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function moveGlow(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <section className="hero" aria-labelledby="hero-title" ref={heroRef}>
      <Contour className="hero-contour" />
      <div className="hero-atmosphere" aria-hidden="true">
        <span className="hero-orb hero-orb-one" />
        <span className="hero-orb hero-orb-two" />
        {dust.map((particle, index) => (
          <i
            className="hero-dust"
            key={index}
            style={{
              "--dust-left": particle.left,
              "--dust-top": particle.top,
              "--dust-size": particle.size,
              "--dust-delay": particle.delay,
              "--dust-duration": particle.duration
            }}
          />
        ))}
      </div>

      <div className="hero-meta">
        <span>Student developer</span>
        <span className="hero-meta-mid">{SITE.based} · Available for collaborations</span>
        <span>Portfolio / 2026</span>
      </div>

      <div className="hero-canvas" onPointerMove={moveGlow}>
        <span className="hero-pointer-glow" aria-hidden="true" />
        <p className="hero-heading">Shipping ideas into reality.</p>
        <h1 className="hero-title" id="hero-title" aria-label="Rakshit Thakur">
          <span className="hero-word">
            {"Rakshit".split("").map((letter, index) => <span className="hero-letter" style={{ "--letter-index": index }} key={`${letter}-${index}`}>{letter}</span>)}
          </span>
          <span className="hero-word hero-word-outline">
            {"Thakur".split("").map((letter, index) => <span className="hero-letter" style={{ "--letter-index": index + 7 }} key={`${letter}-${index}`}>{letter}</span>)}
          </span>
        </h1>

        <figure className="hero-figure">
          <img
            className="hero-portrait"
            src={HERO.image}
            alt={HERO.imageAlt}
          />
          <figcaption className="hero-caption">
            <span>Rakshit Thakur</span>
            <span>Student developer</span>
          </figcaption>
        </figure>

        <div className="hero-status">
          <span className="hero-badge"><i /> {HERO.availability}</span>
          <span className="hero-code" aria-hidden="true"><Code2 size={14} /> building · learning · iterating</span>
        </div>
      </div>

      <div className="hero-foot">
        <div className="hero-foot-copy">
          <p className="hero-eyebrow">Student developer · Full-stack · Data analytics</p>
          <p className="hero-intro">{HERO.intro}</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/projects">
              Explore my work <ArrowRight size={16} />
            </Link>
            <Link className="text-link" to="/contact">
              Let&apos;s connect <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <a className="hero-scroll" href="#about">
          <span>Scroll to explore</span>
          <ArrowDown size={14} />
        </a>

        <NowCard className="hero-next" />
      </div>
    </section>
  );
}

function Message() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      section.style.setProperty("--scroll-progress", "1");
      section.style.setProperty("--panel-width", "100vw");
      section.style.setProperty("--panel-height", "100svh");
      section.style.setProperty("--panel-radius", "0px");
      section.style.setProperty("--panel-kicker-opacity", "0");
      section.style.setProperty("--panel-title-opacity", "1");
      section.style.setProperty("--panel-title-blur", "0px");
      section.style.setProperty("--panel-title-shift", "0px");
      section.style.setProperty("--panel-copy-opacity", "1");
      section.style.setProperty("--panel-copy-blur", "0px");
      section.style.setProperty("--panel-copy-shift", "0px");
      section.style.setProperty("--panel-foot-opacity", "1");
      section.style.setProperty("--panel-foot-shift", "0px");
      return undefined;
    }

    let frame = 0;
    function updateProgress() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const scrollDistance = Math.max(1, bounds.height - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -bounds.top / scrollDistance));
        section.style.setProperty("--scroll-progress", String(progress));
        section.style.setProperty("--panel-width", `${window.innerWidth * (0.68 + progress * 0.32)}px`);
        section.style.setProperty("--panel-height", `${window.innerHeight * (0.58 + progress * 0.42)}px`);
        section.style.setProperty("--panel-radius", `${28 * (1 - progress)}px`);
        section.style.setProperty("--panel-kicker-opacity", String(1 - progress));
        const titleProgress = Math.max(0, Math.min(1, (progress - 0.24) * 3.2));
        const copyProgress = Math.max(0, Math.min(1, (progress - 0.43) * 3.2));
        const footProgress = Math.max(0, Math.min(1, (progress - 0.68) * 3.2));
        section.style.setProperty("--panel-title-opacity", String(titleProgress));
        section.style.setProperty("--panel-title-blur", `${8 * (1 - titleProgress)}px`);
        section.style.setProperty("--panel-title-shift", `${18 * (1 - titleProgress)}px`);
        section.style.setProperty("--panel-copy-opacity", String(copyProgress));
        section.style.setProperty("--panel-copy-blur", `${7 * (1 - copyProgress)}px`);
        section.style.setProperty("--panel-copy-shift", `${12 * (1 - copyProgress)}px`);
        section.style.setProperty("--panel-foot-opacity", String(footProgress));
        section.style.setProperty("--panel-foot-shift", `${14 * (1 - footProgress)}px`);
        frame = 0;
      });
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="message-section" id="about" ref={sectionRef}>
      <Contour className="message-contour" />
      <div className="message-sticky">
        <div className="message-inner">
          <div className="message-top">
            <span className="kicker">The philosophy</span>
            <span className="message-top-right">Curious by nature</span>
          </div>

          <h2 className="statement">
            <span className="statement-title">{STATEMENT.heading} <em>{STATEMENT.accent}</em></span>
            <span className="statement-copy">I enjoy turning ideas into real things people can use — and learning how every piece fits together along the way.</span>
          </h2>

          <div className="message-foot">
            <span className="message-signature">Rakshit</span>
            <p>{STATEMENT.body}</p>
            <Link className="text-link text-link-light" to="/about">
              More about me <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectEvidence() {
  return (
    <section className="section evidence-section">
      <div className="section-head" data-reveal="up">
        <span className="kicker">01 / Work in practice</span>
        <div className="section-head-row">
          <h2>What the projects <em>actually do.</em></h2>
          <p>
            A closer look at the features and implementation behind CivicGuard and the school website refresh.
          </p>
        </div>
      </div>
      <div className="evidence-grid">
        {PROJECT_EVIDENCE.map((item, index) => (
          <article className="evidence-card" key={item.title} data-reveal="up" style={{ "--delay": `${index * 70}ms` }}>
            <span className="evidence-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
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
  );
}

function Projects() {
  return (
    <section className="section projects-section">
      <div className="section-head" data-reveal="up">
        <span className="kicker">03 / Selected projects</span>
        <div className="section-head-row">
          <h2>Built to <em>be useful.</em></h2>
          <div className="section-head-aside">
            <p>Real projects, real learning. Open each case study for the details and links.</p>
            <Link className="text-link" to="/projects">
              All projects <ArrowUpRight size={15} />
            </Link>
          </div>
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
              <p>{project.short}</p>
              <div className="project-tags">
                {project.technologies.map(tech => <span key={tech}>{tech}</span>)}
              </div>
              <Link className="text-link" to={`/projects/${project.slug}`}>
                View case study <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section journey-section">
      <div className="section-head" data-reveal="up">
        <span className="kicker">04 / The journey so far</span>
        <div className="section-head-row">
          <h2>Learning by <em>doing.</em></h2>
          <div className="section-head-aside">
            <p>No invented milestones — just the places and projects shaping what I learn next.</p>
            <Link className="text-link" to="/journey">
              Full journey <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <ol className="timeline-list">
        {TIMELINE.slice(0, 4).map((item, index) => (
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
  );
}

function Beyond() {
  return (
    <section className="section beyond-section">
      <div className="section-head" data-reveal="up">
        <span className="kicker">05 / Beyond the editor</span>
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
  );
}

function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-copy" data-reveal="up">
        <span className="kicker">06 / Say hello</span>
        <h2>Have an idea worth <em>building?</em></h2>
        <p>
          I&apos;m always interested in learning, collaborating, and building meaningful projects.
          Tell me what you have in mind.
        </p>
        <a className="contact-email" href={`mailto:${SITE.email}`}>
          {SITE.email} <ArrowUpRight size={16} />
        </a>
        <div className="contact-socials">
          {SITE.socials.map(social => (
            <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}</a>
          ))}
        </div>
      </div>
      <div className="contact-form-wrap" data-reveal="up">
        <ContactForm />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <Marquee items={MARQUEE} className="marquee-lime" speed={32} />
      <Message />
      <ProjectEvidence />
      <Skills />
      <Projects />
      <Journey />
      <Beyond />
      <Contact />
    </main>
  );
}
