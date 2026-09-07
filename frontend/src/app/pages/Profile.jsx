import { useEffect, useState } from "react";
import { Check, Link2, Mail, Save, Shield, Unlink } from "lucide-react";
import { api } from "../api.js";
import { environment } from "../../environments/environment.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [gmailBusy, setGmailBusy] = useState(false);
  useEffect(() => {
    api
      .profile()
      .then((data) => {
        setProfile(data);
        setName(data?.name || "");
      })
      .catch((err) => setError(err.message));
  }, []);
  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("name", name);
      const updated = await api.updateProfile(form);
      setProfile(updated);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function savePassword(event) {
    event.preventDefault();
    try {
      await api.changePassword({ newPassword: password });
      setPassword("");
      setMessage("Password updated.");
    } catch (err) {
      setError(err.message);
    }
  }
  async function gmail(action) {
    try {
      const result = await api[action]();
      setMessage(result || "Gmail connection updated.");
      setProfile(await api.profile());
    } catch (err) {
      setError(err.message);
    }
  }
  function connectGmail() {
    setGmailBusy(true);
    setError("");
    if (!environment.googleClientId) {
      setError("Google OAuth is not configured for this environment.");
      setGmailBusy(false);
      return;
    }
    if (!window.google?.accounts?.oauth2) {
      setError("Google sign-in is still loading. Try again in a moment.");
      setGmailBusy(false);
      return;
    }
    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: environment.googleClientId,
      scope:
        "openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.settings.basic",
      ux_mode: "popup",
      login_hint: profile?.email,
      callback: async (response) => {
        if (!response.code) {
          setError("Google did not return an authorization code.");
          setGmailBusy(false);
          return;
        }
        try {
          await api.gmailConnect(response.code);
          setMessage("Gmail connected successfully.");
          setProfile(await api.profile());
        } catch (err) {
          setError(err.message);
        } finally {
          setGmailBusy(false);
        }
      },
      error_callback: (oauthError) => {
        setError(oauthError?.type || "Google authorization was cancelled.");
        setGmailBusy(false);
      },
    });
    client.requestCode();
  }
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Your profile</h1>
          <p className="muted">Manage your identity and connected services.</p>
        </div>
      </div>
      {message && (
        <div className="notice">
          <Check size={16} /> {message}
        </div>
      )}
      {error && <div className="notice error">{error}</div>}
      <div className="profile-grid">
        <section className="panel">
          <div className="profile-title">
            <div className="profile-large">
              {name.slice(0, 2).toUpperCase() || "U"}
            </div>
            <div>
              <h2>Personal information</h2>
              <p className="muted">Keep your account details current.</p>
            </div>
          </div>
          <form onSubmit={saveProfile}>
            <label>
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input value={profile?.email || ""} disabled />
            </label>
            <button className="button button-accent" disabled={busy}>
              <Save size={16} /> Save profile
            </button>
          </form>
        </section>
        <section className="panel">
          <h2>Security</h2>
          <p className="muted">Set a password for direct email sign-in.</p>
          <form onSubmit={savePassword}>
            <label>
              New password
              <input
                type="password"
                minLength="8"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button className="button button-dark">
              <Shield size={16} /> Update password
            </button>
          </form>
        </section>
        <section className="panel">
          <h2>Gmail automation</h2>
          <p className="muted">
            Forward application emails and keep your pipeline current.
          </p>
          <div className="integration-row">
            <span className="integration-icon">
              <Mail size={18} />
            </span>
            <span>
              <strong>
                {profile?.gmailConnected
                  ? "Gmail connected"
                  : "Gmail not connected"}
              </strong>
              <small>
                {profile?.gmailSyncInProgress
                  ? "Sync in progress"
                  : "Application email sync"}
              </small>
            </span>
            {profile?.gmailConnected ? (
              <button
                className="button button-light"
                onClick={() => gmail("gmailDisconnect")}
              >
                <Unlink size={15} /> Disconnect
              </button>
            ) : (
              <button
                className="button button-accent"
                onClick={connectGmail}
                disabled={gmailBusy}
              >
                <Link2 size={15} /> {gmailBusy ? "Connecting..." : "Connect"}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
