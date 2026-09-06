import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
const emptyJob = {
  company: "",
  role: "",
  location: "",
  appliedDate: new Date().toISOString().slice(0, 10),
  status: "Applied",
  stage: 1,
  salaryMin: "",
  salaryMax: "",
  url: "",
  notes: "",
};
export default function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState(job || emptyJob);
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm(job || emptyJob), [job]);
  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const stageMap = {
        Applied: 1,
        Shortlisted: 2,
        "Interview Scheduled": 3,
        "Offer Received": 4,
        Rejected: job?.stage || 1,
      };
      await onSave({
        ...form,
        appliedDate: form.appliedDate
          ? new Date(form.appliedDate).toISOString()
          : new Date().toISOString(),
        stage: stageMap[form.status] || 1,
        stageStatus:
          form.status === "Rejected"
            ? "failed"
            : form.status === "Offer Received"
              ? "passed"
              : "active",
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
      });
      onClose();
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="modal-backdrop">
      <section className="modal">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">
              {job ? "Update application" : "New application"}
            </p>
            <h2>{job ? "Keep the details current." : "Add an opportunity."}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="job-form">
          <label>
            Company
            <input
              name="company"
              value={form.company || ""}
              onChange={update}
              required
            />
          </label>
          <label>
            Role
            <input
              name="role"
              value={form.role || ""}
              onChange={update}
              required
            />
          </label>
          <div className="form-grid">
            <label>
              Location
              <input
                name="location"
                value={form.location || ""}
                onChange={update}
                required
              />
            </label>
            <label>
              Date
              <input
                type="date"
                name="appliedDate"
                value={(form.appliedDate || "").slice(0, 10)}
                onChange={update}
                required
                disabled={Boolean(job)}
              />
            </label>
          </div>
          <label>
            Status
            <select
              name="status"
              value={form.status || "Applied"}
              onChange={update}
            >
              <option>Applied</option>
              <option>Shortlisted</option>
              <option>Interview Scheduled</option>
              <option>Offer Received</option>
              <option>Rejected</option>
            </select>
          </label>
          <div className="form-grid">
            <label>
              Salary min
              <input
                type="number"
                name="salaryMin"
                value={form.salaryMin || ""}
                onChange={update}
              />
            </label>
            <label>
              Salary max
              <input
                type="number"
                name="salaryMax"
                value={form.salaryMax || ""}
                onChange={update}
              />
            </label>
          </div>
          <label>
            Job URL
            <input
              name="url"
              type="url"
              value={form.url || ""}
              onChange={update}
            />
          </label>
          <label>
            Notes
            <textarea
              name="notes"
              rows="4"
              value={form.notes || ""}
              onChange={update}
            />
          </label>
          <button className="button button-accent full" disabled={busy}>
            <Save size={16} /> {busy ? "Saving..." : "Save application"}
          </button>
        </form>
      </section>
    </div>
  );
}
