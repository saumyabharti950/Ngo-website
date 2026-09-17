import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { assetUrl } from "../lib/api";
import { safeBannerUrl } from "../../shared/pageSliders";

export default function PageBanner({ slides, initialIndex = 0, preview = false }) {
  const [index, setIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (preview || paused || hovered || focused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((value) => (value + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length, preview, paused, hovered, focused]);
  if (!slides.length) return null;
  const currentIndex = Math.min(index, slides.length - 1);
  const slide = slides[currentIndex];
  const move = (delta) => setIndex((currentIndex + delta + slides.length) % slides.length);
  return <section className={`page-banner align-${slide.align || "left"}`} aria-roledescription="carousel" aria-label="Page highlights" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {slide.image ? <img className="page-banner-image" src={assetUrl(slide.image)} alt={slide.alt || ""} /> : <div className="page-banner-placeholder">Your banner image</div>}
    <div className="page-banner-shade" />
    <div className="container page-banner-content" key={slide.id}>
      {slide.eyebrow && <span className="page-banner-eyebrow">{slide.eyebrow}</span>}
      {slide.title && <h1>{slide.title}</h1>}
      {slide.description && <p>{slide.description}</p>}
      {slide.buttonText && safeBannerUrl(slide.buttonUrl) && <a className="btn btn-primary" href={slide.buttonUrl}>{slide.buttonText}<ArrowRight size={17} /></a>}
    </div>
    {slides.length > 1 && <div className="page-banner-controls">
      <button type="button" aria-label="Previous slide" onClick={() => move(-1)}><ArrowLeft size={18} /></button>
      <div className="page-banner-dots">{slides.map((item, position) => <button type="button" key={item.id} className={position === currentIndex ? "active" : ""} aria-label={`Show slide ${position + 1}`} aria-current={position === currentIndex ? "true" : undefined} onClick={() => setIndex(position)} />)}</div>
      <span>{currentIndex + 1} / {slides.length}</span>
      <button type="button" aria-label="Next slide" onClick={() => move(1)}><ArrowRight size={18} /></button>
      {!preview && <button type="button" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
    </div>}
  </section>;
}
