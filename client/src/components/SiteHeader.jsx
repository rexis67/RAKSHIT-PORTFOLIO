import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Github, Plus } from "lucide-react";
import { HERO, NAV, SITE } from "../data/site.js";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-open" : ""}`}>
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Rakshit Thakur home">
          <span className="brand-monogram" aria-hidden="true">RT.</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <a className="store-pill" href={SITE.github} target="_blank" rel="noreferrer">
            <Github size={13} strokeWidth={2.2} />
            <span>GitHub</span>
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(value => !value)}
          >
            <span className="menu-button-label">{menuOpen ? "Close" : "Dive In"}</span>
            <span />
            <span />
            <Plus className="menu-button-plus" size={17} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="menu-overlay" id="site-menu">
          <div className="menu-top">
            <span className="menu-kicker">Menu — 2026</span>
            <button className="menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu overlay">
              <span />
              <span />
            </button>
          </div>

          <div className="menu-body">
            <nav className="menu-nav" aria-label="Menu navigation">
              {NAV.map((item, index) => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                  <span className="menu-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="menu-label">{item.label}</span>
                  <ArrowUpRight size={22} />
                </Link>
              ))}
            </nav>

            <div className="menu-side">
              <figure className="menu-portrait">
                <img src={HERO.image} alt={HERO.imageAlt} loading="lazy" decoding="async" />
                <figcaption>
                  <span>Rakshit Thakur</span>
                  <span>Student developer</span>
                </figcaption>
              </figure>
              <div className="menu-note">
                <span className="kicker">Currently</span>
                <p>Building CivicGuard, learning data analytics, and exploring AI/ML fundamentals.</p>
                <Link className="text-link text-link-light" to="/contact" onClick={() => setMenuOpen(false)}>
                  Say hello <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="menu-foot">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <div className="menu-socials">
              {SITE.socials.map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}</a>
              ))}
            </div>
            <span>Curious by nature. Builder by practice.</span>
          </div>
        </div>
      )}
    </header>
  );
}
