import { useEffect, useState } from "react";
import { ExternalLink, FilePlus, Search, Trash2 } from "lucide-react";
import { api } from "../api.js";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Interview",
    description: "",
    url: "",
    location: "",
    company: "",
    listingType: "Resource",
  });
  const [message, setMessage] = useState("");
  async function load() {
    try {
      const data = await api.resources({ page: 0, size: 30, query, category });
      setResources(data?.content || []);
    } catch (error) {
      setMessage(error.message);
    }
  }
  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [query, category]);
  async function submit(event) {
    event.preventDefault();
    try {
      await api.createResource(form);
      setForm({
        title: "",
        category: "Interview",
        description: "",
        url: "",
        location: "",
        company: "",
        listingType: "Resource",
      });
      setShowForm(false);
      load();
    } catch (error) {
      setMessage(error.message);
    }
  }
  async function remove(resource) {
    if (!window.confirm(`Delete ${resource.title}?`)) return;
    await api.deleteResource(resource.id);
    load();
  }
  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Career vault</p>
          <h1>Resources</h1>
          <p className="muted">
            Useful links, events, and guidance from your community.
          </p>
        </div>
        <button
          className="button button-accent"
          onClick={() => setShowForm((value) => !value)}
        >
          <FilePlus size={17} /> Add resource
        </button>
      </div>
      {message && <div className="notice">{message}</div>}
      {showForm && (
        <section className="panel resource-form">
          <form onSubmit={submit}>
            <div className="form-grid">
              <label>
                Title
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </label>
              <label>
                Category
                <input
                  required
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                />
              </label>
            </div>
            <label>
              URL
              <input
                type="url"
                value={form.url}
                onChange={(event) =>
                  setForm({ ...form, url: event.target.value })
                }
              />
            </label>
            <label>
              Description
              <textarea
                rows="3"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </label>
            <button className="button button-dark">Publish resource</button>
          </form>
        </section>
      )}
      <section className="panel resources-panel">
        <div className="toolbar">
          <div className="search-field">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources"
            />
          </div>
          <input
            className="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Filter category"
          />
        </div>
        <div className="resource-grid">
          {resources.map((resource) => (
            <article className="resource-card" key={resource.id}>
              <div>
                <span className="resource-category">{resource.category}</span>
                <h2>{resource.title}</h2>
                <p>
                  {resource.description ||
                    "A useful resource for the job search."}
                </p>
              </div>
              <div className="resource-footer">
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noreferrer">
                    <ExternalLink size={15} /> Open
                  </a>
                )}
                {resource.ownedByCurrentUser && (
                  <button
                    onClick={() => remove(resource)}
                    aria-label="Delete resource"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        {!resources.length && <p className="muted">No resources found.</p>}
      </section>
    </div>
  );
}
