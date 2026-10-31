import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Journey from "./pages/Journey.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFound from "./pages/NotFound.jsx";

const PAGE_TITLES = {
  "/": "Rakshit Thakur — Student Developer",
  "/about": "About — Rakshit Thakur",
  "/projects": "Projects — Rakshit Thakur",
  "/journey": "Journey — Rakshit Thakur",
  "/contact": "Contact — Rakshit Thakur"
};

function IntroLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setDone(true), reduced ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`intro-loader${done ? " is-done" : ""}`} aria-hidden="true">
      <div className="intro-loader-inner">
        <img src="/images/logo-rt.svg" alt="" />
        <span>Rakshit Thakur</span>
        <span className="intro-loader-bar"><i /></span>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/projects/")) return;
    document.title = PAGE_TITLES[location.pathname] ?? "Page not found — Rakshit Thakur";
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView?.({ behavior: "smooth", block: "start" });
        return;
      }
    }
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch {
      /* jsdom and older browsers do not implement scrollTo */
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
    if (nodes.length === 0) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach(node => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach(node => {
      node.classList.remove("is-visible");
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  function handleSkip(event) {
    const target = document.getElementById("main-content");
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView?.({ block: "start" });
  }

  return (
    <div className="app" id="top">
      <IntroLoader />
      <a className="skip-link" href="#main-content" onClick={handleSkip}>
        Skip to content
      </a>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}
