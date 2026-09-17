import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { api } from "../lib/api";
import ImageUpload from "./ImageUpload";
import WebsitePreview from "./WebsitePreview";
import { contentPaths, contentPreviewItem, contentTitles, moduleFields } from "../../shared/content";
import { labelize } from "../../shared/settings";

const steps = [
  { id: "basic", title: "Basic details", hint: "Name, summary and category" },
  { id: "story", title: "Page content", hint: "Write the main information" },
  { id: "media", title: "Images & media", hint: "Add visuals for the page" },
  { id: "details", title: "Extra details", hint: "Programme, story or SEO details" },
  { id: "publish", title: "Review & publish", hint: "Check preview and visibility" }
];
const coreColumns = new Set(["title", "slug", "shortDescription", "description", "content", "category", "tags", "metaTitle", "metaDescription", "featuredImage", "image1", "image2", "image3", "image4", "videoUrl", "status", "featured", "sortOrder"]);

function preparedForm(row) {
  const base = { title: "", slug: "", shortDescription: "", description: "", content: "", featuredImage: "", image1: "", image2: "", image3: "", image4: "", status: "draft", featured: false, sortOrder: 0, ...(row || {}) };
  return { ...base, ...(base.payload || {}) };
}

function TextField({ name, value, onChange, disabled, long = false }) {
  const type = name.includes("email") ? "email" : name.includes("Date") ? "date" : name === "sortOrder" || /Count|Age|budget/i.test(name) ? "number" : "text";
  return <label className={long ? "wide" : ""}><span>{labelize(name)}</span>{long ? <textarea rows="5" disabled={disabled} value={value ?? ""} onChange={(event) => onChange(name, event.target.value)} /> : <input type={type} disabled={disabled} value={value ?? ""} onChange={(event) => onChange(name, event.target.value)} />}</label>;
}

export default function ContentEditor({ modal, close, done }) {
  const module = modal.config.module;
  const config = moduleFields[module];
  const readOnly = modal.mode === "view";
  const [form, setForm] = useState(() => preparedForm(modal.row));
  const [step, setStep] = useState(0);
  const [uploads, setUploads] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const previewItem = useMemo(() => contentPreviewItem(form, module), [form, module]);
  const extraFields = [...config.text, ...config.long, ...config.payload].filter((key) => !["title", "slug", "shortDescription", "category", "description", "content"].includes(key));
  const payload = { kind: "content", path: contentPaths[module], item: previewItem, view: step === 0 ? "listing" : "detail" };
  const save = async () => {
    if (saving || uploads || readOnly) return;
    if (!form.title.trim()) { setStep(0); setMessage("Please enter a title before saving."); return; }
    setSaving(true); setMessage("");
    try {
      const body = { ...form, payload: {} };
      for (const key of extraFields) if (!coreColumns.has(key) && form[key] !== undefined) body.payload[key] = form[key];
      const url = modal.mode === "edit" ? `/content/admin/${module}/${form.id}` : `/content/admin/${module}`;
      await api(url, { method: modal.mode === "edit" ? "PUT" : "POST", body });
      done();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  };
  const relevant = (stepId) => {
    if (stepId === "basic") return config.text.filter((key) => ["title", "slug", "shortDescription", "category", "eventDate", "storyDate", "location"].includes(key));
    if (stepId === "story") return config.long.filter((key) => ["description", "content", "overview", "background", "challenge", "intervention", "journey", "result", "impact"].includes(key));
    if (stepId === "details") return extraFields.filter((key) => !relevant("basic").includes(key) && !relevant("story").includes(key));
    return [];
  };
  return <div className="editor-overlay"><section className="content-editor" role="dialog" aria-modal="true" aria-labelledby="content-editor-title">
    <header className="content-editor-header"><div><span>CMS EDITOR</span><h1 id="content-editor-title">{readOnly ? "View" : modal.mode === "edit" ? "Edit" : "Create"} {contentTitles[module]}</h1><p>Fill each step and see the public website preview beside it.</p></div><button type="button" className="editor-close" onClick={close} aria-label="Close editor">×</button></header>
    <div className="content-editor-layout"><div className="editor-workspace"><nav className="editor-steps" aria-label="Entry steps">{steps.map((item, index) => <button type="button" key={item.id} className={index === step ? "active" : index < step ? "complete" : ""} onClick={() => setStep(index)}><b>{index < step ? <Check size={15} /> : index + 1}</b><span>{item.title}<small>{item.hint}</small></span></button>)}</nav>
      <div className="editor-form"><div className="editor-form-title"><span>Step {step + 1} of {steps.length}</span><h2>{steps[step].title}</h2><p>{steps[step].hint}</p></div>
        <fieldset disabled={readOnly || saving}>{steps[step].id === "media" ? <div className="editor-media"><p>Choose one strong main image, then add up to four optional supporting images. You can upload a file or paste an existing image path.</p><ImageUpload scope={module} label="Main image" featured value={form.featuredImage} disabled={readOnly || saving} onUploadingChange={(change) => setUploads((count) => count + change)} onChange={(value) => update("featuredImage", value)} /><div className="additional-images"><div className="additional-images-heading"><h3>Additional images</h3><p>These appear in the page gallery.</p></div><div className="additional-images-grid">{config.images.slice(1).map((key, index) => <ImageUpload key={key} scope={module} label={`Image ${index + 2}`} value={form[key]} disabled={readOnly || saving} onUploadingChange={(change) => setUploads((count) => count + change)} onChange={(value) => update(key, value)} />)}</div></div></div> : steps[step].id === "publish" ? <div className="publish-step"><label><span>Visibility</span><select value={form.status} onChange={(event) => update("status", event.target.value)}><option value="draft">Draft — only visible in admin</option><option value="published">Published — show on website</option><option value="unpublished">Unpublished — hide from website</option></select></label><label className="toggle-field"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => update("featured", event.target.checked)} /><span>Mark as featured</span></label><p>The preview shows your draft immediately. The public website updates after you save with “Published” status.</p></div> : <div className="editor-fields">{relevant(steps[step].id).map((key) => <TextField key={key} name={key} value={form[key]} onChange={update} disabled={readOnly || saving} long={config.long.includes(key)} />)}</div>}</fieldset>
        {message && <p className="form-message error" role="alert">{message}</p>}
        <div className="editor-actions"><button type="button" onClick={() => step === 0 ? close() : setStep((value) => value - 1)}>{step === 0 ? "Cancel" : <><ChevronLeft size={17} /> Back</>}</button>{step < steps.length - 1 ? <button type="button" className="btn btn-primary" onClick={() => setStep((value) => value + 1)}>Next <ChevronRight size={17} /></button> : readOnly ? <button type="button" className="btn btn-primary" onClick={close}>Close</button> : <button type="button" className="btn btn-primary" disabled={saving || uploads > 0} onClick={save}>{saving ? "Saving..." : uploads ? "Uploading..." : <><Save size={17} /> Save entry</>}</button>}</div>
      </div></div><WebsitePreview payload={payload} title={`${contentTitles[module]} website preview`} /></div>
  </section></div>;
}
