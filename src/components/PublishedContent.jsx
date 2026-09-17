import { useEffect, useState } from "react";
import { api, assetUrl } from "../lib/api";
import { EditorialCard, collectionThemes } from "./ContentCollection";
import { GalleryGrid } from "./GalleryView";

export const contentPaths = { gallery: "/gallery", programmes: "/programmes", impact_stories: "/impact-stories", blogs: "/blog" };

export function usePublishedContent(module) {
  const [state, setState] = useState({ module, items: [], loading: true, error: "" });
  useEffect(() => {
    let current = true;
    const load = () => {
      api(`/content/public/${module}`).then((items) => {
        if (current) setState({ module, items, loading: false, error: "" });
      }).catch((error) => {
        if (current) setState({ module, items: [], loading: false, error: error.message });
      });
    };
    load();
    window.addEventListener("focus", load);
    window.addEventListener("content-updated", load);
    return () => { current = false; window.removeEventListener("focus", load); window.removeEventListener("content-updated", load); };
  }, [module]);
  return state.module === module ? state : { items: [], loading: true, error: "" };
}

export function ContentCards({ items, module }) {
  if (module === 'gallery') return <GalleryGrid items={items}/>;
  if (collectionThemes[module]) return <div className="editorial-grid">{items.map((item, index) => <EditorialCard key={item.id || item.slug} item={item} module={module} index={index} />)}</div>;
  return <div className="page-card-grid cms-card-grid">{items.map((item) => <article key={item.id}>
    {(item.featuredImage || item.image1) && <a href={`${contentPaths[module]}/${encodeURIComponent(item.slug)}`}><img src={assetUrl(item.featuredImage || item.image1)} alt={item.payload?.altText || item.title} /></a>}
    {item.category && <span className="small-label">{item.category}</span>}
    <h2>{item.title}</h2><p>{item.shortDescription || item.description || item.content}</p>
    <a className="table-action" href={`${contentPaths[module]}/${encodeURIComponent(item.slug)}`}>View Details</a>
  </article>)}</div>;
}

export function PublishedContentSection({ module, title, id }) {
  const { items, loading, error } = usePublishedContent(module);
  return <section className="cms-section" id={id}><div className="container">
    <div className="section-heading"><h2>{title}</h2></div>
    {loading ? <p role="status">Loading...</p> : error ? <p role="alert">Unable to load {title.toLowerCase()}. Please try again later.</p> : items.length ? <ContentCards items={items.slice(0, 3)} module={module} /> : <p>No published {title.toLowerCase()} yet.</p>}
    <a className="table-action" href={contentPaths[module]}>View all {title.toLowerCase()}</a>
  </div></section>;
}
