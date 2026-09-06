import { ArrowRight } from "lucide-react";
import { Footer, PublicNav } from "../layouts/PublicLayout.jsx";

export default function Landing() {
  const isAuthenticated = Boolean(localStorage.getItem("jobtracker-token"));
  const trackingPath = isAuthenticated ? "#/app/dashboard" : "#/signup";

  return (
    <div className="landing-page">
      <PublicNav />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">YOUR JOB SEARCH, IN FOCUS</p>
            <h1>Turn every application into a clearer next step.</h1>
            <p className="hero-lede">
              Job Application- Tracker brings applications, conversations, and
              momentum into one calm workspace. Forward an email and let Gemini
              organize the details.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href={trackingPath}>
                Start tracking <ArrowRight size={17} />
              </a>
              <a className="text-link" href="#/about">
                See how it works <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="hero-board">
            <div className="board-top">
              <span>Pipeline overview</span>
              <span className="live-dot">Live</span>
            </div>
            <div className="hero-stat">
              <strong>24</strong>
              <span>active applications</span>
            </div>
            <div className="mini-chart">
              <i style={{ height: "35%" }} />
              <i style={{ height: "48%" }} />
              <i style={{ height: "42%" }} />
              <i style={{ height: "68%" }} />
              <i style={{ height: "57%" }} />
              <i style={{ height: "84%" }} />
            </div>
            <div className="board-row">
              <span>
                <b className="status-pill interview">Interview</b> Northstar
                Labs
              </span>
              <strong>Today</strong>
            </div>
            <div className="board-row">
              <span>
                <b className="status-pill applied">Applied</b> Morrow Systems
              </span>
              <strong>Aug 25</strong>
            </div>
          </div>
        </section>
        <section className="principles">
          <div>
            <span className="section-number">01</span>
            <h2>Capture the signal.</h2>
            <p>
              Forward confirmation emails and let one focused pipeline hold the
              useful details.
            </p>
          </div>
          <div>
            <span className="section-number">02</span>
            <h2>See your momentum.</h2>
            <p>
              Understand your conversion rates, next interviews, and where your
              time is going.
            </p>
          </div>
          <div>
            <span className="section-number">03</span>
            <h2>Move with intent.</h2>
            <p>
              Keep notes, stages, and follow-ups close enough to turn insight
              into action.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
