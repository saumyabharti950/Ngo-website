import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Clock, MapPin, Upload, X } from "lucide-react";
import { api, apiForm } from "../lib/api";

function splitLines(value) {
  return String(value || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function ApplyModal({ job, close }) {
  const [form, setForm] = useState({ applicantName: "", email: "", phone: "", currentLocation: "", experienceYears: "", currentCompany: "", expectedCtc: "", noticePeriod: "", coverLetter: "", portfolioUrl: "", linkedinUrl: "" });
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!resume) return setMessage("Please upload your resume.");
    setSaving(true); setMessage("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("resume", resume);
      await apiForm(`/careers/${job.id}/apply`, data, { method: "POST" });
      setMessage("Application submitted. Our team will review your profile.");
    } catch (error) {
      setMessage(error.message);
    } finally { setSaving(false); }
  };
  return <div className="career-apply-overlay">
    <form className="career-apply-modal" onSubmit={submit}>
      <div className="career-modal-head"><div><span>Apply now</span><h2>{job.title}</h2></div><button type="button" onClick={close} aria-label="Close"><X /></button></div>
      <div className="career-form-grid">
        {["applicantName", "email", "phone", "currentLocation", "experienceYears", "currentCompany", "expectedCtc", "noticePeriod", "portfolioUrl", "linkedinUrl"].map((key) => <label key={key}><span>{key.replace(/([A-Z])/g, " $1")}</span><input name={key} type={key === "email" ? "email" : "text"} value={form[key]} onChange={update} required={["applicantName", "email"].includes(key)} /></label>)}
        <label className="wide"><span>Cover letter</span><textarea name="coverLetter" rows="4" value={form.coverLetter} onChange={update} /></label>
        <label className="wide resume-drop"><Upload /><span>{resume ? resume.name : "Upload resume PDF/DOC/DOCX"}</span><input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} required /></label>
      </div>
      {message && <p className="form-message">{message}</p>}
      <button className="btn btn-primary" disabled={saving}>{saving ? "Submitting..." : "Submit application"}</button>
    </form>
  </div>;
}

export default function CareerPage() {
  const [jobs, setJobs] = useState([]);
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    api("/careers").then(setJobs).catch((error) => setMessage(error.message));
  }, []);
  const filtered = jobs.filter((job) => `${job.title} ${job.department} ${job.location} ${job.summary}`.toLowerCase().includes(query.toLowerCase()));
  const lead = filtered[0];
  return <section className="career-page">
    <div className="container">
      <header className="career-hero">
        <span><BriefcaseBusiness /> Careers at SIFI Foundation</span>
        <h1>Do meaningful work with a team building community possibility.</h1>
        <p>Explore open roles, understand the responsibility clearly, and apply with your resume in one focused flow.</p>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search role, team, location..." />
      </header>
      {message ? <p role="alert">{message}</p> : lead ? <div className="career-layout">
        <aside className="career-list">{filtered.map((job) => <button key={job.id} type="button" className={lead.id === job.id ? "active" : ""} onClick={() => setActive(job)}>
          <strong>{job.title}</strong><span>{job.department || "Foundation team"} · {job.location || "India"}</span>
        </button>)}</aside>
        <article className="career-detail">
          <div className="career-detail-top"><div><span>{lead.featured ? "Featured opening" : "Open position"}</span><h2>{lead.title}</h2></div><button className="btn btn-primary" onClick={() => setActive(lead)}>Apply now <ArrowRight size={16} /></button></div>
          <div className="career-meta"><span><MapPin />{lead.location || "Location flexible"}</span><span><Clock />{lead.jobType || "Full-time"}</span><span>{lead.workMode || "On-site"}</span><span>{lead.openings || 1} opening(s)</span></div>
          <p>{lead.summary}</p>
          {["description", "responsibilities", "qualifications", "skills", "benefits"].map((key) => splitLines(lead[key]).length ? <section key={key}><h3>{key.replace(/^./, (letter) => letter.toUpperCase())}</h3><ul>{splitLines(lead[key]).map((line) => <li key={line}>{line}</li>)}</ul></section> : null)}
        </article>
      </div> : <p className="career-empty">No active openings right now. Please check again soon.</p>}
    </div>
    {active && <ApplyModal job={active} close={() => setActive(null)} />}
  </section>;
}
