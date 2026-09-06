import { ExternalLink, Pencil, Trash2 } from "lucide-react";
export default function JobTable({ jobs, onEdit, onDelete }) {
  return (
    <div className="job-table">
      <div className="job-row table-head">
        <span>Company / role</span>
        <span>Location</span>
        <span>Status</span>
        <span>Applied</span>
        <span />
      </div>
      {jobs.map((job) => (
        <div className="job-row" key={job.id}>
          <span className="company-cell">
            <b>{(job.company || "?").slice(0, 1).toUpperCase()}</b>
            <span>
              <strong>{job.company}</strong>
              <small>{job.role}</small>
            </span>
          </span>
          <span>{job.location || "Not specified"}</span>
          <span>
            <b
              className={`status-pill ${(job.status || "").toLowerCase().replaceAll(" ", "-")}`}
            >
              {job.status}
            </b>
          </span>
          <span>
            {job.appliedDate
              ? new Date(job.appliedDate).toLocaleDateString()
              : "Recently"}
          </span>
          <span className="row-actions">
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Open job link"
              >
                <ExternalLink size={15} />
              </a>
            )}
            <button onClick={() => onEdit?.(job)} aria-label="Edit application">
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete?.(job)}
              aria-label="Delete application"
            >
              <Trash2 size={15} />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
