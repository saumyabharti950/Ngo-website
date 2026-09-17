import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { assetUrl } from "../lib/api";

function Hero() {
  const heroRef = useRef(null);
  const { settings } = useSiteSettings();
  const general = settings.general || {};
  const banners = Object.values(settings.banners || {}).filter(Boolean);
  const [bannerIndex, setBannerIndex] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setBannerIndex((value) => value + 1), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    let frameId;
    const updateScrollDepth = () => {
      frameId = null;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--scroll-depth", Math.max(-1, Math.min(1, -rect.top / rect.height)).toFixed(3));
    };
    const onScroll = () => { if (!frameId) frameId = requestAnimationFrame(updateScrollDepth); };
    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      hero.style.setProperty("--mouse-x", x.toFixed(3));
      hero.style.setProperty("--mouse-y", y.toFixed(3));
      hero.style.setProperty("--glow-x", `${((x + .5) * 100).toFixed(1)}%`);
      hero.style.setProperty("--glow-y", `${((y + .5) * 100).toFixed(1)}%`);
    };
    const resetPointer = () => { hero.style.setProperty("--mouse-x", "0"); hero.style.setProperty("--mouse-y", "0"); };
    updateScrollDepth();
    window.addEventListener("scroll", onScroll, { passive: true });
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", resetPointer);
    return () => { window.removeEventListener("scroll", onScroll); hero.removeEventListener("pointermove", onPointerMove); hero.removeEventListener("pointerleave", resetPointer); if (frameId) cancelAnimationFrame(frameId); };
  }, []);

  return <section id="home" className="hero" ref={heroRef}>
    <div className="hero-background" aria-hidden="true" style={banners.length ? { backgroundImage: `url(${JSON.stringify(assetUrl(banners[bannerIndex % banners.length]))})` } : undefined} />
    <div className="hero-cursor-glow" aria-hidden="true" />
    <div className="hero-particles" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} />)}</div>
    <div className="container hero-container"><div className="hero-content">
      <div className="hero-badge hero-reveal hero-reveal-up"><span />SECTION 8 NOT-FOR-PROFIT ORGANISATION</div>
      <h1 aria-label="Creating Opportunities. Strengthening Communities."><span className="hero-title-line hero-reveal hero-reveal-right">Creating Opportunities.</span><span className="hero-title-line accent hero-reveal hero-reveal-left">Strengthening Communities.</span></h1>
      <p className="hero-tagline hero-reveal hero-reveal-up">{general.tagline ?? "HEALTH | LEARN | SKILL | EARN"}</p>
      <p className="hero-description hero-reveal hero-reveal-up">{general.website_description ?? "Social Initiative for India Foundation works with communities and institutions to create inclusive, evidence-based and sustainable development solutions."}</p>
      <div className="hero-buttons hero-reveal hero-reveal-up"><a className="btn btn-primary hero-btn" href="#partnerships">Partner With Us <ArrowRight size={18}/></a><a className="btn btn-outline-light" href="#work">Explore Our Work</a></div>
    </div><div className="hero-floating-card hero-reveal hero-reveal-left"><div className="play-button"><Play size={20} fill="currentColor" /></div><div><strong>Community-led action</strong><span>Practical solutions, lasting impact</span></div></div></div>
    <div className="hero-scroll-cue" aria-hidden="true"><span />Scroll to explore</div>
  </section>;
}
export default Hero;
