import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { api } from "../api.js";
import JobTable from "../components/JobTable.jsx";

export default function Applications({ onAdd, onEdit, onDelete }) {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState({ number: 0, totalPages: 1 });
  async function load() {
    setLoading(true);
    try {
      const result = await api.jobs({
        page: page.number,
        size: 10,
        sort: "updatedAt",
        dir: "desc",
        search: query,
        status,
      });
      setJobs(result?.content || []);
      setPage(result?.page || { number: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [query, status, page.number]);
  async function remove(job) {
    if (!window.confirm(`Delete ${job.company} application?`)) return;
    await onDelete(job);
    load();
  }
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your pipeline</p>
          <h1>Applications</h1>
          <p className="muted">Every opportunity, with its context intact.</p>
        </div>
        <button className="button button-accent" onClick={onAdd}>
          <Plus size={17} /> Add application
        </button>
      </div>
      <section className="panel applications-panel">
        <div className="toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => {
                setPage({ ...page, number: 0 });
                setQuery(event.target.value);
              }}
              placeholder="Search company or role"
            />
          </div>
          <select
            value={status}
            onChange={(event) => {
              setPage({ ...page, number: 0 });
              setStatus(event.target.value);
            }}
          >
            <option>All Statuses</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        {loading ? (
          <p className="muted">Loading applications...</p>
        ) : (
          <JobTable jobs={jobs} onEdit={onEdit} onDelete={remove} />
        )}
        <div className="pagination">
          <button
            disabled={!page.number}
            onClick={() => setPage({ ...page, number: page.number - 1 })}
          >
            Previous
          </button>
          <span>
            Page {(page.number || 0) + 1} of {page.totalPages || 1}
          </span>
          <button
            disabled={page.number + 1 >= (page.totalPages || 1)}
            onClick={() => setPage({ ...page, number: page.number + 1 })}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
