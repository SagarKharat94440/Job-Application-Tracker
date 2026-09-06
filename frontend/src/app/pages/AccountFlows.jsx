import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";
import { api } from "../api.js";

export function VerifyEmail({ token }) {
  const [state, setState] = useState("Verifying your account...");
  useEffect(() => {
    if (!token) {
      setState("Verification link is missing.");
      return;
    }
    api
      .verifyEmail(token)
      .then((data) => {
        if (data?.token || data?.accessToken)
          localStorage.setItem(
            "jobtracker-token",
            data.token || data.accessToken,
          );
        setState("Your email is verified.");
      })
      .catch((error) => setState(error.message));
  }, [token]);
  return (
    <StatusPage
      icon={<CheckCircle />}
      title={state}
      action="Continue to dashboard"
      href="#/app/dashboard"
    />
  );
}
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    try {
      setMessage(await api.forgotPassword(email));
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-aside">
        <Mail size={28} />
        <div>
          <p className="eyebrow">Account recovery</p>
          <h1>Get back to your pipeline.</h1>
          <p>We will send a secure reset link to your account email.</p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">Forgot password</p>
          <h2>Reset your access.</h2>
          <form onSubmit={submit}>
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            {message && <p className="form-error">{message}</p>}
            <button className="button button-dark full">
              Send reset link <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            <a href="#/login">Return to sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
export function ResetPassword({ token }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    try {
      await api.resetPassword({ token, newPassword: password });
      setMessage("Password reset successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-aside">
        <div>
          <p className="eyebrow">Account recovery</p>
          <h1>Choose a new password.</h1>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">Reset password</p>
          <h2>Secure your account.</h2>
          <form onSubmit={submit}>
            <label>
              New password
              <input
                type="password"
                minLength="8"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {message && <p className="form-error">{message}</p>}
            <button className="button button-dark full">
              Update password <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            <a href="#/login">Return to sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
function StatusPage({ icon, title, action, href }) {
  return (
    <div className="auth-page">
      <div className="auth-aside">
        <div>
          <p className="eyebrow">Account verification</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="stat-icon">{icon}</div>
          <a className="button button-dark" href={href}>
            {action} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
