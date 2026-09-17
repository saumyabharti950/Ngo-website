import { assetUrl } from "../lib/api";
import { labelize } from "../../shared/settings";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { collectionThemes, readingTime } from "./ContentCollection";
import GalleryView from "./GalleryView";

function ReadingBlocks({ text }) {
  return String(text || "").split(/\n\s*\n/).filter(Boolean).map((block, index) => <p key={index}>{block}</p>);
}

export default function ContentDetailView({ item }) {
  if (item.module === 'gallery') return <GalleryView items={[item]}/>;
  const images = [...new Set([item.featuredImage, item.image1, item.image2, item.image3, item.image4].filter(Boolean))];
  const theme = collectionThemes[item.module];
  if (theme) {
    const details = Object.entries(item.payload || {}).filter(([key, value]) => !['altText', 'metaKeywords', 'programmeId', 'overview'].includes(key) && value != null && value !== '');
    const tags = Array.isArray(item.tags) ? item.tags : [];
    return <div className={`editorial-page editorial-${item.module} editorial-detail`}><div className="container">
      <a className="editorial-back" href={theme.path}><ArrowLeft size={16}/>Back to all {theme.noun}</a>
      <header className="editorial-detail-header"><span className="editorial-eyebrow">{item.category || theme.label}</span><h1>{item.title}</h1><p>{item.shortDescription}</p><div className="editorial-byline"><span className="editorial-author-mark">S</span><span><strong>SIFI Foundation</strong><small>People. Purpose. Possibility.</small></span>{item.module === 'blogs' && <span className="editorial-reading"><Clock size={14}/>{readingTime(item)} min read</span>}</div></header>
      {images[0] && <div className="editorial-detail-cover"><img src={assetUrl(images[0])} alt={item.payload?.altText || item.title}/></div>}
      <div className="editorial-reading-layout"><article className="editorial-prose"><div className="editorial-lead"><ReadingBlocks text={item.description}/></div><ReadingBlocks text={item.content}/>{details.length > 0 && <div className="editorial-details">{details.map(([key, value]) => <section key={key}><span className="editorial-eyebrow">{labelize(key)}</span><ReadingBlocks text={Array.isArray(value) ? value.join('\n') : typeof value === 'object' ? JSON.stringify(value) : String(value)}/></section>)}</div>}{tags.length > 0 && <div className="editorial-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div>}</article><aside className="editorial-reading-aside"><span className="editorial-eyebrow">A SHARED PURPOSE</span><h2>Stronger communities.<br/>Greater possibilities.</h2><p>Meaningful development begins with listening, grows through partnership and puts people first.</p><a href="/contact">Connect with our team<ArrowUpRight size={18}/></a><a href={theme.path}>Explore more {theme.noun}<ArrowUpRight size={18}/></a></aside></div>
      {images.length > 1 && <div className="editorial-detail-gallery">{images.slice(1).map((src, index) => <img key={src} src={assetUrl(src)} alt={`${item.title} — image ${index + 2}`} loading="lazy"/>)}</div>}
    </div></div>;
  }
  return <section className="site-page"><div className="container">
    <div className="page-intro"><span>{labelize(item.module)}</span><h1>{item.title}</h1><p>{item.shortDescription}</p></div>
    {images.length > 0 && <div className="gallery-grid detail-gallery">{images.map((image) => <img key={image} src={assetUrl(image)} alt={item.payload?.altText || item.title} />)}</div>}
    <article className="admin-card public-detail">
      {item.category && <p>{item.category}</p>}
      {item.description && <p>{item.description}</p>}{item.content && <p>{item.content}</p>}
      {Object.entries(item.payload || {}).filter(([key, value]) => !['altText', 'metaKeywords', 'programmeId'].includes(key) && value != null && value !== '').map(([key, value]) => <section key={key}><h2>{labelize(key)}</h2><p>{Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value)}</p></section>)}
    </article>
  </div></section>;
}
