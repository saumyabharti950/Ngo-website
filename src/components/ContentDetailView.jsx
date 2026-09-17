import { assetUrl } from "../lib/api";
import { labelize } from "../../shared/settings";

export default function ContentDetailView({ item }) {
  const images = [...new Set([item.featuredImage, item.image1, item.image2, item.image3, item.image4].filter(Boolean))];
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
