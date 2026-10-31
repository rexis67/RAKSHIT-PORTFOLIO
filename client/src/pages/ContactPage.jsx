import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Mail, ShieldCheck } from "lucide-react";
import ContactForm from "../components/ContactForm.jsx";
import Contour from "../components/Contour.jsx";
import { ENQUIRIES, HERO, SITE } from "../data/site.js";

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="contact-hero">
        <Contour className="contact-hero-contour" />
        <div className="contact-hero-copy" data-reveal="up">
          <span className="kicker">04 / Say hello</span>
          <h1>
            Have an idea
            <br />
            worth <em>building?</em>
          </h1>
          <p>
            I&apos;m always interested in learning, collaborating, and building meaningful
            projects. Tell me what you have in mind.
          </p>
          <a className="contact-email" href={`mailto:${SITE.email}`}>
            <Mail size={16} /> {SITE.email} <ArrowUpRight size={15} />
          </a>
          <div className="contact-socials">
            {SITE.socials.map(social => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label} <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>
        <figure className="contact-hero-media" data-reveal="up">
          <img src={HERO.image} alt={HERO.imageAlt} decoding="async" />
          <figcaption>
            <span>Rakshit Thakur</span>
            <span>Student developer / {SITE.based}</span>
          </figcaption>
        </figure>
      </section>

      <section className="section contact-page-section">
        <div className="contact-page-form" data-reveal="up">
          <div className="contact-form-head">
            <span className="kicker">Tell me everything</span>
            <h2>Send a <em>message.</em></h2>
          </div>
          <ContactForm />
        </div>

        <aside className="contact-aside" data-reveal="up">
          <div className="contact-aside-block">
            <span className="kicker">What to include</span>
            <ul className="contact-checklist">
              <li>What you&apos;re thinking about building</li>
              <li>Where you are in the process</li>
              <li>What kind of help or conversation you want</li>
            </ul>
          </div>

          <div className="contact-aside-block">
            <span className="kicker">Direct</span>
            <a className="contact-aside-link" href={`mailto:${SITE.email}`}>
              <span>Email</span>
              <span>{SITE.email} <ArrowUpRight size={13} /></span>
            </a>
            <a className="contact-aside-link" href={SITE.github} target="_blank" rel="noreferrer">
              <span>GitHub</span>
              <span>@rexis67 <ArrowUpRight size={13} /></span>
            </a>
            <a className="contact-aside-link" href="https://www.linkedin.com/in/codewithrakshit/" target="_blank" rel="noreferrer">
              <span>LinkedIn</span>
              <span>in/codewithrakshit <ArrowUpRight size={13} /></span>
            </a>
          </div>

          <div className="contact-aside-block contact-aside-note">
            <Clock size={18} />
            <p>I read every message and usually reply within a few days. If it takes longer, I&apos;m probably deep in a build.</p>
          </div>

          <div className="contact-aside-block contact-aside-note">
            <ShieldCheck size={18} />
            <p>Form submissions are stored in the site database for follow-up. They are not emailed or added to a mailing list.</p>
          </div>
        </aside>
      </section>

      <section className="section enquiry-section">
        <div className="section-head" data-reveal="up">
          <span className="kicker">Three ways in</span>
          <div className="section-head-row">
            <h2>Whatever it is, <em>start here.</em></h2>
          </div>
        </div>
        <div className="enquiry-grid">
          {ENQUIRIES.map((type, index) => (
            <article className="enquiry-card" key={type.title} data-reveal="up" style={{ "--delay": `${index * 60}ms` }}>
              <span className="enquiry-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{type.title}</h3>
              <p>{type.copy}</p>
            </article>
          ))}
        </div>
        <p className="enquiry-foot">
          Want to see the work first? <Link className="text-link" to="/projects">Explore projects <ArrowUpRight size={14} /></Link>
        </p>
      </section>
    </main>
  );
}
