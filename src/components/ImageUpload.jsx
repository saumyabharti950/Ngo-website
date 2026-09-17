import { useId, useRef, useState } from "react";
import { ImagePlus, Link, Trash2, Upload } from "lucide-react";
import { assetUrl, uploadFile } from "../lib/api";

export default function ImageUpload({ scope, label, value, disabled, onChange, onUploadingChange, featured = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewErrorFor, setPreviewErrorFor] = useState("");
  const inputId = useId();
  const fileInput = useRef(null);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) { setError("Choose a JPG, PNG, WebP or GIF image."); return; }
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }
    setUploading(true);
    onUploadingChange?.(1);
    try {
      const result = await uploadFile(scope, file);
      onChange(result.path);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      onUploadingChange?.(-1);
    }
  };

  return <section className={`image-upload ${featured ? "image-upload-featured" : ""}`}>
    <div className="image-upload-heading"><div className="image-upload-icon"><ImagePlus size={19} /></div><div><h3>{label}</h3><p>{featured ? "Primary image shown on the listing card and detail page" : "Optional supporting image"}</p></div>{value && !disabled && <button type="button" className="image-upload-remove" onClick={() => onChange("")} aria-label={`Remove ${label}`}><Trash2 size={16} /></button>}</div>
    <div className="image-upload-preview-shell">
      {value && previewErrorFor !== value ? <img className="image-upload-preview" src={assetUrl(value)} alt={label} onError={() => setPreviewErrorFor(value)} /> : <div className="image-upload-empty"><ImagePlus size={29} /><span>{value ? "Image preview is unavailable" : "No image selected"}</span></div>}
    </div>
    <div className="image-upload-controls">
      <label className="image-upload-url"><span><Link size={14} /> Image URL</span><input disabled={disabled || uploading} value={value || ""} placeholder="Paste image link or /images/photo.jpg" onChange={(event) => onChange(event.target.value)} /></label>
      {!disabled && <><button type="button" className="image-upload-button" disabled={uploading} onClick={() => fileInput.current?.click()}><Upload size={16} />{uploading ? "Uploading..." : "Choose image"}</button><input ref={fileInput} id={inputId} aria-label={`Upload ${label}`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden disabled={uploading} onChange={upload} /></>}
    </div>
    {!disabled && <p className="image-upload-help">JPG, PNG, WebP or GIF · maximum 5 MB</p>}
    {error && <p className="form-message error" role="alert">{error}</p>}
  </section>;
}
