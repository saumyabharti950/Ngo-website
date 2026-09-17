import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Plus, Minus, Maximize2, X, Images } from 'lucide-react';
import { galleryImages } from '../../shared/gallery';
import { assetUrl } from '../lib/api';
import './Gallery.css';

function GalleryLightbox({ images, initial, close }) {
  const [index, setIndex] = useState(initial);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef(null);
  const image = images[index];
  const move = delta => { setIndex(current => (current + delta + images.length) % images.length); setZoom(1); };
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; element.showModal();
    return () => { element.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(<dialog ref={dialog} className="gallery-lightbox" aria-labelledby="gallery-lightbox-title" onCancel={event => {event.preventDefault(); close();}} onKeyDown={event => { if (event.key === 'ArrowRight') {event.preventDefault(); move(1);} if (event.key === 'ArrowLeft') {event.preventDefault(); move(-1);} }}>
    <div className="gallery-lightbox-top"><span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span><div><button type="button" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .5))} aria-label="Zoom out"><Minus size={19}/></button><span aria-live="polite">{Math.round(zoom * 100)}%</span><button type="button" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .5))} aria-label="Zoom in"><Plus size={19}/></button><button type="button" onClick={close} aria-label="Close image viewer" autoFocus><X size={24}/></button></div></div>
    <div className="gallery-lightbox-stage" key={`${index}-${zoom}`}><div className="gallery-zoom-canvas" style={{width: `${zoom * 100}%`, height: `${zoom * 100}%`}}><img src={assetUrl(image.url)} alt={image.title}/></div></div>
    <footer className="gallery-lightbox-caption"><div><span>COMMUNITY MOMENTS</span><h2 id="gallery-lightbox-title">{image.title}</h2></div>{images.length > 1 && <div><button type="button" onClick={() => move(-1)} aria-label="Previous image"><ArrowLeft size={22}/></button><button type="button" onClick={() => move(1)} aria-label="Next image"><ArrowRight size={22}/></button></div>}</footer>
  </dialog>, document.body);
}

export function GalleryGrid({ items }) {
  const images = items.flatMap(item => galleryImages(item).map(image => ({...image, key: `${item.id || item.slug || 'preview'}-${image.id || image.url}`})));
  const [active, setActive] = useState(null);
  return <><div className="moment-grid">{images.map((image, index) => <figure className="moment-card" key={`${image.key}-${index}`}><button type="button" className="moment-photo" onClick={() => setActive(index)} aria-label={`Zoom image: ${image.title}`}><img src={assetUrl(image.url)} alt={image.title} loading="lazy"/><span className="moment-photo-shade"/><span className="moment-number">{String(index + 1).padStart(2, '0')}</span><span className="moment-expand"><Maximize2 size={18}/></span></button><figcaption><span/>{image.title}</figcaption></figure>)}</div>{active !== null && images[active] && <GalleryLightbox images={images} initial={active} close={() => setActive(null)}/>}</>;
}

export default function GalleryView({ items, loading = false, error = '' }) {
  const total = items.reduce((count, item) => count + galleryImages(item).length, 0);
  return <section className="moments-page"><div className="container"><header className="moments-header"><span className="moments-eyebrow">THE SIFI GALLERY</span><div><h1>A thousand words.<br/><em>One shared humanity.</em></h1><div className="moments-header-mark" aria-hidden="true"><Images size={36} strokeWidth={1}/><span>PEOPLE & PURPOSE</span></div></div><div className="moments-header-bottom"><span>Moments of community, connection and possibility.</span>{!loading && !error && <span>{String(total).padStart(2, '0')} PHOTOGRAPHS</span>}</div></header>
    {loading ? <p role="status" className="moments-state">Loading photographs...</p> : error ? <div className="moments-state" role="alert"><p>Photographs couldn’t be loaded.</p><button type="button" onClick={() => window.dispatchEvent(new Event('content-updated'))}>Try again</button></div> : total ? <GalleryGrid items={items}/> : <p className="moments-state">New moments are on their way. Check back soon.</p>}
  </div></section>;
}
