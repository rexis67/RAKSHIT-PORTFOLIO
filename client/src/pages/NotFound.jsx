import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Contour from "../components/Contour.jsx";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="not-found">
      <Contour className="nf-contour" />
      <div className="nf-inner" data-reveal="up">
        <span className="kicker">Error 404 / Off the map</span>
        <p className="nf-code" aria-hidden="true">404</p>
        <h1>
          This page took a <em>wrong turn.</em>
        </h1>
        <p className="nf-copy">
          The page you&apos;re looking for doesn&apos;t exist — or maybe it&apos;s still being
          built. Let&apos;s get you back to something useful.
        </p>
        <div className="nf-actions">
          <Link className="button button-dark" to="/">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <Link className="text-link" to="/projects">
            Explore projects <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="nf-links">
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/journey">Journey</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </main>
  );
}
