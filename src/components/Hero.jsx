import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, HeartHandshake, Play, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { assetUrl } from "../lib/api";

const fallbackSlides = [
  "/images/cover.png",
  "/images/hero.jpg",
  "/images/Takeaction.png",
  "/images/Getinvolbed.png",
].map((src) => ({ src }));

function useHomeFonts() {
  useEffect(() => {
    if (document.getElementById("bsf-home-fonts")) return;
    const link = document.createElement("link");
    link.id = "bsf-home-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);
}

export default function Hero() {
  useHomeFonts();
  const heroRef = useRef(null);
  const { settings } = useSiteSettings();
  const general = settings.general || {};
  const slides = useMemo(() => {
    const configured = Object.values(settings.banners || {}).filter(Boolean).map((src) => ({ src: assetUrl(src) }));
    return configured.length ? configured : fallbackSlides;
  }, [settings.banners]);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => setBannerIndex((value) => (value + 1) % slides.length), 5600);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(2)}%`);
      hero.style.setProperty("--my", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(2)}%`);
    };
    hero.addEventListener("pointermove", onPointerMove);
    return () => hero.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <section id="home" className="bsf-hero" ref={heroRef}>
      <div className="bsf-hero-bg" aria-hidden="true" />
      <div className="bsf-cinema-lines" aria-hidden="true" />
      <div className="bsf-hero-shell">
        <div className="bsf-hero-copy">
          <span className="bsf-mini bsf-rise">FOR EVERY CHILD, FAMILY AND COMMUNITY</span>
          <h1 className="bsf-rise" style={{ "--d": "70ms" }}>Empowering Underprivileged Childre</h1>
          <p className="bsf-hero-desc bsf-rise" style={{ "--d": "150ms" }}>
            {general.website_description || "Creating opportunities through healthcare, education, livelihoods and community-led development programmes."}
          </p>
          <div className="bsf-hero-actions bsf-rise" style={{ "--d": "230ms" }}>
            <a className="bsf-btn bsf-btn-yellow" href="/donate">Donate now <HeartHandshake size={15} /></a>
            <a className="bsf-btn bsf-btn-white" href="#causes">Explore causes <ArrowRight size={15} /></a>
          </div>
          <div className="bsf-hero-note bsf-rise" style={{ "--d": "310ms" }}>
            <ShieldCheck size={15} /> Section 8 not-for-profit organisation
          </div>
        </div>

        <div className="bsf-hero-photo bsf-rise" style={{ "--d": "120ms" }}>
          <div className="bsf-film-frame">
            {slides.map((slide, index) => (
              <img
                key={`${slide.src}-${index}`}
                className={index === bannerIndex ? "active" : ""}
                src={slide.src}
                alt={index === bannerIndex ? general.website_name || "SIFI Foundation community work" : ""}
                aria-hidden={index !== bannerIndex}
              />
            ))}
          </div>
          <div className="bsf-film-shade" aria-hidden="true" />
          <div className="bsf-film-sweep" aria-hidden="true" />
          <div className="bsf-video-chip"><Play size={14} fill="currentColor" /> Watch our work</div>
          <div className="bsf-slide-dots" aria-label="Hero slides">
            {slides.map((slide, index) => (
              <button
                key={`${slide.src}-dot`}
                className={index === bannerIndex ? "active" : ""}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setBannerIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="bsf-hero-strip">
        <span><CheckCircle2 size={14} /> Trusted programmes</span>
        <span><CheckCircle2 size={14} /> Transparent giving</span>
        <span><CheckCircle2 size={14} /> Community first</span>
      </div>

      <style>{`
        .bsf-hero{
          --navy:#101c3a; --pink:#ff1576; --yellow:#ffc20f; --green:#05b36b; --soft:#fff2b9; --line:#e9edf4;
          position:relative; overflow:hidden; background:
            radial-gradient(900px circle at var(--mx) var(--my), rgba(255,21,118,.18), transparent 58%),
            linear-gradient(125deg,#fff5c4 0%,#f8fff0 36%,#e7fff3 60%,#fff0bd 100%);
          color:var(--navy); font-family:Inter,system-ui,sans-serif;
          --mx:70%; --my:30%;
        }
        .bsf-hero *{ box-sizing:border-box; }
        .bsf-hero-bg{ position:absolute; inset:-20%; pointer-events:none; opacity:.75; background:url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23111b3a' stroke-opacity='.08' stroke-width='2'%3E%3Cpath d='M24 42h46v46H24zM150 28c18 0 32 14 32 32s-14 32-32 32-32-14-32-32 14-32 32-32ZM42 166c38-42 75-42 112 0'/%3E%3C/g%3E%3C/svg%3E"); animation:bsfPatternDrift 22s linear infinite; }
        .bsf-cinema-lines{ position:absolute; inset:0; pointer-events:none; opacity:.16; background:repeating-linear-gradient(180deg, transparent 0 8px, rgba(16,28,58,.16) 9px 10px); mix-blend-mode:multiply; }
        .bsf-hero-shell{ position:relative; width:min(1180px, calc(100% - 34px)); margin:0 auto; min-height:590px; display:grid; grid-template-columns:.82fr 1.18fr; align-items:center; gap:42px; padding:54px 0 42px; }
        .bsf-mini{ display:inline-flex; color:var(--green); font-size:11px; font-weight:900; letter-spacing:.9px; text-transform:uppercase; margin-bottom:12px; }
        .bsf-hero h1{ max-width:10ch; margin:0; color:var(--pink); font-size:clamp(42px, 6vw, 76px); line-height:.88; letter-spacing:0; font-weight:900; }
        .bsf-hero-desc{ max-width:430px; margin:18px 0 0; color:#596277; font-size:15px; line-height:1.75; }
        .bsf-hero-actions{ display:flex; gap:11px; flex-wrap:wrap; margin-top:24px; }
        .bsf-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:40px; padding:0 18px; border-radius:999px; border:1px solid transparent; font-size:12px; font-weight:900; text-decoration:none; transition:transform .25s ease, box-shadow .25s ease, background .25s ease; }
        .bsf-btn:hover{ transform:translateY(-2px); }
        .bsf-btn-yellow{ background:var(--yellow); color:#17203d; box-shadow:0 13px 22px rgba(255,194,15,.25); }
        .bsf-btn-white{ background:#fff; color:#17203d; border-color:#e6e9f0; }
        .bsf-hero-note{ display:inline-flex; align-items:center; gap:7px; margin-top:18px; color:#657084; font-size:12px; font-weight:700; }
        .bsf-hero-note svg{ color:var(--green); }
        .bsf-hero-photo{ position:relative; align-self:stretch; min-height:455px; border-radius:0 0 0 88px; overflow:hidden; box-shadow:0 30px 85px rgba(21,29,58,.24), 0 0 0 8px rgba(255,255,255,.52); background:#10233e; transform:perspective(900px) rotateY(-3deg); }
        .bsf-film-frame{ position:absolute; inset:0; overflow:hidden; }
        .bsf-film-frame img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; display:block; opacity:0; transform:scale(1.14) translateX(26px); filter:saturate(1.13) contrast(1.04); transition:opacity 1s ease, transform 6.2s ease; }
        .bsf-film-frame img.active{ opacity:1; transform:scale(1.04) translateX(-16px); animation:bsfKenBurns 5.8s ease-in-out both; }
        .bsf-film-shade{ position:absolute; inset:0; background:linear-gradient(90deg, rgba(16,28,58,.24), transparent 45%, rgba(255,194,15,.13)), radial-gradient(500px circle at 12% 15%, rgba(255,21,118,.22), transparent 55%); pointer-events:none; }
        .bsf-film-sweep{ position:absolute; inset:-35% -90%; pointer-events:none; background:linear-gradient(105deg, transparent 42%, rgba(255,255,255,.34) 49%, transparent 56%); animation:bsfFilmSweep 5.6s ease-in-out infinite; }
        .bsf-video-chip{ position:absolute; right:18px; bottom:18px; display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:999px; background:rgba(255,255,255,.93); color:var(--pink); font-size:12px; font-weight:900; box-shadow:0 12px 24px rgba(16,28,58,.16); }
        .bsf-slide-dots{ position:absolute; left:18px; bottom:19px; display:flex; gap:7px; padding:8px; border-radius:999px; background:rgba(16,28,58,.38); backdrop-filter:blur(8px); }
        .bsf-slide-dots button{ width:8px; height:8px; border:0; border-radius:999px; background:rgba(255,255,255,.62); padding:0; transition:width .28s ease, background .28s ease; }
        .bsf-slide-dots button.active{ width:28px; background:var(--yellow); }
        .bsf-hero-strip{ position:relative; display:flex; justify-content:center; gap:30px; flex-wrap:wrap; padding:12px 18px; background:#111b3a; border-top:1px solid rgba(255,255,255,.08); border-bottom:1px solid rgba(255,255,255,.08); color:#fff; font-size:12px; font-weight:800; }
        .bsf-hero-strip span{ display:inline-flex; align-items:center; gap:6px; }
        .bsf-hero-strip svg{ color:var(--green); }
        .bsf-rise{ opacity:0; transform:translateY(18px); animation:bsfRise .72s cubic-bezier(.19,1,.22,1) var(--d,0s) forwards; }
        @keyframes bsfRise{ to{ opacity:1; transform:none; } }
        @keyframes bsfKenBurns{ 0%{ transform:scale(1.14) translateX(28px); } 100%{ transform:scale(1.04) translateX(-16px); } }
        @keyframes bsfFilmSweep{ 0%,28%{ transform:translateX(-22%); opacity:0; } 44%{ opacity:.9; } 74%,100%{ transform:translateX(22%); opacity:0; } }
        @keyframes bsfPatternDrift{ to{ transform:translate3d(-80px,70px,0); } }
        @media (max-width: 860px){
          .bsf-hero-shell{ grid-template-columns:1fr; padding-top:30px; }
          .bsf-hero h1{ max-width:12ch; }
          .bsf-hero-photo{ min-height:330px; border-radius:22px; order:-1; }
        }
        @media (max-width: 520px){
          .bsf-hero-shell{ width:min(100% - 24px, 1180px); gap:24px; }
          .bsf-hero h1{ font-size:42px; }
          .bsf-hero-actions .bsf-btn{ width:100%; }
          .bsf-hero-strip{ justify-content:flex-start; gap:12px; }
        }
        @media (prefers-reduced-motion: reduce){ .bsf-hero *{ animation:none !important; transition:none !important; opacity:1 !important; transform:none !important; } }
      `}</style>
    </section>
  );
}
