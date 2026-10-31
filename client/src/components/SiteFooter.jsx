import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { NAV, SITE } from "../data/site.js";
import Contour from "./Contour.jsx";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Contour className="footer-contour" />
      <div className="footer-inner">
        <div className="footer-statement" data-reveal="up">
          <span className="kicker">A note to end on</span>
          <h2>
            Curious by nature.
            <br />
            <em>Builder by practice.</em>
          </h2>
          <span className="footer-signature">Rakshit</span>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <span className="footer-heading">Pages</span>
            {NAV.map(item => (
              <Link key={item.to} to={item.to}>{item.label}</Link>
            ))}
            <a href={SITE.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a>
          </div>
          <div className="footer-col">
            <span className="footer-heading">Find me</span>
            {SITE.socials.map(social => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label} <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
          <div className="footer-col footer-enquiries">
            <span className="footer-heading">Say hello</span>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <p>For collaborations, feedback, or a question about something I&apos;ve built.</p>
            <Link className="button button-lime" to="/contact">Start a conversation <ArrowUpRight size={14} /></Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Rakshit Thakur.</span>
          <span className="footer-credit">Designed and built by Rakshit Thakur.</span>
          <a className="footer-top" href="#top" aria-label="Back to top">
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
