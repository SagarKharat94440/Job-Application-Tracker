import { useEffect, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Mail,
  Plus,
  RefreshCw,
  Target,
} from "lucide-react";
import { api } from "../api.js";
import JobTable from "../components/JobTable.jsx";

const fallback = {
  stats: {
    totalApplications: 0,
    activePipeline: 0,
    interviews: 0,
    activeInterviews: 0,
    offers: 0,
  },
  statusChart: [],
  monthlyChart: [],
  interviewChart: [],
};
export default function Dashboard({ onAdd, onEdit, onDelete }) {
  const [data, setData] = useState(fallback);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  async function load() {
    setLoading(true);
    try {
      const [dashboard, page] = await Promise.all([
        api.dashboard(),
        api.jobs({ page: 0, size: 6, sort: "updatedAt", dir: "desc" }),
      ]);
      setData(dashboard || fallback);
      setJobs(page?.content || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function sync() {
    setMessage("");
    try {
      const response = await api.gmailSync();
      setMessage(response || "Gmail sync started.");
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }
  const stats = [
    {
      label: "Total applications",
      value: data.stats?.totalApplications || 0,
      icon: BriefcaseBusiness,
    },
    {
      label: "Active pipeline",
      value: data.stats?.activePipeline || 0,
      icon: Target,
    },
    {
      label: "Interviews",
      value: data.stats?.interviews || 0,
      icon: BarChart3,
    },
    { label: "Offers", value: data.stats?.offers || 0, icon: Check },
  ];
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your search at a glance</p>
          <h1>Good morning.</h1>
          <p className="muted">Keep the next useful action close.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-light" onClick={sync}>
            <Mail size={16} /> Sync Gmail
          </button>
          <button className="button button-accent" onClick={onAdd}>
            <Plus size={17} /> Add application
          </button>
        </div>
      </div>
      {message && <div className="notice">{message}</div>}
      <section className="stat-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon size={18} />
            </div>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Application flow</p>
              <h2>Monthly applications</h2>
            </div>
            <button
              className="icon-button"
              onClick={load}
              aria-label="Refresh dashboard"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="large-chart">
            {(data.monthlyChart?.length
              ? data.monthlyChart
              : [
                  { value: 0 },
                  { value: 0 },
                  { value: 0 },
                  { value: 0 },
                  { value: 0 },
                  { value: 0 },
                ]
            ).map((item, index) => (
              <i
                key={index}
                style={{
                  height: `${Math.max(5, Math.min(100, (item.value || 0) * 8))}%`,
                }}
              />
            ))}
          </div>
          <div className="chart-axis">
            {(data.monthlyChart?.length
              ? data.monthlyChart
              : [{ name: "No data" }]
            ).map((item, index) => (
              <span key={index}>{item.name}</span>
            ))}
          </div>
        </article>
        <article className="panel focus-panel">
          <p className="eyebrow">Interview progress</p>
          <h2>Keep the loop moving.</h2>
          <div className="progress-copy">
            <strong>{data.stats?.activeInterviews || 0}</strong>
            <span>active interviews</span>
          </div>
          <p className="muted">
            Follow up with the applications that have a live next step.
          </p>
          <button
            className="text-link"
            onClick={() =>
              document
                .querySelector(".recent-panel")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Review activity <ChevronRight size={16} />
          </button>
        </article>
      </section>
      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h2>Recent applications</h2>
          </div>
          <button
            className="text-link"
            onClick={() => (window.location.hash = "#/app/applications")}
          >
            View all <ChevronRight size={16} />
          </button>
        </div>
        {loading ? (
          <p className="muted">Loading your applications...</p>
        ) : jobs.length ? (
          <JobTable jobs={jobs} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <p className="muted">
            No applications yet. Add your first opportunity to begin.
          </p>
        )}
      </section>
    </div>
  );
}
