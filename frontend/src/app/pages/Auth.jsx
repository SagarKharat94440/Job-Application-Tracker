import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { api } from "../api.js";
import { Logo } from "../layouts/PublicLayout.jsx";
import { navigate } from "../navigation.js";

export default function Auth({ signup = false }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await (signup ? api.signup(data) : api.login(data));
      if (response?.token || response?.accessToken) {
        localStorage.setItem(
          "jobtracker-token",
          response.token || response.accessToken,
        );
      }
      if (signup) {
        setError("Account created. You can sign in now.");
      } else {
        navigate("/app/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <Logo />
        <div>
          <p className="eyebrow">A calmer job search</p>
          <h1>
            Keep the work visible. Keep your attention on the right things.
          </h1>
          <p>
            One private workspace for every application, update, and follow-up.
          </p>
        </div>
        <span className="aside-note">Job Application- Tracker / 2026</span>
      </div>
      <div className="auth-panel">
        <a className="back-link" href="#/">
          <ArrowRight size={15} className="back-arrow" /> Back to home
        </a>
        <div className="auth-form-wrap">
          <p className="eyebrow">
            {signup ? "Create your workspace" : "Welcome back"}
          </p>
          <h2>
            {signup ? "Start with a clear view." : "Sign in to your pipeline."}
          </h2>
          <p className="muted">
            {signup
              ? "Your applications deserve a system."
              : "Pick up where your search left off."}
          </p>
          <form onSubmit={submit}>
            {signup && (
              <label>
                Name
                <input name="name" required placeholder="Your name" />
              </label>
            )}
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                required
                placeholder="Your password"
              />
            </label>
            {!signup && (
              <a className="form-link" href="#/forgot-password">
                Forgot your password?
              </a>
            )}
            {error && <p className="form-error">{error}</p>}
            <button className="button button-dark full" disabled={busy}>
              {busy ? "Working..." : signup ? "Create account" : "Sign in"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            {signup
              ? "Already have an account?"
              : "New to Job Application- Tracker?"}{" "}
            <a href={signup ? "#/login" : "#/signup"}>
              {signup ? "Sign in" : "Create an account"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
