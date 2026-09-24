import { useRef, useState } from 'react';
import { Plus, Upload, Trash2, Save, X, Images } from 'lucide-react';
import { api, uploadFile } from '../lib/api';
import { galleryImages, validGalleryImageUrl } from '../../shared/gallery';
import ImageUpload from './ImageUpload';
import WebsitePreview from './WebsitePreview';
import './Gallery.css';

const emptyImage = () => ({ id: crypto.randomUUID(), url: '', title: '' });
export default function GalleryEditor({ modal, close, done }) {
  const readOnly = modal.mode === 'view';
  const [images, setImages] = useState(() => { const existing = galleryImages(modal.row || {}); return existing.length ? existing : [emptyImage()]; });
  const [status, setStatus] = useState(modal.row?.status || 'draft');
  const [uploads, setUploads] = useState(0);
  const [batch, setBatch] = useState(false);
  const [progress, setProgress] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);
  const busy = saving || batch || uploads > 0;
  const update = (id, key, value) => setImages(current => current.map(image => image.id === id ? {...image, [key]: value} : image));
  const addAfter = id => setImages(current => { const next = [...current]; next.splice(current.findIndex(image => image.id === id) + 1, 0, emptyImage()); return next; });
  const uploadMany = async event => {
    const files = Array.from(event.target.files || []); event.target.value = '';
    if (!files.length) return;
    setBatch(true); setError('');
    const failures = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) { failures.push(`${file.name}: use JPG, PNG, WebP or GIF, up to 5 MB`); continue; }
      try {
        const result = await uploadFile('gallery', file);
        const image = {id: crypto.randomUUID(), url: result.path, title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').slice(0, 255)};
        setImages(current => { const blank = current.findIndex(value => !value.url && !value.title); if (blank < 0) return [...current, image]; return current.map((value, i) => i === blank ? image : value); });
      } catch (err) { failures.push(`${file.name}: ${err.message}`); }
    }
    setProgress(`${files.length - failures.length} of ${files.length} images uploaded. Review titles, then save.`);
    setError(failures.join('\n')); setBatch(false);
  };
  const save = async () => {
    if (busy || readOnly) return;
    const selected = images.filter(image => image.url || image.title.trim());
    if (!selected.length || selected.some(image => !validGalleryImageUrl(image.url) || !image.title.trim() || image.title.length > 255)) { setError('Add at least one image, and give every image a title (up to 255 characters). Remove unfinished sections or complete them.'); return; }
    setSaving(true); setError('');
    try {
      const body = {title: selected[0].title.trim(), status, featuredImage: selected[0].url, image1: null, image2: null, image3: null, image4: null, payload: {images: selected.map(image => ({...image, title: image.title.trim()}))}};
      await api(`/content/admin/gallery${modal.mode === 'edit' ? `/${modal.row.id}` : ''}`, {method: modal.mode === 'edit' ? 'PUT' : 'POST', body});
      window.dispatchEvent(new Event('content-updated')); done();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  const preview = {kind: 'content', path: '/gallery', view: 'listing', item: {id: modal.row?.id, module:'gallery', title: images[0]?.title || 'Gallery', payload: {images: images.filter(image => image.url)}}};
  return <div className="editor-overlay"><section className="content-editor gallery-editor" role="dialog" aria-modal="true" aria-labelledby="gallery-editor-title">
    <header className="content-editor-header"><div><span>GALLERY STUDIO</span><h1 id="gallery-editor-title">{readOnly ? 'View' : modal.mode === 'edit' ? 'Edit' : 'Create'} Gallery</h1><p>Images & titles. Add a moment, then make it yours.</p></div><button className="editor-close" type="button" onClick={close} disabled={busy} aria-label="Close editor"><X size={22}/></button></header>
    <div className="content-editor-layout"><div className="editor-workspace gallery-workspace"><div className="gallery-upload-toolbar"><div><Images size={22}/><h2>Images & media <span>{images.filter(image => image.url).length}</span></h2></div>{!readOnly && <><button type="button" disabled={busy} onClick={() => input.current?.click()}><Upload size={16}/>Upload multiple images</button><input ref={input} type="file" hidden multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadMany}/></>}</div><p className="gallery-editor-hint">Choose several images at once, or use + to add an image section. JPG, PNG, WebP or GIF, up to 5 MB each.</p>
      {progress && <p role="status" className="gallery-upload-progress">{progress}</p>}
      <div className="gallery-editor-images">{images.map((image, index) => <section className="gallery-edit-image" key={image.id}><div className="gallery-edit-image-heading"><b>IMAGE {String(index + 1).padStart(2, '0')}</b>{!readOnly && <div><button type="button" disabled={busy} onClick={() => addAfter(image.id)} aria-label={`Add image after image ${index + 1}`}><Plus size={18}/></button><button type="button" disabled={busy} onClick={() => setImages(current => current.filter(value => value.id !== image.id))} aria-label={`Remove image ${index + 1}`}><Trash2 size={16}/></button></div>}</div><ImageUpload scope="gallery" label={`Image ${index + 1}`} value={image.url} disabled={readOnly || saving || batch} onUploadingChange={delta => setUploads(count => count + delta)} onChange={url => update(image.id, 'url', url)}/><label className="gallery-image-title"><span>Image title</span><input value={image.title} maxLength={255} disabled={readOnly || saving} placeholder="Give this moment a title" onChange={event => update(image.id, 'title', event.target.value)}/></label></section>)}</div>
      {!readOnly && <button type="button" className="gallery-add-image" disabled={busy} onClick={() => setImages(current => [...current, emptyImage()])}><Plus size={22}/>Add another image</button>}
      <div className="gallery-publish"><h2>Review & publish</h2><label>Visibility<select value={status} disabled={readOnly || busy} onChange={event => setStatus(event.target.value)}><option value="draft">Draft — admin only</option><option value="published">Published — visible in gallery</option><option value="unpublished">Unpublished — hidden</option></select></label><p>Every saved, published image appears in the gallery with its own title.</p></div>
      {error && <p className="form-message error gallery-upload-errors" role="alert">{error}</p>}
      <div className="editor-actions"><button type="button" disabled={busy} onClick={close}>{readOnly ? 'Close' : 'Cancel'}</button>{!readOnly && <button className="btn btn-primary" type="button" disabled={busy} onClick={save}>{saving ? 'Saving...' : busy ? 'Uploading...' : <><Save size={17}/>Save gallery</>}</button>}</div>
    </div><WebsitePreview payload={preview} title="Gallery website preview"/></div>
  </section></div>;
}

