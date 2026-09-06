import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Sun,
  User,
} from "lucide-react";
import { Logo } from "./PublicLayout.jsx";

export default function AppShell({ children, onAdd, onExport, onLogout }) {
  const [dark, setDark] = useState(
    localStorage.getItem("jobtracker-theme") === "dark",
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("jobtracker-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <Logo href="#/app/dashboard" />
        <nav className="app-nav">
          <a href="#/app/dashboard">
            <LayoutDashboard size={17} /> Dashboard
          </a>
          <a href="#/app/applications">
            <FileText size={17} /> Applications
          </a>
          <a href="#/app/resources">
            <FileText size={17} /> Resources
          </a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={onExport} title="Export CSV">
            <Download size={18} />
          </button>
          <button
            className="icon-button"
            onClick={() => setDark((value) => !value)}
            title="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="profile-chip"
            onClick={() => setOpen((value) => !value)}
          >
            <span>U</span>
            <strong>Account</strong>
          </button>
          <button className="button button-accent add-button" onClick={onAdd}>
            <Plus size={17} /> Add
          </button>
          {open && (
            <div className="profile-menu">
              <a href="#/app/profile">
                <User size={16} /> Profile
              </a>
              <button onClick={onLogout}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
        <button
          className="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={20} />
        </button>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
