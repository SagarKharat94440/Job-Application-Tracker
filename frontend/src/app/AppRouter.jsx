import { useState } from "react";
import { api } from "./api.js";
import AppShell from "./layouts/AppShell.jsx";
import { Footer, PublicNav, SimplePage } from "./layouts/PublicLayout.jsx";
import { navigate, useRoute } from "./navigation.js";
import Applications from "./pages/Applications.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Landing from "./pages/Landing.jsx";
import Profile from "./pages/Profile.jsx";
import Resources from "./pages/Resources.jsx";
import {
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
} from "./pages/AccountFlows.jsx";
import JobModal from "./components/JobModal.jsx";

export default function AppRouter() {
  const route = useRoute();
  const [modal, setModal] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [path, queryString] = route.split("?");
  const params = new URLSearchParams(queryString || "");

  async function saveJob(job) {
    if (modal?.id) await api.updateJob(modal.id, job);
    else await api.createJob(job);
    setRefresh((value) => value + 1);
  }

  async function deleteJob(job) {
    await api.deleteJob(job.id);
    setRefresh((value) => value + 1);
  }

  function exportCsv() {
    api.jobs({ page: 0, size: 1000 }).then((data) => {
      const rows = [
        ["Company", "Role", "Location", "Status", "Applied"],
        ...(data?.content || []).map((job) => [
          job.company,
          job.role,
          job.location,
          job.status,
          job.appliedDate,
        ]),
      ];
      const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], {
        type: "text/csv",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "job-applications.csv";
      link.click();
    });
  }

  const content = path.includes("/applications") ? (
    <Applications
      key={refresh}
      onAdd={() => setModal({})}
      onEdit={setModal}
      onDelete={deleteJob}
    />
  ) : path.includes("/profile") ? (
    <Profile key={refresh} />
  ) : path.includes("/resources") ? (
    <Resources key={refresh} />
  ) : (
    <Dashboard
      key={refresh}
      onAdd={() => setModal({})}
      onEdit={setModal}
      onDelete={deleteJob}
    />
  );

  if (path === "/" || path === "") return <Landing />;
  if (path === "/login") return <Auth />;
  if (path === "/signup") return <Auth signup />;
  if (path === "/login-success") {
    if (params.get("token")) {
      localStorage.setItem("jobtracker-token", params.get("token"));
    }
    navigate("/app/dashboard");
    return null;
  }
  if (path === "/forgot-password") return <ForgotPassword />;
  if (path === "/reset-password") {
    return <ResetPassword token={params.get("token") || ""} />;
  }
  if (path === "/verify-email") {
    return <VerifyEmail token={params.get("token") || ""} />;
  }
  if (path === "/about") {
    return (
      <SimplePage
        title="A better place to search."
        kicker="How it works"
        text="Job Application- Tracker turns the messy middle of a job search into a quiet, useful system."
      />
    );
  }
  if (path === "/resources") {
    return (
      <SimplePage
        title="Resources for the next move."
        kicker="Career vault"
        text="Practical material for applications, interviews, and the small decisions between them."
      />
    );
  }
  if (path === "/privacy" || path === "/terms") {
    return (
      <SimplePage
        title={path === "/privacy" ? "Privacy policy" : "Terms of service"}
        kicker="The fine print"
        text="Your account data belongs to you."
      />
    );
  }
  if (!path.startsWith("/app")) {
    return (
      <SimplePage
        title="Page not found"
        kicker="404"
        text="That page is not part of this workspace."
      />
    );
  }

  return (
    <AppShell
      onAdd={() => setModal({})}
      onExport={exportCsv}
      onLogout={async () => {
        await api.logout().catch(() => {});
        localStorage.removeItem("jobtracker-token");
        navigate("/login");
      }}
    >
      {content}
      {modal && (
        <JobModal
          job={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={saveJob}
        />
      )}
    </AppShell>
  );
}
