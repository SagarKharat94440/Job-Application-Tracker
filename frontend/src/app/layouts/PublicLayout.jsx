import { ArrowRight } from "lucide-react";

export function Logo({ href = "#/" }) {
  return (
    <a
      className="wordmark"
      href={href}
      aria-label="Job Application- Tracker home"
    >
      <span className="wordmark-mark">J</span>
      <span>Job Application- Tracker</span>
    </a>
  );
}

export function PublicNav() {
  return (
    <header className="public-nav">
      <Logo />
      <nav>
        <a href="#/about">How it works</a>
        <a href="#/resources">Resources</a>
        <a href="#/login">Sign in</a>
        <a className="button button-dark" href="#/signup">
          Create account <ArrowRight size={16} />
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="public-footer">
      <Logo />
      <span>Private, practical, and built for the long search.</span>
      <div>
        <a href="#/privacy">Privacy</a>
        <a href="#/terms">Terms</a>
      </div>
    </footer>
  );
}

export function SimplePage({ title, kicker, text }) {
  return (
    <>
      <PublicNav />
      <div className="page-content simple-page">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        <p className="lead">{text}</p>
        <div className="panel content-panel">
          <h2>Built for the details that move a search forward.</h2>
          <p className="muted">
            Track context, follow-ups, and decisions in one focused place. Your
            workspace stays yours.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
