import { useEffect, useState } from "react";
import { Megaphone, ArrowUpRight } from "lucide-react";
import { api, assetUrl } from "../lib/api";

export default function NoticeStrip() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api("/content/public/notices").then((rows) => setItems(rows.slice(0, 6))).catch(() => setItems([]));
  }, []);
  if (!items.length) return null;
  return <section className="notice-strip">
    <div className="container notice-shell">
      <div className="notice-heading"><span><Megaphone /> Notices</span><h2>Latest updates</h2></div>
      <div className="notice-marquee">
        {[...items, ...items].map((item, index) => <article className="notice-card" key={`${item.id}-${index}`}>
          {item.featuredImage && <img src={assetUrl(item.featuredImage)} alt="" />}
          <div><span>{item.category || "Notice"}</span><h3>{item.title}</h3><p>{item.shortDescription || item.description}</p></div>
          {(item.videoUrl || item.payload?.websiteUrl) && <a href={item.videoUrl || item.payload.websiteUrl} target="_blank" rel="noreferrer"><ArrowUpRight size={16} /></a>}
        </article>)}
      </div>
    </div>
  </section>;
}
