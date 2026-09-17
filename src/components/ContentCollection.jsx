import { useState } from "react";
import { ArrowUpRight, ArrowRight, Search, Sprout, BookOpen, Heart, Clock, X } from "lucide-react";
import { assetUrl } from "../lib/api";
import "./ContentCollection.css";

export const collectionThemes = {
  blogs: { label: "THE SIFI JOURNAL", title: "Perspectives that", emphasis: "move us forward.", text: "Ideas, insights and thoughtful conversations on building a more inclusive future. Explore the thinking behind our work.", noun: "articles", action: "Read article", heading: "Ideas worth exploring", feature: "In focus", icon: BookOpen, path: "/blog" },
  programmes: { label: "OUR DEVELOPMENT PROGRAMMES", title: "Purpose in action.", emphasis: "Possibility for all.", text: "From learning and livelihoods to healthier communities. Discover interconnected programmes shaped by local voices and built around opportunity.", noun: "programmes", action: "Explore programme", heading: "Pathways to opportunity", feature: "Programme spotlight", icon: Sprout, path: "/programmes" },
  impact_stories: { label: "PEOPLE & POSSIBILITIES", title: "Every change begins", emphasis: "with a human story.", text: "Explore the people-centred ideas and impact pathways behind our work. A closer look at how opportunity, participation and care can shape lasting change.", noun: "stories", action: "Explore story", heading: "A closer look at change", feature: "Featured perspective", icon: Heart, path: "/impact-stories" }
};

export function readingTime(item) {
  return Math.max(1, Math.ceil(`${item.description || ""} ${item.content || ""}`.trim().split(/\s+/).length / 220));
}

export function EditorialCard({ item, module, index = 0, spotlight = false }) {
  const theme = collectionThemes[module];
  const Icon = theme.icon;
  const src = item.featuredImage || item.image1;
  return <article className={`editorial-card ${spotlight ? "editorial-spotlight" : ""}`}>
    <a className="editorial-card-link" href={`${theme.path}/${encodeURIComponent(item.slug)}`}>
      <div className="editorial-card-media">
        {src ? <img src={assetUrl(src)} alt={item.payload?.altText || ""} loading={spotlight ? "eager" : "lazy"} /> : <div className="editorial-image-fallback"><Icon size={60} strokeWidth={1} /></div>}
        <span className="editorial-image-shade" />
        <span className="editorial-image-label"><Icon size={13} />{spotlight ? theme.feature : module === "programmes" ? "Development programme" : module === "impact_stories" ? "People & possibilities" : "SIFI Journal"}</span>
        <span className="editorial-image-arrow"><ArrowUpRight size={21} /></span>
      </div>
      <div className="editorial-card-copy">
        <div className="editorial-card-meta"><span>{item.category || theme.label}</span>{module === "blogs" ? <span className="editorial-read-time"><Clock size={12} />{readingTime(item)} min read</span> : <span className="editorial-index">{String(index + 1).padStart(2, "0")}</span>}</div>
        <h2>{item.title}</h2>
        <p>{item.shortDescription || item.description || item.content}</p>
        {spotlight && <div className="editorial-feature-note"><span />{module === "programmes" ? "Community-led. Evidence-informed." : module === "blogs" ? "A perspective from SIFI Foundation" : "Dignity at the heart of development"}</div>}
        <div className="editorial-card-footer"><span>{theme.action}</span><ArrowRight size={18} /></div>
      </div>
    </a>
  </article>;
}

export default function ContentCollection({ module, items, loading, error }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const theme = collectionThemes[module];
  const Icon = theme.icon;
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
  const filtered = items.filter(item => (category === "all" || item.category === category) && `${item.title} ${item.shortDescription || ""} ${item.category || ""} ${Array.isArray(item.tags) ? item.tags.join(" ") : item.tags || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const featured = items.find(item => item.featured) || items[0];
  const searching = Boolean(query.trim()) || category !== "all";
  const clear = () => { setQuery(""); setCategory("all"); };
  return <div className={`editorial-page editorial-${module}`}>
    <header className="editorial-hero"><div className="container">
      <nav className="editorial-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>{module === "blogs" ? "Journal" : module === "programmes" ? "Programmes" : "Impact stories"}</span></nav>
      <div className="editorial-hero-layout"><div><span className="editorial-eyebrow"><span />{theme.label}</span><h1>{theme.title}<br/><em>{theme.emphasis}</em></h1></div><div className="editorial-hero-aside"><div className="editorial-emblem" aria-hidden="true"><Icon size={31} strokeWidth={1.3} /></div><p>{theme.text}</p><a href="#collection">Explore {theme.noun}<ArrowRight size={17} /></a></div></div>
      <div className="editorial-hero-rule"><span>SOCIAL INITIATIVE FOR INDIA FOUNDATION</span><span>People. Purpose. Possibility.</span></div>
    </div></header>
    <div className="container editorial-main">
      {!loading && !error && featured && !searching && <section className="editorial-feature" aria-label={theme.feature}><EditorialCard item={featured} module={module} spotlight /></section>}
      <section id="collection" className="editorial-collection" aria-labelledby="collection-title">
        <div className="editorial-section-heading"><div><span className="editorial-eyebrow">EXPLORE THE COLLECTION</span><h2 id="collection-title">{theme.heading}<span>.</span></h2></div><p>Discover a perspective.<br/>Find a place to begin.</p></div>
        <div className="editorial-toolbar"><div className="editorial-filter"><label htmlFor="collection-category">Explore by topic</label><select id="collection-category" value={category} onChange={event => setCategory(event.target.value)}><option value="all">All {theme.noun}</option>{categories.map(value => <option key={value} value={value}>{value}</option>)}</select></div><div className="editorial-search"><Search size={18}/><input aria-label={`Search ${theme.noun}`} placeholder={`Search ${theme.noun}...`} value={query} onChange={event => setQuery(event.target.value)} type="search" /></div></div>
        {loading ? <div className="editorial-skeletons" role="status" aria-label="Loading content">{[1,2,3].map(n => <div key={n}><span/><span/><span/></div>)}</div> : error ? <div className="editorial-empty" role="alert"><Icon size={30}/><h3>We couldn’t load the collection</h3><p>Please try again in a moment.</p><button onClick={() => window.dispatchEvent(new Event("content-updated"))}>Try again <ArrowRight size={16}/></button></div> : <>
          <div className="editorial-results" role="status">{filtered.length} {theme.noun}{searching ? " found" : " to explore"}{searching && <button onClick={clear}>Clear filters <X size={13}/></button>}</div>
          {filtered.length ? <div className="editorial-grid">{filtered.map((item, index) => <EditorialCard key={item.id || item.slug} item={item} module={module} index={index}/>)}</div> : <div className="editorial-empty"><Search size={30}/><h3>{searching ? "A different perspective awaits" : "New perspectives are on their way"}</h3><p>{searching ? "Try another keyword or explore all topics." : "Check back soon for new additions to this collection."}</p>{searching && <button onClick={clear}>Explore all {theme.noun}<ArrowRight size={16}/></button>}</div>}
        </>}
      </section>
      <section className="editorial-invitation"><div className="editorial-invitation-icon" aria-hidden="true"><Sprout size={43} strokeWidth={1}/></div><div><span className="editorial-eyebrow">THE NEXT CHAPTER STARTS WITH YOU</span><h2>Good ideas grow through partnership.</h2><p>Bring your skills, perspective or purpose. Let’s build possibilities together.</p></div><a href="/get-involved">Get involved<ArrowUpRight size={20}/></a></section>
    </div>
  </div>;
}
